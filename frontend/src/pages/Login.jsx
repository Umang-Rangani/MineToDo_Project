import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosConfig/axiosInstance'
import { useUser } from '../context/UserContext'

export default function Login() {
  const navigate = useNavigate()
  const { loginUser } = useUser()

  const [obj, setObj] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const changeHandle = (e) => {
    setObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.post('/users/login', obj)

      loginUser(res.data.user)

      navigate('/todo')
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h1>

          <p className="text-gray-500 mt-2">Login to manage your todos</p>
        </div>

        {error && <div className="mb-5 rounded-lg bg-red-100 border border-red-300 text-red-600 px-4 py-3 text-sm">{error}</div>}

        <form onSubmit={submitHandle} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>

            <input
              type="email"
              name="email"
              value={obj.email}
              onChange={changeHandle}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Password</label>

            <input
              type="password"
              name="password"
              value={obj.password}
              onChange={changeHandle}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition">
            {loading ? 'LOGIN...' : 'LOGIN'}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
