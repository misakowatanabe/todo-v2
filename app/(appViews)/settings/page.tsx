import { Heading } from 'components/Heading'
import { AccountDeletion } from './accountDeletion'
import { Profile } from './profile'

export default function Page() {
  return (
    <>
      <Heading title="Settings" />
      <Profile />
      <AccountDeletion />
    </>
  )
}
