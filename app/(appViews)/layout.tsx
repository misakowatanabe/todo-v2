import { Nav } from './nav'
import { GlobalAlert } from './globalAlert'

export default function AppViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Nav />
      <div className="fixed lg:static top-16 lg:top-0 bottom-0 w-full overflow-y-auto">
        <div className="mx-2 lg:mx-8">
          <GlobalAlert />
          {children}
        </div>
      </div>
    </div>
  )
}
