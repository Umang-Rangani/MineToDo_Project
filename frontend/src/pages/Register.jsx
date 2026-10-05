import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosConfig/axiosInstance'

export default function Register() {
  const navigate = useNavigate()

  const [obj, setObj] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const changeHandle = (e) => {
    setObj((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (obj.password !== obj.confirmPassword) {
      setError('Password and Confirm Password do not match')
      return
    }

    if (obj.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      await axiosInstance.post('/users/register', obj)

      setSuccess('Registration successful! Redirecting to login...')

      setObj({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-800">Create Account 🚀</h1>

          <p className="text-gray-500 mt-2">Register to start managing your todos</p>
        </div>

        {error && <div className="mb-5 rounded-lg bg-red-100 border border-red-300 text-red-600 px-4 py-3 text-sm">{error}</div>}

        {success && <div className="mb-5 rounded-lg bg-green-100 border border-green-300 text-green-600 px-4 py-3 text-sm">{success}</div>}

        <form onSubmit={submitHandle} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>

            <input
              type="text"
              name="name"
              value={obj.name}
              onChange={changeHandle}
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

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
              placeholder="Enter password"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={obj.confirmPassword}
              onChange={changeHandle}
              placeholder="Confirm password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition">
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
