/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Analog / Digital',
  author: 'Michael Kügeler',
  headerTitle: 'Analog / Digital',
  description: 'Michael Kügeler',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://kuegeler.com',
  siteRepo: 'https://github.com/mkuegeler/site',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/cdv_photo_001.svg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/cdv_photo_001.svg`,
  //mastodon: 'https://mastodon.social/@mastodonuser',
  email: 'mkuegeler@gmail.com',
  github: 'https://github.com/mkuegeler',
  x: 'https://twitter.com/mkuegeler',
  // twitter: 'https://twitter.com/Twitter',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com/in/michael-k%C3%BCgeler-57bb2112',
  // threads: 'https://www.threads.net',
  instagram: 'https://www.instagram.com/mkuegeler',
  // medium: 'https://medium.com',
  // bluesky: 'https://bsky.app/',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  // No analytics provider is enabled, and the privacy policy in
  // data/authors/privacy.mdx states that no analytics or tracking is used.
  //
  // umamiAnalytics used to be configured here. Because umamiWebsiteId came from
  // NEXT_UMAMI_ID, which was never set, every page still loaded
  // https://analytics.umami.is/script.js — sending each visitor's IP address to
  // a US provider while collecting nothing usable, with no consent mechanism in
  // place. Re-enabling any provider means updating the privacy policy, adding a
  // consent banner, and re-adding the host to the CSP in next.config.js.
  analytics: {
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  // Comments are disabled. giscus was configured here, but its repo settings
  // came from NEXT_PUBLIC_GISCUS_* environment variables that were never set,
  // so every blog post rendered a "Load Comments" button that could not work.
  // The privacy policy in data/authors/privacy.mdx states that no comment
  // function is active.
  //
  // The whole key is left out rather than emptied: the post layouts render the
  // comment container with `siteMetadata.comments && ...`, so any object here —
  // even one without a provider — leaves an empty padded div on every post.
  //
  // Re-enabling means: set the NEXT_PUBLIC_GISCUS_* variables, restore the
  // block below, re-add giscus.app to script-src and frame-src in
  // next.config.js, and update the privacy policy — giscus loads a
  // third-party iframe from giscus.app and sets cookies, so it needs a
  // consent step and its own section in the policy.
  //
  // comments: {
  //   provider: 'giscus', // supported providers: giscus, utterances, disqus
  //   giscusConfig: {
  //     // https://giscus.app/
  //     repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  //     repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
  //     category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  //     categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  //     mapping: 'pathname', // supported options: pathname, url, title
  //     reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
  //     metadata: '0',
  //     theme: 'light',
  //     darkTheme: 'transparent_dark',
  //     themeURL: '',
  //     lang: 'en',
  //   },
  // },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
