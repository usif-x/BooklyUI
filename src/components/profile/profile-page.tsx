'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Heart,
  History,
  LogOut,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Pencil,
  Save,
  ShieldCheck,
  Truck,
  User as UserIcon,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '@/components/ui/timeline'
import { EmptyState, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle } from '@/components/ui/empty-state'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  createChartConfig,
  getChartColor,
} from '@/components/ui/chart'
import { DonutChart, DonutChartCenter } from '@/components/ui/donut-chart'
import { BookCover } from '@/components/book/book-cover'
import { BookGrid } from '@/components/book/book-grid'
import { UserAvatar } from '@/components/decor/user-avatar'
import { TypographyCanvas } from '@/components/decor/typography-canvas'
import { HaikeiBlob } from '@/components/decor/haikei-blob'
import { PersonWaving } from '@/components/decor/illustrations'
import { Star4Shape, Star5Shape } from '@/components/ui/shapes'
import { books, getBookById } from '@/data/books'
import { useAuth, useWishlist } from '@/providers/store-providers'
import type { Order, OrderStatus, User } from '@/lib/types'

const STATUS_STYLE: Record<OrderStatus, string> = {
  PROCESSING: 'bg-warning text-warning-foreground',
  SHIPPED: 'bg-info text-info-foreground',
  DELIVERED: 'bg-success text-success-foreground',
  CANCELLED: 'bg-destructive text-destructive-foreground',
}

function buildDemoOrders(userId: string): Order[] {
  const [a, b, c] = books
  return [
    {
      id: 'BLK-2026-8417',
      date: '2026-07-28',
      items: [
        { bookId: a.id, quantity: 1 },
        { bookId: b.id, quantity: 2 },
      ],
      total: a.price + b.price * 2,
      status: 'DELIVERED',
    },
    {
      id: 'BLK-2026-7731',
      date: '2026-08-05',
      items: [{ bookId: c.id, quantity: 1 }],
      total: c.price,
      status: 'SHIPPED',
    },
    {
      id: 'BLK-2026-9053',
      date: '2026-08-14',
      items: [
        { bookId: books[15].id, quantity: 1 },
        { bookId: books[20].id, quantity: 1 },
      ],
      total: books[15].price + books[20].price,
      status: 'PROCESSING',
    },
  ].map((o) => ({ ...o, id: `${o.id}-${userId.slice(-4)}` })) as unknown as Order[]
}

const MONTHLY_READS = [2, 1, 3, 2, 4, 3, 5, 4]

/* ── Order journey timeline ───────────────────────────────────────────── */

interface OrderStep {
  key: string
  title: string
  description: string
  time?: string
  status: 'completed' | 'current' | 'upcoming'
  icon: LucideIcon
  dotClass?: string
}

const STEP_PROGRESS: Record<OrderStatus, Record<string, 'completed' | 'current' | 'upcoming'>> = {
  PROCESSING: { processing: 'current', shipped: 'upcoming', delivered: 'upcoming' },
  SHIPPED: { processing: 'completed', shipped: 'current', delivered: 'upcoming' },
  DELIVERED: { processing: 'completed', shipped: 'completed', delivered: 'completed' },
  CANCELLED: { processing: 'completed', shipped: 'completed', delivered: 'completed' },
}

