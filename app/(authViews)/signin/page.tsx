import { Form } from './form'
import { AuthFormCard } from 'app/(authViews)/authFormCard'

export default function Page() {
  const switchLink = {
    helperText: "Don't have an account?",
    href: '/signup',
    name: 'Sign up',
  }

  return <AuthFormCard title="Sign in" form={<Form />} switchLink={switchLink} />
}
