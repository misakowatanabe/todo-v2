import Image from 'next/image'
import Link from 'next/link'
import appLogo from 'public/appLogo.svg'

export default function AuthViewLayout({ children }: { children: React.ReactNode }) {
  const appIcon = (
    <div className="flex justify-center items-center h-20 w-20 bg-black rounded-lg my-6">
      <Image src={appLogo} alt="Image of app logo" priority />
    </div>
  )

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 h-screen relative mx-2 sm:mx-0">
      <div className="overflow-hidden rounded bg-white shadow-md shadow-gray-200 w-full sm:w-2/3 lg:w-2/5 p-2 sm:p-6">
        <div className="flex justify-center">{appIcon}</div>
        {children}
      </div>
      <Link
        href="https://github.com/misakowatanabe"
        className="absolute bottom-4 underline text-gray-400"
      >
        https://github.com/misakowatanabe
      </Link>
    </div>
  )
}