function buildOrderSteps(order: Order): OrderStep[] {
  const placed = new Date(order.date)
  const day = (n: number) =>
    new Date(placed.getTime() + n * 86400000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

  const base: OrderStep = {
    key: 'placed',
    title: 'ORDER PLACED',
    description: 'Bookly received your order and started packing.',
    time: day(0),
    status: 'completed',
    icon: Package,
  }

  if (order.status === 'CANCELLED') {
    return [
      base,
      {
        key: 'cancelled',
        title: 'CANCELLED',
        description: 'This order was cancelled — no charge was made.',
        time: day(1),
        status: 'current',
        icon: Zap,
        dotClass: 'bg-destructive',
      },
    ]
  }

  const st = STEP_PROGRESS[order.status]
  return [
    base,
    {
      key: 'processing',
      title: 'PROCESSING',
      description: 'Your books are being picked and wrapped.',
      time: day(1),
      status: st.processing,
      icon: Zap,
    },
    {
      key: 'shipped',
      title: 'SHIPPED',
      description: 'On the way from the Bookly warehouse.',
      time: st.shipped === 'upcoming' ? undefined : day(2),
      status: st.shipped,
      icon: Truck,
    },
    {
      key: 'delivered',
      title: 'DELIVERED',
      description: 'Enjoy the read — happy pages!',
      time: st.delivered === 'completed' ? day(4) : undefined,
      status: st.delivered,
      icon: PackageCheck,
    },
  ]
}

function useReadingStats(userId: string) {
  return React.useMemo(() => {
    const orders = buildDemoOrders(userId)
    const catCount = new Map<string, number>()
    let total = 0
    for (const order of orders) {
      for (const item of order.items) {
        const book = getBookById(item.bookId)
        if (!book) continue
        catCount.set(book.category, (catCount.get(book.category) ?? 0) + item.quantity)
        total += item.quantity
      }
    }
    const entries = [...catCount.entries()].map(([name, value], i) => ({
      name,
      value,
      fill: getChartColor('bold', i),
    }))
    const monthly = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'].map(
      (month, i) => ({ month, books: MONTHLY_READS[i] })
    )
    return { entries, monthly, total }
  }, [userId])
}

function ReadingStats({ userId }: { userId: string }) {
  const { entries, monthly, total } = useReadingStats(userId)
  const categoryNames = entries.map((e) => e.name)
  const donutConfig = createChartConfig(categoryNames, categoryNames, 'bold')
  const barConfig = createChartConfig(['books'], ['BOOKS'], 'bold')

  return (
    <section aria-label="Reading statistics" className="mt-10 grid gap-8 md:grid-cols-2">
      <div>
        <h2 className="mb-4 inline-block -rotate-1 border-3 border-foreground bg-secondary px-3 py-1.5 text-xs font-black uppercase tracking-widest text-secondary-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
          CATEGORY MIX
        </h2>
        <DonutChart
          data={entries}
          config={donutConfig}
          innerRadius="58%"
          outerRadius="80%"
          className="aspect-square max-h-[260px]"
          centerContent={<DonutChartCenter value={total} label="BOOKS BOUGHT" />}
        />
      </div>
      <div>
        <h2 className="mb-4 inline-block rotate-1 border-3 border-foreground bg-accent px-3 py-1.5 text-xs font-black uppercase tracking-widest text-accent-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
          MONTHLY READS
        </h2>
        <ChartContainer config={barConfig} variant="default" className="aspect-auto h-[260px]">
          <BarChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={28}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="books"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  )
}

