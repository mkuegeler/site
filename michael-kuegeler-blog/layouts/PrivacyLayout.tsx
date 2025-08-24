import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function PrivacyLayout({ children, content }: Props) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Privacy Policy
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            See how we handle your data and protect your privacy
          </p>
        </div>
        <div className="prose dark:prose-invert container max-w-none py-12 pt-8 pb-8 xl:col-span-2">
          {children}
        </div>
      </div>
    </>
  )
}
