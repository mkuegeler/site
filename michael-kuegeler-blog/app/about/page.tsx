import { genPageMetadata } from 'app/seo'
import AboutMain from './AboutMain'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  return <AboutMain />
}
