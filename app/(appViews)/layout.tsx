import Header from './header'
import Sidemenu from './sidemenu'
import GlobalAlert from './globalAlert'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidemenu />
        <div>
          <GlobalAlert />
          {children}
        </div>
      </div>
    </div>
  )
}
