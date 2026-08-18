'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Globe, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sticker } from '@/components/ui/sticker'
import { useAuth } from '@/providers/store-providers'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [shake, setShake] = React.useState(false)

  const triggerShake = () => {
    setShake(true)
    window.setTimeout(() => setShake(false), 350)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'EMAIL IS REQUIRED'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'ENTER A VALID EMAIL'
    if (!password) next.password = 'PASSWORD IS REQUIRED'
    setErrors(next)
    if (Object.keys(next).length) {
      triggerShake()
      return
    }

    const result = login(email, password)
    if (!result.ok) {
      setErrors({ password: result.error ?? 'INVALID CREDENTIALS' })
      triggerShake()
      toast.error('LOGIN FAILED', { description: result.error })
      return
    }
    toast.success('WELCOME BACK!', { description: 'You are logged in.' })
    router.push('/')
  }

  const handleGoogle = () => {
    loginWithGoogle()
    toast.success('SIGNED IN WITH GOOGLE', { description: 'Demo login — welcome back, Yousseif!' })
    router.push('/me')
  }

  return (
    <div
      className={cn(
        'border-3 border-foreground bg-card p-6 shadow-[8px_8px_0px_hsl(var(--shadow-color))] md:p-8',
        shake && 'animate-shake'
      )}
    >
      <Sticker variant="primary" size="sm" rotation="slight" shadow="default" className="mb-6">
        READERS ONLY
      </Sticker>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email" className="text-xs font-black uppercase tracking-wide">
            EMAIL
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="YOU@EXAMPLE.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className={cn('h-12 border-3 pl-10', errors.email && 'border-destructive')}
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="text-xs font-bold uppercase text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-xs font-black uppercase tracking-wide">
              PASSWORD
            </Label>
            <button
              type="button"
              className="text-xs font-bold uppercase text-secondary underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className={cn('h-12 border-3 pl-10 pr-10', errors.password && 'border-destructive')}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="text-xs font-bold uppercase text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="h-13 w-full text-base">
          LOGIN <ArrowRight className="h-5 w-5" />
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-1 flex-1 border-t-3 border-dashed border-foreground" />
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">OR</span>
        <span className="h-1 flex-1 border-t-3 border-dashed border-foreground" />
      </div>

      <Button variant="outline" size="lg" className="w-full" onClick={handleGoogle}>
        <Globe className="h-5 w-5" /> CONTINUE WITH GOOGLE
      </Button>

      <p className="mt-5 text-center text-sm font-bold uppercase text-muted-foreground">
        NEW HERE?{' '}
        <Link href="/register" className="text-secondary underline-offset-4 hover:underline">
          CREATE AN ACCOUNT →
        </Link>
      </p>
    </div>
  )
}