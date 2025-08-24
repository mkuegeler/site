import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import PrivacyLayout from '@/layouts/PrivacyLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Privacy Policy' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'privacy') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <PrivacyLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </PrivacyLayout>
    </>
  )
}
