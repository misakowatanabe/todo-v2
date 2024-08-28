import Sidemenu from './sidemenu'
import GlobalAlert from './globalAlert'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidemenu />
      <div className="mx-8">
        <GlobalAlert />
        {children}
      </div>
    </div>
  )
}