function ProfileForm({ user, onCancel }: { user: User; onCancel: () => void }) {
  const { updateUser } = useAuth()
  const [form, setForm] = React.useState({
    name: user.name,
    email: user.email,
    password: user.password,
    address: user.address,
    phone: user.phone ?? '',
  })

  const fields = [
    { key: 'name' as const, label: 'NAME', icon: UserIcon, type: 'text', placeholder: 'YOUR NAME' },
    { key: 'email' as const, label: 'EMAIL', icon: Mail, type: 'email', placeholder: 'YOU@EXAMPLE.COM' },
    { key: 'password' as const, label: 'PASSWORD', icon: ShieldCheck, type: 'password', placeholder: '••••••••' },
    { key: 'address' as const, label: 'ADDRESS', icon: MapPin, type: 'text', placeholder: '1 BOOK STREET' },
    { key: 'phone' as const, label: 'PHONE', icon: Phone, type: 'tel', placeholder: '+20 100 000 0000' },
  ]

  return (
    <Card className="p-0">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">PROFILE INFORMATION</CardTitle>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <Pencil className="h-3.5 w-3.5" /> CANCEL
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`pf-${key}`} className="text-xs font-black uppercase tracking-wide">
                {label}
              </Label>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={`pf-${key}`}
                  type={type}
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))}
                  className="h-11 border-3 pl-10"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <Button
            onClick={() => {
              updateUser(form)
              onCancel()
              toast.success('CHANGES SAVED', { description: 'Your profile is up to date.' })
            }}
          >
            <Save className="h-4 w-4" /> SAVE CHANGES
          </Button>
          <Button variant="outline" onClick={onCancel}>
            CANCEL
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileInfo() {
  const { user } = useAuth()
  const [editing, setEditing] = React.useState(false)
  if (!user) return null

  return editing ? (
    <ProfileForm key={user.id} user={user} onCancel={() => setEditing(false)} />
  ) : (
    <Card className="p-0">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">PROFILE INFORMATION</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" /> EDIT
        </Button>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ['NAME', user.name, UserIcon],
              ['EMAIL', user.email, Mail],
              ['PASSWORD', '••••••••', ShieldCheck],
              ['ADDRESS', user.address, MapPin],
              ['PHONE', user.phone || '—', Phone],
            ] as const
          ).map(([label, value, Icon]) => (
            <div key={label} className="flex flex-col gap-1.5">
              <dt className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-muted-foreground">
                <Icon className="h-3.5 w-3.5" /> {label}
              </dt>
              <dd className="h-11 border-3 border-foreground bg-muted/50 px-3 py-2.5 text-sm font-bold uppercase">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function OrdersList() {
  const { user } = useAuth()
  const orders = user ? buildDemoOrders(user.id) : []
  const [openId, setOpenId] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-5">
      {orders.map((order) => {
        const open = openId === order.id
        const steps = buildOrderSteps(order)
        return (
          <Card key={order.id} className="p-0">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">ORDER {order.id}</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
                {new Date(order.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Badge className={STATUS_STYLE[order.status]}>{order.status}</Badge>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => {
                const book = getBookById(item.bookId)
                if (!book) return null
                return (
                  <li key={item.bookId} className="flex items-center gap-3">
                    <div className="w-12 shrink-0 border-2 border-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
                      <BookCover
                        id={book.id}
                        title={book.name}
                        author={book.author}
                        category={book.category}
                        className="w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${book.slug}`}
                        className="font-display text-sm uppercase leading-tight transition-colors hover:text-primary"
                      >
                        {book.name}
                      </Link>
                      <p className="text-xs font-bold text-muted-foreground">
                        {item.quantity} × ${book.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-black">${(book.price * item.quantity).toFixed(2)}</p>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t-3 border-dashed border-foreground pt-3">
              <span className="text-xs font-black uppercase tracking-wide text-muted-foreground">TOTAL</span>
              <span className="font-display text-xl">${order.total.toFixed(2)}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              aria-expanded={open}
              aria-controls={`journey-${order.id}`}
              className="mt-5 w-full"
              onClick={() => setOpenId(open ? null : order.id)}
            >
              <History className="h-4 w-4" />
              {open ? 'HIDE JOURNEY' : 'SHOW ORDER JOURNEY'}
            </Button>

            {open && (
              <div
                id={`journey-${order.id}`}
                className="mt-4 border-3 border-dashed border-foreground/40 bg-muted/20 p-5"
              >
                <Timeline>
                  {steps.map((step, i) => (
                    <TimelineItem key={step.key} status={step.status}>
                      <TimelineDot status={step.status} size="sm" className={step.dotClass}>
                        <step.icon className="h-3.5 w-3.5 text-foreground" />
                      </TimelineDot>
                      {i < steps.length - 1 && <TimelineConnector status={step.status} />}
                      <TimelineContent>
                        <TimelineHeader>
                          <TimelineTitle className="text-xs">{step.title}</TimelineTitle>
                          {step.time ? <TimelineTime>{step.time}</TimelineTime> : null}
                        </TimelineHeader>
                        <TimelineDescription className="text-xs">{step.description}</TimelineDescription>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            )}
          </CardContent>
        </Card>
      )})}
    </div>
  )
}

function WishlistSection() {
  const { ids, clear } = useWishlist()
  const wishlisted = books.filter((b) => ids.includes(b.id))

  if (wishlisted.length === 0) {
    return (
      <EmptyState variant="card" size="lg" className="py-14">
        <EmptyStateIcon iconColor="accent" size="lg">
          <Heart className="h-8 w-8" />
        </EmptyStateIcon>
        <EmptyStateTitle className="font-display text-xl">NO SAVED BOOKS YET</EmptyStateTitle>
        <EmptyStateDescription>
          Tap the heart on any book to keep it here for later.
        </EmptyStateDescription>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/products">FIND BOOKS</Link>
        </Button>
      </EmptyState>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-black uppercase">
          {wishlisted.length} BOOK{`${wishlisted.length === 1 ? '' : 'S'}`} SAVED
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clear()
            toast.info('WISHLIST CLEARED')
          }}
        >
          CLEAR ALL
        </Button>
      </div>
      <BookGrid books={wishlisted} />
    </div>
  )
}

function SignInGate({ loginWithGoogle }: { loginWithGoogle: () => void }) {
  return (
    <div className="relative mx-auto max-w-md px-4 py-20 text-center">
      <HaikeiBlob variant={2} size={220} className="absolute -top-8 right-0 text-accent/50" />
      <HaikeiBlob variant={0} size={180} className="absolute -left-16 bottom-0 text-secondary/40" />
      <div className="relative">
        <div className="mx-auto w-36 rotate-2">
          <PersonWaving className="w-full" />
        </div>
        <p className="mt-6 font-display text-3xl uppercase">SIGN IN REQUIRED</p>
        <p className="mt-2 text-sm font-bold uppercase text-muted-foreground">
          Log in to see your profile.
        </p>
        <Button className="mt-6 w-full" asChild>
          <Link href="/login">GO TO LOGIN</Link>
        </Button>
        <Button variant="outline" className="mt-3 w-full" onClick={loginWithGoogle}>
          TRY DEMO ACCOUNT
        </Button>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const router = useRouter()
  const { user, logout, loginWithGoogle } = useAuth()

  if (!user) {
    return <SignInGate loginWithGoogle={loginWithGoogle} />
  }

  const first = user.name.split(' ')[0].toUpperCase()

  return (
    <div className="relative overflow-hidden">
      <TypographyCanvas words={['BOOKS', 'READ', 'PROFILE', 'STACK']} paint="text-foreground/[0.04]" />
      <HaikeiBlob
        variant={3}
        size={240}
        animation="float"
        speed="slow"
        className="absolute -right-20 -top-16 text-accent/60"
      />
      <HaikeiBlob
        variant={1}
        size={210}
        className="absolute -bottom-24 -left-20 text-secondary/50"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="relative font-display uppercase leading-[0.9]">
            <span className="block text-5xl md:text-6xl">HEY,</span>
            <span className="mt-1 inline-block -rotate-1 bg-primary px-4 text-5xl text-primary-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] md:text-6xl">
              {first}.
            </span>
            <Star5Shape
              size={30}
              animation="float"
              speed="slow"
              className="absolute -top-6 right-0 text-accent"
            />
            <Star4Shape
              size={22}
              animation="float"
              speed="fast"
              className="absolute -bottom-5 left-[44%] text-info"
            />
          </h1>
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} size="lg" />
            <Button
              variant="destructive"
              size="lg"
              className="h-12"
              onClick={() => {
                logout()
                toast.info('LOGGED OUT', { description: 'See you soon, reader.' })
                router.push('/')
              }}
            >
              <LogOut className="h-4 w-4" /> LOGOUT
            </Button>
          </div>
        </div>

        <ReadingStats userId={user.id} />

        <Tabs defaultValue="orders" className="mt-10">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" /> ORDERS
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4" /> WISHLIST
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-4 w-4" /> PROFILE
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6">
            <OrdersList />
          </TabsContent>
          <TabsContent value="wishlist" className="mt-6">
            <WishlistSection />
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <ProfileInfo />
          </TabsContent>
        </Tabs>

        <div className="mt-10 flex flex-col gap-2 border-3 border-foreground bg-card p-5 shadow-[6px_6px_0px_hsl(var(--shadow-color))] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
            <CreditCard className="h-4 w-4" /> PAYMENT METHOD ON FILE: DEMO MODE
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">KEEP SHOPPING →</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}