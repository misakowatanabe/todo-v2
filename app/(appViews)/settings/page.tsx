import { Heading } from 'components/Heading'
import { DeleteAccount } from './deleteAccount'
import { Profile } from './profile'

export default function Page() {
  return (
    <>
      <Heading title="Settings" />
      <Profile />
      <DeleteAccount />
    </>
  )
}
