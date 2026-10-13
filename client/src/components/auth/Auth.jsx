import LoginButton from '../LoginButton'
import UserMenu from '../UserMenu'

function Auth({ user }) {
  if (!user) {
    return <LoginButton />
  }

  return <UserMenu user={user} />
}

export default Auth