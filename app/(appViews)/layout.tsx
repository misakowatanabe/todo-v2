import { Nav } from './nav'
import { GlobalAlert } from './globalAlert'

export default function AppViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Nav />
      <div className="fixed top-16 lg:top-24 left-0 lg:left-72 right-0 bottom-0 overflow-y-auto">
        <div className="mx-2 lg:mx-8">
          <GlobalAlert />
          {children}
        </div>
      </div>
    </div>
  )
}
