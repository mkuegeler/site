# kuegeler.com: web site
This is the source code for the website https://www.kuegeler.com

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
npm run build
npm run export
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