#!/bin/bash

set -e

# --- Environment variables ---
SFTP_HOST="${SFTP_HOST}"
SFTP_USER="${SFTP_USER}"
SFTP_PASS="${SFTP_PASS}"
LOCAL_DIR="${LOCAL_DIR}"
REMOTE_DIR="${REMOTE_DIR}"
ZIP_NAME="upload.zip"

# --- Sanity checks ---
for var in SFTP_HOST SFTP_USER SFTP_PASS LOCAL_DIR REMOTE_DIR; do
  if [[ -z "${!var}" ]]; then
    echo "Error: $var is not set!"
    exit 1
  fi
done

# Install dependencies
if ! command -v lftp &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y lftp
fi
if ! command -v zip &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y zip
fi

# 1. Zip local directory
zip -r "$ZIP_NAME" "$LOCAL_DIR"

# 2. Upload ZIP file to remote SFTP
lftp -u "$SFTP_USER","$SFTP_PASS" sftp://$SFTP_HOST <<EOF
set sftp:auto-confirm yes
set ssl:verify-certificate no
mkdir -p "$REMOTE_DIR"
put "$ZIP_NAME" -o "$REMOTE_DIR/$ZIP_NAME"
bye
EOF

# 3. Optionally, unzip remotely (requires SSH access)
# Uncomment/set variables if SSH access is available
# SSH_USER="${SFTP_USER}"
# SSH_HOST="${SFTP_HOST}"
# SSH_KEY_PATH="/path/to/private_key"
# ssh -i "$SSH_KEY_PATH" $SSH_USER@$SSH_HOST "unzip -o '$REMOTE_DIR/$ZIP_NAME' -d '$REMOTE_DIR' && rm '$REMOTE_DIR/$ZIP_NAME'"

# 4. Clean up local zip
rm "$ZIP_NAME"