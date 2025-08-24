import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import ContactLayout from '@/layouts/ContactLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Contact' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'gdprofficer') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <ContactLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </ContactLayout>
    </>
  )
}
