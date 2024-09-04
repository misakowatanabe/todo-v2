import { Sidemenu } from './sidemenu'
import { GlobalAlert } from './globalAlert'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidemenu />
      <div className="mx-8 grow">
        <GlobalAlert />
        {children}
      </div>
    </div>
  )
}
