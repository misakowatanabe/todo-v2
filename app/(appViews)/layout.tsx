import Header from './header'
import Sidemenu from './sidemenu'

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Include shared UI here e.g. a header or sidebar */}
      <Header />
      <div className="flex">
        <Sidemenu />
        <div>{children}</div>
      </div>
    </div>
  )
}
