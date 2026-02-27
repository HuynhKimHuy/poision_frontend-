import { useAuthStore } from '@/stores/useAuthStore'

import { useNavigate } from 'react-router'

const Logout = () => {
    const { logOut } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async( )=>{
        try {
            await logOut()
            navigate('/signin')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
      <button type="button" className='' onClick={handleLogout}> logout</button>
    </div>
  )
}

export default Logout
