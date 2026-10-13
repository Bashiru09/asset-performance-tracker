import { signOut } from '../services/authService'

function UserMenu({ user }) {
  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error.message)
    }
  }

  return (
    <div>
      <span>{user.email}</span>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default UserMenu