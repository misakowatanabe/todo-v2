import { Form } from './form'
import { AuthFormCard } from '../AuthFormCard'

export default function Page() {
  const switchLink = {
    helperText: "Don't have an account?",
    href: '/signup',
    name: 'Sign up',
  }

  return <AuthFormCard title="Sign in" form={<Form />} switchLink={switchLink} />
}
