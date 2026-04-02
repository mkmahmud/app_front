'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50)
      .default('Test User'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/\d/),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to terms' }),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    const result = await registerUser(data)
    if (result.success) router.push(ROUTES.DASHBOARD)
    else setServerError(result.error ?? 'Registration failed.')
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

      <div className="container mx-auto md:px-4">
        <div className="flex-wrap items-center md:flex">
          {/* Illustration */}
          <div className="  pr-12 lg:block lg:w-2/3">
            <img
              src="/assets/images/registration.png"
              alt="Register"
              className="max-w-full dark:hidden"
            />
            <img
              src="/assets/images/registration1.png"
              alt="Register"
              className="hidden max-w-full dark:block"
            />
          </div>

          {/* Form */}
          <div className="w-full text-center md:px-4 lg:w-1/3 xl:w-1/3">
            <div className="rounded-[6px] bg-white p-8 shadow-sm md:p-10">
              {/* Logo Section */}
              <div className="mb-[28px]">
                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto" />
              </div>

              {/* Header Text */}
              <p className="_social_login_content_para mb-[8px] text-[var(--color)]">
                Get Started Now
              </p>
              <h4 className="_social_login_content_title mb-[50px] text-2xl font-bold text-[var(--color6)]">
                Registration
              </h4>

              {serverError && (
                <Alert variant="destructive" className="mb-4">
                  {serverError}
                </Alert>
              )}

              {/* Google Button - Using the Button component style from Login */}
              <Button type="button" variant={'secondary'} className="mb-10 w-full">
                <img src="/assets/images/google.svg" alt="Google" className="h-5 w-5" />
                <span className="text-sm font-medium">Register with google</span>
              </Button>

              {/* The Divider */}
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
                {/* Email Field */}
                <div className="_social_login_form_input mb-[14px]">
                  <Label className="mb-[8px] block text-left font-medium text-color-4">
                    Email
                  </Label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 w-full"
                  />
                  {errors.email && (
                    <p className="text-destructive mt-1 text-left text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="_social_login_form_input mb-[14px]">
                  <Label className="mb-[8px] block text-left font-medium text-color-4">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className="h-12 w-full pr-10"
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
                    <p className="text-destructive mt-1 text-left text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Repeat Password Field */}
                <div className="_social_login_form_input mb-[14px]">
                  <Label className="mb-[8px] block text-left font-medium text-color-4">
                    Repeat Password
                  </Label>
                  <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Repeat password"
                    className="h-12 w-full"
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive mt-1 text-left text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions - Using the rounded checkbox style from Login */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    {...register('agreeTerms')}
                    className="relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#E8E8E8] transition-all checked:border-transparent checked:bg-primary"
                  />
                  <Label
                    htmlFor="agreeTerms"
                    className="cursor-pointer text-sm font-normal text-[var(--color)]"
                  >
                    I agree to terms & conditions
                  </Label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-destructive text-left text-xs">
                    {errors.agreeTerms.message}
                  </p>
                )}

                {/* Submit Button */}
                <div className="!mt-10">
                  <Button
                    type="submit"
                    className="h-12 w-full text-lg font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 animate-spin" />
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-14 text-center">
                <p className="text-sm text-[var(--color)]">
                  Already have an account?{' '}
                  <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="font-semibold text-[var(--color5)] hover:underline"
                  >
                    Login Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
