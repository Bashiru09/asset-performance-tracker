import { signInWithGoogle } from '../services/authService'

function LoginButton() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google login failed:', error.message)
    }
  }

  return (
    <button onClick={handleLogin}>
      Continue with Google
    </button>
  )
}

export default LoginButton