import React, { createContext, useContext, useEffect, useState } from 'react'

import { axiosInstance } from '../axiosConfig/axiosInstance'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get('/users/profile')

      setUser(res.data.user)

      return res.data.user
    } catch (error) {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const loginUser = (userData) => {
    setUser(userData)
    setShowLogin(false)
    setShowRegister(false)
    setShowForgotPassword(false)
  }

  const logoutUser = async () => {
    try {
      await axiosInstance.post('/users/logout')

      setUser(null)
      setShowLogin(true)
      setShowRegister(false)
      setShowForgotPassword(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,

        getProfile,

        loginUser,
        logoutUser,

        showLogin,
        setShowLogin,

        showRegister,
        setShowRegister,

        showForgotPassword,
        setShowForgotPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
