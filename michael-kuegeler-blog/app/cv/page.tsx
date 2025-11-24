import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import CVLayout from '@/layouts/CVLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'CV' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'michael') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <CVLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </CVLayout>
    </>
  )
}
