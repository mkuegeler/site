#!/bin/bash

# Read variables from environment (set by GitHub Actions)
SFTP_HOST="${SFTP_HOST}"
SFTP_USER="${SFTP_USER}"
SFTP_PASS="${SFTP_PASS}"
LOCAL_DIR="${LOCAL_DIR}"
REMOTE_DIR="${REMOTE_DIR}"
ZIP_NAME="upload.zip"

# Check for required vars
for var in SFTP_HOST SFTP_USER SFTP_PASS LOCAL_DIR REMOTE_DIR; do
  if [[ -z "${!var}" ]]; then
    echo "Error: $var is not set."
    exit 1
  fi
done

# Install dependencies if needed
if ! command -v lftp &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y lftp
fi

if ! command -v zip &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y zip
fi

# Zip local directory
zip -r "$ZIP_NAME" "$LOCAL_DIR"

# Upload ZIP using lftp
lftp -u "$SFTP_USER","$SFTP_PASS" sftp://$SFTP_HOST <<EOF
set sftp:auto-confirm yes
set ssl:verify-certificate no

# Make sure remote directory exists
cls -1 "$REMOTE_DIR"
if [ \$? = 0 ]; then
  echo "Remote directory exists."
else
  mkdir -p "$REMOTE_DIR"
fi

# Upload zip file
put "$ZIP_NAME" -o "$REMOTE_DIR/$ZIP_NAME"
bye
EOF

# SSH to remote and unzip (requires remote SSH access and SSH key or password!)
# Uncomment and adapt this block if SSH access is available:
# REMOTE_SSH="your_ssh_user@${SFTP_HOST}"
# SSH_KEY_PATH="/path/to/id_rsa"
# ssh -i "$SSH_KEY_PATH" $REMOTE_SSH "unzip -o '$REMOTE_DIR/$ZIP_NAME' -d '$REMOTE_DIR' && rm '$REMOTE_DIR/$ZIP_NAME'"

# Remove local ZIP
rm "$ZIP_NAME"