import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

import { axiosInstance } from '../axiosConfig/axiosInstance'
import { useUser } from '../context/UserContext'
import Toast from '../components/Toast'

export default function ForgotPassword() {
  const {
    showForgotPassword,
    setShowForgotPassword,
    setShowLogin,
  } = useUser()

  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resetToken, setResetToken] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const [toast, setToast] = useState(null)

  const otpRefs = useRef([])

  useEffect(() => {
    if (!showForgotPassword) return

    setStep('email')
    setEmail('')
    setOtp(['', '', '', '', '', ''])
    setResetToken('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setLoading(false)
    setResendLoading(false)
    setResendTimer(0)
    setToast(null)
  }, [showForgotPassword])

  useEffect(() => {
    if (!showForgotPassword) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showForgotPassword])

  useEffect(() => {
    if (resendTimer <= 0) return

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendTimer])

  if (!showForgotPassword) {
    return null
  }

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
    })
  }

  const closeModal = () => {
    if (loading || resendLoading) return

    setShowForgotPassword(false)
  }

  const backToLogin = () => {
    if (loading || resendLoading) return

    setShowForgotPassword(false)
    setShowLogin(true)
  }

  const handleBack = () => {
    if (loading || resendLoading) return

    if (step === 'otp') {
      setStep('email')
      return
    }

    if (step === 'password') {
      setStep('otp')
    }
  }

  const handleSendOtp = async (event) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      showToast('Please enter your email address', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await axiosInstance.post(
        '/users/forgot-password',
        {
          email: normalizedEmail,
        },
      )

      setEmail(normalizedEmail)
      setStep('otp')
      setOtp(['', '', '', '', '', ''])
      setResendTimer(60)

      showToast(
        res.data.message ||
          'OTP sent to your email successfully',
      )

      setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 100)
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'Unable to send OTP. Please try again.',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const numericValue = value
      .replace(/\D/g, '')
      .slice(-1)

    setOtp((prev) => {
      const updated = [...prev]
      updated[index] = numericValue
      return updated
    })

    if (numericValue && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()

    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (!pastedValue) return

    const updated = ['', '', '', '', '', '']

    pastedValue.split('').forEach((value, index) => {
      updated[index] = value
    })

    setOtp(updated)

    const nextIndex = Math.min(pastedValue.length, 5)

    setTimeout(() => {
      otpRefs.current[nextIndex]?.focus()
    }, 0)
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()

    const otpValue = otp.join('')

    if (otpValue.length !== 6) {
      showToast(
        'Please enter the complete 6-digit OTP',
        'error',
      )
      return
    }

    setLoading(true)

    try {
      const res = await axiosInstance.post(
        '/users/verify-otp',
        {
          email,
          otp: otpValue,
        },
      )

      setResetToken(res.data.resetToken)
      setStep('password')

      showToast('OTP verified successfully')
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'Invalid or expired OTP',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resendLoading) return

    setResendLoading(true)

    try {
      const res = await axiosInstance.post(
        '/users/forgot-password',
        {
          email,
        },
      )

      setOtp(['', '', '', '', '', ''])
      setResendTimer(60)

      showToast(
        res.data.message || 'New OTP sent successfully',
      )

      setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 100)
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'Unable to resend OTP',
        'error',
      )
    } finally {
      setResendLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    if (!password || !confirmPassword) {
      showToast(
        'Please enter both password fields',
        'error',
      )
      return
    }

    if (password.length < 6) {
      showToast(
        'Password must be at least 6 characters',
        'error',
      )
      return
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await axiosInstance.post(
        '/users/reset-password',
        {
          email,
          resetToken,
          password,
          confirmPassword,
        },
      )

      showToast(
        res.data.message ||
          'Password reset successfully',
      )

      setStep('success')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'Unable to reset password',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  const getStepData = () => {
    switch (step) {
      case 'otp':
        return {
          icon: ShieldCheck,
          title: 'Verify OTP',
          subtitle:
            'Enter the 6-digit code sent to your email.',
        }

      case 'password':
        return {
          icon: LockKeyhole,
          title: 'Create New Password',
          subtitle:
            'Choose a strong password for your account.',
        }

      case 'success':
        return {
          icon: CheckCircle2,
          title: 'Password Reset Successful',
          subtitle:
            'Your password has been updated successfully.',
        }

      default:
        return {
          icon: Mail,
          title: 'Forgot Password?',
          subtitle:
            'Enter your email to receive a verification code.',
        }
    }
  }

  const stepData = getStepData()
  const StepIcon = stepData.icon

  const renderProgress = () => {
    if (step === 'success') {
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-(--color-primary)" />
          <div className="h-1.5 flex-1 rounded-full bg-(--color-primary)" />
          <div className="h-1.5 flex-1 rounded-full bg-(--color-primary)" />
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 flex-1 rounded-full ${
            step === 'email'
              ? 'bg-(--color-primary)'
              : 'bg-(--color-primary)'
          }`}
        />

        <div
          className={`h-1.5 flex-1 rounded-full ${
            step === 'otp' || step === 'password'
              ? 'bg-(--color-primary)'
              : 'bg-(--color-border)'
          }`}
        />

        <div
          className={`h-1.5 flex-1 rounded-full ${
            step === 'password'
              ? 'bg-(--color-primary)'
              : 'bg-(--color-border)'
          }`}
        />
      </div>
    )
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm" />

      <div className="fixed inset-0 z-9999 flex h-dvh w-full items-center justify-center overflow-hidden p-2 sm:p-4">
        <div className="relative flex h-auto max-h-[calc(100dvh-1rem)] w-full max-w-4xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl">
          <button
            type="button"
            onClick={closeModal}
            disabled={loading || resendLoading}
            aria-label="Close"
            className="absolute right-2.5 top-2.5 z-30 flex h-8 w-8 items-center justify-center rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-muted) transition hover:bg-(--color-soft) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50 sm:right-4 sm:top-4 sm:h-9 sm:w-9"
          >
            <X size={17} />
          </button>

          <div className="hidden w-[40%] shrink-0 bg-linear-to-br from-(--color-primaryDark) via-(--color-primary) to-(--color-secondary) p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-base font-extrabold">
                    MineSpace
                  </p>

                  <p className="text-[10px] font-medium text-white/60">
                    Productivity workspace
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                  Account Recovery
                </p>

                <h2 className="mt-3 text-4xl font-extrabold leading-[1.05]">
                  Get back to
                  <span className="block text-white/65">
                    your workspace.
                  </span>
                </h2>

                <p className="mt-5 max-w-xs text-xs leading-5 text-white/65">
                  Recover your MineSpace account securely
                  using email verification.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
              <div className="flex items-center gap-3">
                <KeyRound size={18} />

                <div>
                  <p className="text-xs font-bold">
                    Secure recovery
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/60">
                    Your OTP is temporary and expires after
                    a limited time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 px-4 py-4 sm:px-7 sm:py-7 lg:px-10 lg:py-8">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-5 pr-9 sm:mb-7">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-soft) text-(--color-primaryDark)">
                        <Sparkles size={16} />
                      </div>

                      <span className="text-sm font-extrabold text-(--color-text)">
                        MineSpace
                      </span>
                    </div>

                    {step !== 'email' &&
                      step !== 'success' && (
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={
                            loading || resendLoading
                          }
                          className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-(--color-muted) transition hover:text-(--color-primaryDark) disabled:opacity-50"
                        >
                          <ArrowLeft size={13} />
                          Back
                        </button>
                      )}
                  </div>

                  {renderProgress()}

                  <div className="mt-5 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-soft) text-(--color-primaryDark)">
                      <StepIcon size={20} />
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-xl font-extrabold tracking-tight text-(--color-text) sm:text-2xl">
                        {stepData.title}
                      </h1>

                      <p className="mt-1 text-[11px] leading-4.5 text-(--color-muted) sm:text-xs">
                        {stepData.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {step === 'email' && (
                  <form
                    onSubmit={handleSendOtp}
                    className="space-y-3"
                  >
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(event) =>
                            setEmail(event.target.value)
                          }
                          placeholder="Enter your email"
                          autoFocus
                          disabled={loading}
                          className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-3 text-xs font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primaryDark) to-(--color-primary) text-xs font-bold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={backToLogin}
                      disabled={loading}
                      className="flex h-8 w-full items-center justify-center gap-1 text-[11px] font-bold text-(--color-muted) transition hover:text-(--color-primaryDark)"
                    >
                      <ArrowLeft size={13} />
                      Back to Login
                    </button>
                  </form>
                )}

                {step === 'otp' && (
                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-3"
                  >
                    <div>
                      <label className="mb-2 block text-[11px] font-bold text-(--color-text)">
                        Verification Code
                      </label>

                      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                        {otp.map((value, index) => (
                          <input
                            key={index}
                            ref={(element) => {
                              otpRefs.current[index] =
                                element
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={value}
                            onChange={(event) =>
                              handleOtpChange(
                                index,
                                event.target.value,
                              )
                            }
                            onKeyDown={(event) =>
                              handleOtpKeyDown(
                                index,
                                event,
                              )
                            }
                            onPaste={
                              index === 0
                                ? handleOtpPaste
                                : undefined
                            }
                            disabled={loading}
                            className="h-11 w-full rounded-lg border border-(--color-border) bg-(--color-bg) text-center text-base font-extrabold text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:opacity-60 sm:h-12"
                          />
                        ))}
                      </div>

                      <p className="mt-2 text-[10px] text-(--color-muted)">
                        Code sent to{' '}
                        <span className="font-bold text-(--color-text)">
                          {email}
                        </span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primaryDark) to-(--color-primary) text-xs font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify OTP
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1 text-[10px]">
                      <span className="text-(--color-muted)">
                        Didn't receive the code?
                      </span>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={
                          resendTimer > 0 ||
                          resendLoading ||
                          loading
                        }
                        className="font-bold text-(--color-secondary) hover:text-(--color-primaryDark) disabled:opacity-50"
                      >
                        {resendLoading
                          ? 'Sending...'
                          : resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : 'Resend OTP'}
                      </button>
                    </div>
                  </form>
                )}

                {step === 'password' && (
                  <form
                    onSubmit={handleResetPassword}
                    className="space-y-3"
                  >
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                        New Password
                      </label>

                      <div className="relative">
                        <LockKeyhole
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
                        />

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          placeholder="Enter new password"
                          autoFocus
                          disabled={loading}
                          className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-10 text-xs font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:opacity-60"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (prev) => !prev,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-text)"
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-(--color-text)">
                        Confirm Password
                      </label>

                      <div className="relative">
                        <LockKeyhole
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value,
                            )
                          }
                          placeholder="Confirm new password"
                          disabled={loading}
                          className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-9 pr-10 text-xs font-medium text-(--color-text) outline-none transition placeholder:text-(--color-muted)/70 focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:opacity-60"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (prev) => !prev,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-text)"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-(--color-border) bg-(--color-soft)/50 px-3 py-2">
                      <p className="text-[10px] leading-4 text-(--color-muted)">
                        Password must contain at least 6
                        characters.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primaryDark) to-(--color-primary) text-xs font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === 'success' && (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-soft) text-(--color-primaryDark)">
                      <CheckCircle2 size={28} />
                    </div>

                    <h2 className="text-lg font-extrabold text-(--color-text)">
                      You're all set!
                    </h2>

                    <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-4.5 text-(--color-muted)">
                      Your password has been changed
                      successfully. You can now login with
                      your new password.
                    </p>

                    <button
                      type="button"
                      onClick={backToLogin}
                      className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--color-primaryDark) to-(--color-primary) text-xs font-bold text-white shadow-md transition hover:brightness-105"
                    >
                      Continue to Login
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-(--color-border) px-4 py-2.5 sm:px-7 lg:px-10">
              <div className="mx-auto flex max-w-md items-center justify-center gap-1.5 text-[9px] text-(--color-muted)">
                <ShieldCheck size={12} />
                <span>Secure account recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>,
    document.body,
  )
}