#!/bin/bash

# Read variables from environment (set by GitHub Actions)
SFTP_HOST="${SFTP_HOST}"
SFTP_USER="${SFTP_USER}"
SFTP_PASS="${SFTP_PASS}"
LOCAL_DIR="${LOCAL_DIR}"
REMOTE_DIR="${REMOTE_DIR}"

# Basic check for required variables
for var in SFTP_HOST SFTP_USER SFTP_PASS LOCAL_DIR REMOTE_DIR; do
  if [[ -z "${!var}" ]]; then
    echo "Error: $var is not set."
    exit 1
  fi
done

# Check for lftp
if ! command -v lftp &> /dev/null; then
  echo "lftp not found, installing..."
  sudo apt-get update && sudo apt-get install -y lftp
fi

# Upload with lftp
lftp -u "$SFTP_USER","$SFTP_PASS" sftp://$SFTP_HOST <<EOF
set ssl:verify-certificate no
mkdir -p "$REMOTE_DIR"
mirror -R "$LOCAL_DIR" "$REMOTE_DIR"
bye
EOF