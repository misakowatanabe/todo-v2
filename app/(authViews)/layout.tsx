import Image from 'next/image'
import signup from 'public/appLogo.svg'

export default function AuthViewLayout({ children }: { children: React.ReactNode }) {
  const appIcon = (
    <div className="flex justify-center items-center h-20 w-20 bg-black rounded-lg my-6">
      <Image src={signup} alt="Image of app logo" priority />
    </div>
  )

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <div className="overflow-hidden rounded bg-white shadow-md shadow-gray-200 w-2/5 p-6">
        <div className="flex justify-center">{appIcon}</div>
        {children}
      </div>
    </div>
  )
}
