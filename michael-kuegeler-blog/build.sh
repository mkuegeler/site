# Build static site
# Clean up previous builds
rm -rf out
# Build the site
rm -rf .next
npx contentlayer2 build
npm run build