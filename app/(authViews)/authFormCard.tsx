import Link from 'next/link'

type AuthFormCardProps = {
  title: string
  form: React.ReactNode
  switchLink: { helperText: string; href: string; name: string }
}

export function AuthFormCard({ title, form, switchLink }: AuthFormCardProps) {
  return (
    <>
      <h3 className="text-xl font-medium text-gray-700 mb-4 flex justify-center">{title}</h3>
      {form}
      <div className="flex justify-center mt-8 text-gray-500">
        {switchLink.helperText}&nbsp;&nbsp;
        <Link href={switchLink.href} className="underline">
          {switchLink.name}
        </Link>
      </div>
    </>
  )
}
