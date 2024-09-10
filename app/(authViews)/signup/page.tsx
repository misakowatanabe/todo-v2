import { Form } from './form'
import { AuthFormCard } from '../AuthFormCard'

export default function Page() {
  const switchLink = {
    helperText: 'Already have an account?',
    href: '/signin',
    name: 'Sign in',
  }

  return <AuthFormCard title="Sign up" form={<Form />} switchLink={switchLink} />
}
