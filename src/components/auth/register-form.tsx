'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Sticker } from '@/components/ui/sticker'
import { useAuth } from '@/providers/store-providers'
import { cn } from '@/lib/utils'

type Errors = Record<string, string | undefined>

function scorePassword(pw: string) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH_LABELS = ['TOO WEAK', 'WEAK', 'OKAY', 'STRONG', 'UNBREAKABLE']
const STRENGTH_COLORS = [
  '[&>div]:bg-destructive',
  '[&>div]:bg-destructive',
  '[&>div]:bg-warning',
  '[&>div]:bg-success',
  '[&>div]:bg-primary',
]

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    address: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [shake, setShake] = React.useState(false)

  const strength = scorePassword(values.password)

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const triggerShake = () => {
    setShake(true)
    window.setTimeout(() => setShake(false), 350)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (values.name.trim().length < 2) next.name = 'ENTER YOUR NAME'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'ENTER A VALID EMAIL'
    if (values.password.length < 8) next.password = 'USE AT LEAST 8 CHARACTERS'
    if (values.confirm !== values.password) next.confirm = 'PASSWORDS DO NOT MATCH'
    if (values.address.trim().length < 5) next.address = 'ENTER A DELIVERY ADDRESS'
    setErrors(next)
    if (Object.keys(next).length) {
      triggerShake()
      return
    }

    const result = register({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      address: values.address.trim(),
      phone: values.phone.trim() || undefined,
      avatar: '',
    })
    if (!result.ok) {
      setErrors({ email: result.error })
      triggerShake()
      toast.error('REGISTRATION FAILED', { description: result.error })
      return
    }
    toast.success('ACCOUNT CREATED!', {
      description: `Welcome to Bookly, ${values.name.split(' ')[0]}!`,
    })
    router.push('/')
  }

  return (
    <div
      className={cn(
        'border-3 border-foreground bg-card p-6 shadow-[8px_8px_0px_hsl(var(--shadow-color))] md:p-8',
        shake && 'animate-shake'
      )}
    >
      <Sticker variant="secondary" size="sm" rotation="slight-right" shadow="default" className="mb-6">
        FREE MEMBERSHIP
      </Sticker>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="reg-name" className="text-xs font-black uppercase tracking-wide">
            NAME
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="reg-name"
              placeholder="YOUSSEIF AHMED"
              value={values.name}
              onChange={set('name')}
              aria-invalid={!!errors.name}
              className={cn('h-12 border-3 pl-10', errors.name && 'border-destructive')}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-bold uppercase text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="reg-email" className="text-xs font-black uppercase tracking-wide">
            EMAIL
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="YOU@EXAMPLE.COM"
              value={values.email}
              onChange={set('email')}
              aria-invalid={!!errors.email}
              className={cn('h-12 border-3 pl-10', errors.email && 'border-destructive')}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-bold uppercase text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reg-password" className="text-xs font-black uppercase tracking-wide">
            PASSWORD
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="MIN. 8 CHARACTERS"
              value={values.password}
              onChange={set('password')}
              aria-invalid={!!errors.password}
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
          {values.password && (
            <div className="flex items-center gap-2">
              <Progress
                value={(strength / 4) * 100}
                variant="stepped"
                className={cn('h-3 flex-1', STRENGTH_COLORS[strength])}
              />
              <span className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}
          {errors.password && (
            <p className="text-xs font-bold uppercase text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reg-confirm" className="text-xs font-black uppercase tracking-wide">
            CONFIRM PASSWORD
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="REPEAT IT"
              value={values.confirm}
              onChange={set('confirm')}
              aria-invalid={!!errors.confirm}
              className={cn('h-12 border-3 pl-10', errors.confirm && 'border-destructive')}
            />
          </div>
          {errors.confirm && (
            <p className="text-xs font-bold uppercase text-destructive">{errors.confirm}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="reg-address" className="text-xs font-black uppercase tracking-wide">
            ADDRESS
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="reg-address"
              placeholder="1 BOOK STREET, CAIRO"
              value={values.address}
              onChange={set('address')}
              aria-invalid={!!errors.address}
              className={cn('h-12 border-3 pl-10', errors.address && 'border-destructive')}
            />
          </div>
          {errors.address && (
            <p className="text-xs font-bold uppercase text-destructive">{errors.address}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="reg-phone" className="text-xs font-black uppercase tracking-wide">
            PHONE <span className="text-muted-foreground">(OPTIONAL)</span>
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              id="reg-phone"
              type="tel"
              placeholder="+20 100 000 0000"
              value={values.phone}
              onChange={set('phone')}
              className="h-12 border-3 pl-10"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="h-13 w-full text-base sm:col-span-2">
          CREATE ACCOUNT <ArrowRight className="h-5 w-5" />
        </Button>
      </form>

      <p className="mt-5 text-center text-sm font-bold uppercase text-muted-foreground">
        ALREADY HAVE AN ACCOUNT?{' '}
        <Link href="/login" className="text-secondary underline-offset-4 hover:underline">
          LOG IN →
        </Link>
      </p>
    </div>
  )
}