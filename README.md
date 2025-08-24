# kuegeler.com: web site
This is the source code for the website https://www.kuegeler.com

References:

- https://tailwind-nextjs-starter-blog.vercel.app
- https://github.com/timlrx/tailwind-nextjs-starter-blog


## Prompt 1

Create a static website with next.js using the template: https://vercel.com/templates/blog/tailwind-css-starter-blog
Name of the web site: Michael Kügeler

### Result (OpenAI GPT-4.1)

Step 1: Bootstrap Your Next.js Blog

```bash
npx create-next-app michael-kuegeler-blog -e https://github.com/timlrx/tailwind-nextjs-starter-blog
# Got to foleder
cd michael-kugeler-blog
```

Step 2: Change Website Name

Edit siteMetadata.js (usually in the data folder):

```javascript
// data/siteMetadata.js

const siteMetadata = {
  title: 'Michael Kügeler',
  author: 'Michael Kügeler',
  // ... other settings
}

module.exports = siteMetadata
```

Step 3: Customize the Homepage

Edit the homepage file (usually in pages/index.js):

```javascript
export default function Home() {
  return (
    <main>
      <h1 className="text-4xl font-bold mb-4">Michael Kügeler</h1>
      {/* Rest of the code */}
    </main>
  )
}
```

Step 4: Test locally

```bash
npm run dev
```

Step 4: Update next.config.js for Static Export

Add the following in your next.config.js (or make sure it exists):

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
};

module.exports = nextConfig;
```

Step 5: Build and Export

```bash
# Remove previous build
rm -rf .next

# Remove out folder it exists
rm -rf out

npm run build
# see out folder for results

# Run this in your Next.js directory to auto-fix lint errors:
npm run lint:fix
# or
npx eslint . --fix

```

This creates a out folder (`/out`).

That folder contains all your static site files (HTML, JS, CSS, assets).

Step 6: Upload to Your Web Host

You can upload the contents of the out folder to your web host using FTP, SFTP, or any other method your host supports.

If your website host supports static files:

Upload the `/out` folder’s contents to your website’s root or public directory.

For GitHub Pages: push the contents of `/out` to the gh-pages branch.

For FTP, simply drag-and-drop the contents of /out (not the folder itself, but its contents).

If your site is in a subdirectory (e.g., domain.com/blog/), set `assetPrefix` in `next.config.js`.

## Prompt 2

Write a bash script that connects to a remote sftp server using username and password and copies a local folder to the remote sftp folder.

Prerequisites:

Install lftp `sudo apt-get install lftp` on Ubuntu/Debian.

Change the script to read the SFTP variables from GitHub actions variables if you you are connected to GitHub.

The script:

```bash
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
set sftp:host-key-check no
set ssl:verify-certificate no
mkdir -p "$REMOTE_DIR"
mirror -R "$LOCAL_DIR" "$REMOTE_DIR"
bye
EOF

```

GitHub Actions file

```yaml
name: Deploy Static Website
on:
  push:
    branches:
      - main  # Trigger this workflow on pushes to the 'main' branch
jobs:
  deploy:
    runs-on: ubuntu-latest  # Use the latest Ubuntu runner

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4  # Step 1: Check out your repository code
      - name: SFTP Deploy
        uses: Dylan700/sftp-upload-action@latest
        with:
          server: ${{ secrets.SFTP_SERVER }}
          port: ${{ secrets.SFTP_PORT }}
          username: ${{ secrets.SFTP_USERNAME }}
          password: ${{ secrets.SFTP_PASSWORD }}
          uploads: |
            ./michael-mkuegeler-blog/out/ => /kunden/homepages/29/d1017817976/htdocs/base/
          delete: true  
```

new

```yaml
name: SFTP Upload
# Is a special event that allows you to manually trigger the workflow, e.g. by clicking the “Run workflow” button on the Actions tab in your GitHub repository.
on:
  workflow_dispatch:
jobs:
  upload:
    runs-on: ubuntu-latest
    env:
      SFTP_HOST: ${{ secrets.SFTP_SERVER }}
      SFTP_USER: ${{ secrets.SFTP_USERNAME }}
      SFTP_PASS: ${{ secrets.SFTP_PASSWORD }}
      LOCAL_DIR: ./michael-kuegeler-blog/out # The directory created by Next.js
      REMOTE_DIR: ${{ secrets.SFTP_TARGET }}
    steps:
      - uses: actions/checkout@v3

      - name: Run SFTP upload script
        run: |
          chmod +x ./sftp_upload.sh
          ./sftp_upload.sh
```

## Prompt 3

Write a shell script that deletes the out folder as soon as a new out.zip is available and then unzips the new out.zip.

Script: watch_and_deploy.sh

```bash

#!/bin/bash

ZIP_PATH="./out.zip"
OUT_DIR="./out"

echo "Waiting for out.zip to appear..."
while [ ! -s "$ZIP_PATH" ]; do
    sleep 2
done
echo "out.zip detected."

if [ -d "$OUT_DIR" ]; then
    echo "Removing $OUT_DIR ..."
    rm -rf "$OUT_DIR"
fi

echo "Unzipping $ZIP_PATH ..."
unzip "$ZIP_PATH" -d "$OUT_DIR"

echo "Removing $ZIP_PATH ..."
rm -f "$ZIP_PATH"

echo "Deployment complete."

```

If you want to run this right after you upload or copy out.zip, you can simply run it once without the loop:

```bash
#!/bin/bash
ZIP_PATH="./out.zip"
OUT_DIR="./out"

if [ ! -f "$ZIP_PATH" ]; then
    echo "out.zip does not exist!"
    exit 1
fi

if [ -d "$OUT_DIR" ]; then
    rm -rf "$OUT_DIR"
fi

unzip "$ZIP_PATH" -d "$OUT_DIR"

rm -f "$ZIP_PATH"

```

## Prompt 4

Write a bash script that renames the extensions of all files in a directory to lower case and removes any planks in filenames.

OpenAI GPT-4.1:

Certainly! Here’s a bash script that:

Iterates over all files in the current directory (not including subdirectories).
Changes the file extension (if present) to lowercase.
Removes any spaces ("planks") from the filename.

```bash
#!/bin/bash

for file in *; do
  # Only process regular files, not directories or symlinks
  [ -f "$file" ] || continue

  # Remove spaces ("planks") from filename
  cleaned_name="${file// /}"

  # Extract base name and extension
  base="${cleaned_name%.*}"
  ext="${cleaned_name##*.}"

  # Only proceed if there is an extension
  if [[ "$base" != "$cleaned_name" ]]; then
    # Lowercase the extension
    new_ext=$(echo "$ext" | tr 'A-Z' 'a-z')
    new_name="${base}.${new_ext}"
  else
    # No extension, just cleaned name
    new_name="$cleaned_name"
  fi

  # If name has changed, rename
  if [[ "$file" != "$new_name" ]]; then
    # If destination exists, warn and skip
    if [[ -e "$new_name" ]]; then
      echo "Skipping '$file' -> '$new_name' (destination exists)"
    else
      mv -- "$file" "$new_name"
      echo "Renamed '$file' -> '$new_name'"
    fi
  fi
done

```