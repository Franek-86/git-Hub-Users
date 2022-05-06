import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import loadingGif from '../images/preloader.gif'
import styled from 'styled-components'
function AuthWrapper({ children }) {
  const { isLoading, error } = useAuth0()
  if (isLoading) {
    return <img className='loading-img' src={loadingGif} alt='spinner' />
  }

  if (error) {
    return <div>Oops... {error.message}</div>
  }
  return <>{children}</>
}
export default AuthWrapper
