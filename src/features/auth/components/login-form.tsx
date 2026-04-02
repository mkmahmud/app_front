'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/config/constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.DASHBOARD

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    const result = await login(data)
    if (result.success) {
      router.push(callbackUrl)
      router.refresh()
    } else {
      setServerError(result.error ?? 'Login failed. Please try again.')
    }
  }

  return (
    <section className="   ">
      {/* Decorative Background Shapes */}
      <div className=" absolute left-0 top-0 -z-10 hidden md:block ">
        <img src="/assets/images/shapef1.svg" alt="" className=" " />
        <img src="/assets/images/dark_shape.svg" alt="" className="hidden dark:block" />
      </div>
      <div className="  absolute right-0 top-0 -z-10 hidden md:block ">
        <img src="/assets/images/shape2.svg" alt="" className="dark:hidden " />
        <img
          src="/assets/images/dark_shape1.svg"
          alt=""
          className="hidden opacity-50 dark:block"
        />
      </div>
      <div className="  absolute bottom-0 right-[20%] -z-10 hidden md:block">
        <img src="/assets/images/shape3.svg" alt="" className="dark:hidden" />
        <img
          src="/assets/images/dark_shape2.svg"
          alt=""
          className="hidden opacity-50 dark:block"
        />
      </div>

      <div className="  bg  w-full  ">
        <div className="container mx-auto md:px-4">
          <div className="flex flex-wrap items-center">
            {/* Left Side: Illustration (col-xl-8 col-lg-8) */}
            <div className=" px-4 lg:w-2/3 xl:w-2/3">
              <div className=" ">
                <div className=" ">
                  <img
                    src="/assets/images/login.png"
                    alt="Login Illustration"
                    className="mx-auto h-auto object-contain md:max-w-[60%]"
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Form Content (col-xl-4 col-lg-4) */}
            <div className="w-full text-center md:px-4 lg:w-1/3 xl:w-1/3">
              <div className=" rounded-[6px] bg-white p-8 shadow-sm md:p-10  ">
                <div className=" mb-[28px] ">
                  <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto " />
                </div>

                <p className="_social_login_content_para mb-[8px] text-[var(--color)]">
                  Welcome back
                </p>
                <h4 className="_social_login_content_title mb-[50px] text-2xl font-bold text-[var(--color6)]">
                  Login to your account
                </h4>

                {serverError && (
                  <Alert variant="destructive" className="mb-4">
                    {serverError}
                  </Alert>
                )}

                <Button type="button" variant={'secondary'} className="mb-10 w-full">
                  <img
                    src="/assets/images/google.svg"
                    alt="Google"
                    className="  h-5 w-5"
                  />
                  <span className="text-sm font-medium  ">Or sign-in with google</span>
                </Button>

                <div className={cn('relative flex items-center py-5')}>
                  <div className="flex-grow border-t border-app-3"></div>

                  <span className="mx-4 flex-shrink text-sm font-medium uppercase text-brand-gray">
                    Or
                  </span>

                  <div className="flex-grow border-t border-app-3"></div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="_social_login_form space-y-4"
                >
                  <div className="_social_login_form_input mb-[14px]">
                    <Label className=" mb-[8px] block text-left font-medium text-color-4 ">
                      Email
                    </Label>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className="  h-12 w-full  "
                    />
                    {errors.email && (
                      <p className="text-destructive mt-1 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="_social_login_form_input mb-[14px]">
                    <Label className="mb-[8px] block text-left font-medium text-color-4 ">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        className="  h-12 w-full  "
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color)]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive mt-1 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="form-check _social_login_form_check flex items-center gap-2">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        {...register('rememberMe')}
                        className="relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#E8E8E8] transition-all checked:border-transparent checked:bg-primary"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="  cursor-pointer text-sm  font-normal"
                      >
                        Remember me
                      </Label>
                    </div>
                    <div className="_social_login_form_left">
                      <Link
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className="  text-sm text-[var(--color5)] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div className="  !mt-10  ">
                    <Button
                      type="submit"
                      className=" h-12 w-full text-lg font-medium  "
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 animate-spin" />
                      ) : (
                        'Login now'
                      )}
                    </Button>
                  </div>
                </form>

                <div className=" mt-14 text-center">
                  <p className="   text-sm text-[var(--color)]">
                    Dont have an account?{' '}
                    <Link
                      href={ROUTES.AUTH.REGISTER}
                      className="font-semibold text-[var(--color5)] hover:underline"
                    >
                      Create New Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
