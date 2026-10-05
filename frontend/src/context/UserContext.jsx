import React, { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../axiosConfig/axiosInstance'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get('/users/profile')
      setUser(res.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const loginUser = (userData) => {
    setUser(userData)
  }

  const logoutUser = async () => {
    try {
      await axiosInstance.post('/users/logout')
      setUser(null)
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
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
