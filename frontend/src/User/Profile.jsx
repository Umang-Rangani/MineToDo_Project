import React, { useState } from 'react'
import { User, Mail, ShieldCheck, LockKeyhole, CalendarDays, Save, ChevronRight, ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheckIcon, LoaderCircle, CheckCircle2 } from 'lucide-react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useUser } from '../context/UserContext'
import { axiosInstance } from '../axiosConfig/axiosInstance'
import Toast from '../components/Toast'

export default function Profile() {
  const { user, setUser } = useUser()

  const [toast, setToast] = useState(null)
  const [activePanel, setActivePanel] = useState('actions')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false)

  const [resetToken, setResetToken] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [otp, setOtp] = useState('')

  const [loadingAction, setLoadingAction] = useState('')

  const name = user?.name || 'MineSpace User'
  const email = user?.email || 'user@example.com'

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Not available'

  const isLoading = (action) => loadingAction === action

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
    })
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    if (loadingAction) return

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = formData.get('name')?.toString().trim()
    const email = formData.get('email')?.toString().trim()

    if (!name || !email) {
      showToast('Name and email are required.', 'error')
      return
    }

    setLoadingAction('profile-update')

    try {
      const response = await axiosInstance.put('/users/profile', {
        name,
        email,
      })

      setUser(response.data.user)

      setActivePanel('actions')

      showToast('Profile updated successfully.', 'success')
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to update profile. Please try again.', 'error')
    } finally {
      setLoadingAction('')
    }
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()

    showToast('Direct password change is not connected yet. Use Forgot Password to reset it.', 'error')
  }

  const handleSendOtp = async (event) => {
    event.preventDefault()

    if (loadingAction) return

    const form = event.currentTarget

    try {
      setLoadingAction('send-otp')

      const formData = new FormData(form)

      const emailInput = formData.get('resetEmail')?.toString().trim()

      if (!emailInput) {
        showToast('Please enter your registered email address.', 'error')
        return
      }

      const res = await axiosInstance.post('/users/forgot-password', {
        email: emailInput,
      })

      console.log('OTP API response:', res.data)

      setResetEmail(emailInput)
      setResetToken('')
      setOtp('')

      form.reset()

      showToast('A 6-digit OTP has been sent to your email. Please check your inbox.', 'success')

      setActivePanel('otp')
    } catch (error) {
      console.log('OTP error:', error)

      showToast(error.response?.data?.message || 'Unable to send OTP. Please try again.', 'error')
    } finally {
      setLoadingAction('')
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()

    if (loadingAction) return

    try {
      setLoadingAction('verify-otp')

      const emailValue = resetEmail?.trim()
      const otpValue = otp.trim()

      if (!emailValue) {
        showToast('Your reset email is missing. Please enter your email again.', 'error')

        setActivePanel('forgot-email')
        return
      }

      if (!otpValue) {
        showToast('Please enter the 6-digit OTP sent to your email.', 'error')
        return
      }

      if (!/^\d{6}$/.test(otpValue)) {
        showToast('Please enter all 6 digits of the OTP.', 'error')
        return
      }

      const res = await axiosInstance.post('/users/verify-otp', {
        email: emailValue,
        otp: otpValue,
      })

      if (!res.data?.resetToken) {
        showToast('OTP was verified but the reset token was not received. Please try again.', 'error')
        return
      }

      setResetEmail(emailValue)
      setResetToken(res.data.resetToken)
      setOtp('')

      showToast('OTP verified successfully. You can now create a new password.', 'success')

      setActivePanel('reset-password')
    } catch (error) {
      console.log('VERIFY OTP ERROR:', error)

      showToast(error.response?.data?.message || 'The OTP could not be verified. Please check the code and try again.', 'error')
    } finally {
      setLoadingAction('')
    }
  }

  const handleResendOtp = async () => {
    if (loadingAction) return

    try {
      setLoadingAction('resend-otp')

      const emailValue = resetEmail?.trim()

      if (!emailValue) {
        showToast('Your reset email is missing. Please start the reset process again.', 'error')

        setActivePanel('forgot-email')
        return
      }

      const res = await axiosInstance.post('/users/forgot-password', {
        email: emailValue,
      })

      console.log('RESEND OTP RESPONSE:', res.data)

      setResetToken('')
      setOtp('')

      showToast('A new OTP has been sent successfully. Please use the latest code.', 'success')
    } catch (error) {
      console.log('RESEND OTP ERROR:', error)

      showToast(error.response?.data?.message || 'Unable to resend OTP. Please try again.', 'error')
    } finally {
      setLoadingAction('')
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    if (loadingAction) return

    const form = event.currentTarget

    try {
      setLoadingAction('reset-password')

      const formData = new FormData(form)

      const password = formData.get('resetPassword')?.toString().trim()

      const confirmPassword = formData.get('resetConfirmPassword')?.toString().trim()

      const emailValue = resetEmail?.trim()
      const token = resetToken?.trim()

      if (!emailValue) {
        showToast('Your reset email is missing. Please start the reset process again.', 'error')

        setActivePanel('forgot-email')
        return
      }

      if (!token) {
        showToast('Your reset session has expired. Please verify the OTP again.', 'error')

        setActivePanel('otp')
        return
      }

      if (!password || !confirmPassword) {
        showToast('Please enter your new password in both fields.', 'error')
        return
      }

      if (password.length < 6) {
        showToast('Your new password must contain at least 6 characters.', 'error')
        return
      }

      if (password !== confirmPassword) {
        showToast('The new password and confirmation password do not match.', 'error')
        return
      }

      const res = await axiosInstance.post('/users/reset-password', {
        email: emailValue,
        resetToken: token,
        password,
        confirmPassword,
      })

      console.log('RESET PASSWORD RESPONSE:', res.data)

      form.reset()

      setResetToken('')
      setResetEmail('')
      setOtp('')

      setShowResetPassword(false)
      setShowResetConfirmPassword(false)

      setActivePanel('actions')

      showToast('Your password has been reset successfully. Your new password is now active.', 'success')
    } catch (error) {
      console.error('RESET PASSWORD ERROR:', error)

      showToast(error.response?.data?.message || 'We could not reset your password. Please try again.', 'error')
    } finally {
      setLoadingAction('')
    }
  }

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    if (!digit) return

    const nextOtp = otp.slice(0, index) + digit + otp.slice(index + 1)

    setOtp(nextOtp.slice(0, 6))

    if (index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      if (otp[index]) {
        const nextOtp = otp.slice(0, index) + otp.slice(index + 1)

        setOtp(nextOtp)
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus()
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }

    if (event.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()

    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (!pastedValue) return

    setOtp(pastedValue)

    const nextIndex = Math.min(pastedValue.length, 6) - 1

    if (nextIndex >= 0) {
      document.getElementById(`otp-${nextIndex}`)?.focus()
    }
  }

  const handleBackToActions = () => {
    if (loadingAction) return

    setActivePanel('actions')
  }

  return (
    <div className="mx-auto w-full space-y-4 sm:space-y-5">
      <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-soft) text-(--color-primaryDark) sm:h-13 sm:w-13">
              <FaRegUserCircle className="text-3xl sm:text-[34px]" />
            </div>

            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-(--color-surface) bg-(--color-primary)">
              <span className="h-1 w-1 rounded-full bg-white" />
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-(--color-text) sm:text-xl">{name}</h1>

            <p className="mt-0.5 truncate text-xs text-(--color-muted) sm:text-sm">Manage your MineSpace account</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-extrabold text-(--color-text)">Profile Details</h2>

            <p className="mt-1 text-xs text-(--color-muted)">Your account information</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                <User size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-(--color-muted)">Full Name</p>

                <p className="mt-0.5 truncate text-sm font-semibold text-(--color-text)">{name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                <Mail size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-(--color-muted)">Email Address</p>

                <p className="mt-0.5 truncate text-sm font-semibold text-(--color-text)">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                <CalendarDays size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-(--color-muted)">Member Since</p>

                <p className="mt-0.5 text-sm font-semibold text-(--color-text)">{createdAt}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                <ShieldCheck size={18} />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-bold text-(--color-text)">Account Security</p>

                <p className="mt-0.5 text-[11px] text-(--color-muted)">Your MineSpace account is protected.</p>
              </div>

              <span className="ml-auto shrink-0 rounded-full bg-(--color-soft) px-2 py-1 text-[10px] font-bold text-(--color-primaryDark)">Protected</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm sm:p-5">
          {activePanel === 'actions' && (
            <>
              <div className="mb-4">
                <h2 className="text-base font-extrabold text-(--color-text)">Profile Actions</h2>

                <p className="mt-1 text-xs text-(--color-muted)">Manage your account information and password</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setActivePanel('profile')}
                  disabled={Boolean(loadingAction)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3 text-left transition hover:border-(--color-primary)/30 hover:bg-(--color-soft) active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                    <User size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-(--color-text)">Edit Profile</span>

                    <span className="mt-0.5 block text-[11px] text-(--color-muted)">Update your name and email address</span>
                  </span>

                  <ChevronRight size={16} className="shrink-0 text-(--color-muted) transition group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePanel('password')}
                  disabled={Boolean(loadingAction)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3 text-left transition hover:border-(--color-primary)/30 hover:bg-(--color-soft) active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                    <LockKeyhole size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-(--color-text)">Change Password</span>

                    <span className="mt-0.5 block text-[11px] text-(--color-muted)">Update your account password</span>
                  </span>

                  <ChevronRight size={16} className="shrink-0 text-(--color-muted) transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </>
          )}

          {activePanel === 'profile' && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToActions}
                  disabled={Boolean(loadingAction)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                </button>

                <div>
                  <h2 className="text-base font-extrabold text-(--color-text)">Edit Profile</h2>

                  <p className="mt-0.5 text-xs text-(--color-muted)">Update your personal information</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} noValidate className="space-y-3">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    Full Name
                  </label>

                  <div className="relative">
                    <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={name}
                      placeholder="Enter your full name"
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-3 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={email}
                      placeholder="Enter your email"
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-3 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingAction}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-4 text-sm font-bold text-white shadow-sm shadow-black/5 transition duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                >
                  {isLoading('profile-update') ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {activePanel === 'password' && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToActions}
                  disabled={Boolean(loadingAction)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                </button>

                <div>
                  <h2 className="text-base font-extrabold text-(--color-text)">Change Password</h2>

                  <p className="mt-0.5 text-xs text-(--color-muted)">Keep your account secure</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} noValidate className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    Current Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-10 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10"
                    />

                    <button type="button" onClick={() => setShowCurrentPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) transition hover:text-(--color-text)">
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-10 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10"
                    />

                    <button type="button" onClick={() => setShowNewPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) transition hover:text-(--color-text)">
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-10 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10"
                    />

                    <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) transition hover:text-(--color-text)">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  Update Password
                </button>
              </form>

              <div className="mt-4 border-t border-(--color-border) pt-4">
                <button
                  type="button"
                  onClick={() => setActivePanel('forgot-email')}
                  disabled={Boolean(loadingAction)}
                  className="w-full text-center text-xs font-bold text-(--color-primaryDark) transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {activePanel === 'forgot-email' && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePanel('password')}
                  disabled={Boolean(loadingAction)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                </button>

                <div>
                  <h2 className="text-base font-extrabold text-(--color-text)">Reset Password</h2>

                  <p className="mt-0.5 text-xs text-(--color-muted)">Verify your account using email OTP</p>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                  <KeyRound size={18} />
                </span>

                <p className="text-[11px] leading-relaxed text-(--color-muted)">We will send a verification code to your registered email address.</p>
              </div>

              <form onSubmit={handleSendOtp} noValidate className="space-y-3">
                <div>
                  <label htmlFor="resetEmail" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      defaultValue={email}
                      placeholder="Enter your registered email"
                      disabled={Boolean(loadingAction)}
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-3 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading('send-otp') ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {activePanel === 'otp' && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (loadingAction) return

                    setOtp('')
                    setActivePanel('forgot-email')
                  }}
                  disabled={Boolean(loadingAction)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                </button>

                <div>
                  <h2 className="text-base font-extrabold text-(--color-text)">Verify OTP</h2>

                  <p className="mt-0.5 text-xs text-(--color-muted)">Enter the 6-digit code sent to your email</p>
                </div>
              </div>

              <div className="mb-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                    <Mail size={17} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[11px] text-(--color-muted)">OTP sent to</p>

                    <p className="mt-0.5 truncate text-xs font-bold text-(--color-text)">{resetEmail}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} noValidate>
                <div>
                  <label className="mb-2 block text-xs font-bold text-(--color-text)">Verification Code</label>

                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        value={otp[index] || ''}
                        disabled={Boolean(loadingAction)}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(event, index)}
                        onPaste={handleOtpPaste}
                        className="h-11 w-9 rounded-xl border border-(--color-border) bg-(--color-bg) text-center text-lg font-extrabold text-(--color-text) outline-none transition focus:border-(--color-primary) focus:bg-(--color-soft) focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-11"
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-center text-[10px] text-(--color-muted)">Enter the 6-digit verification code</p>
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingAction) || otp.length !== 6}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading('verify-otp') ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Verifying OTP...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Verify OTP
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 border-t border-(--color-border) pt-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={Boolean(loadingAction)}
                  className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-bold text-(--color-primaryDark) transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading('resend-otp') ? (
                    <>
                      <LoaderCircle size={13} className="animate-spin" />
                      Resending OTP...
                    </>
                  ) : (
                    'Didn’t receive the code? Resend OTP'
                  )}
                </button>
              </div>
            </>
          )}

          {activePanel === 'reset-password' && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePanel('otp')}
                  disabled={Boolean(loadingAction)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                </button>

                <div>
                  <h2 className="text-base font-extrabold text-(--color-text)">Create New Password</h2>

                  <p className="mt-0.5 text-xs text-(--color-muted)">Set a new password for your account</p>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                  <ShieldCheck size={18} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-(--color-text)">Secure password reset</p>

                  <p className="mt-0.5 text-[11px] leading-relaxed text-(--color-muted)">Use at least 6 characters and keep your password private.</p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} noValidate className="space-y-3">
                <div>
                  <label htmlFor="resetPassword" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="resetPassword"
                      name="resetPassword"
                      type={showResetPassword ? 'text' : 'password'}
                      minLength={6}
                      placeholder="Enter new password"
                      disabled={Boolean(loadingAction)}
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-10 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowResetPassword((prev) => !prev)}
                      disabled={Boolean(loadingAction)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) transition hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="resetConfirmPassword" className="mb-1.5 block text-xs font-bold text-(--color-text)">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-primaryDark)" />

                    <input
                      id="resetConfirmPassword"
                      name="resetConfirmPassword"
                      type={showResetConfirmPassword ? 'text' : 'password'}
                      minLength={6}
                      placeholder="Confirm new password"
                      disabled={Boolean(loadingAction)}
                      className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-10 text-sm font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword((prev) => !prev)}
                      disabled={Boolean(loadingAction)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) transition hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showResetConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-primaryDark) px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading('reset-password') ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
