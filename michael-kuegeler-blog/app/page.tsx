import { genPageMetadata } from 'app/seo'
import AboutMain from './about/AboutMain'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  return <AboutMain />
}
