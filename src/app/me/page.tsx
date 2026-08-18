import type { Metadata } from 'next'
import { ProfilePage } from '@/components/profile/profile-page'

export const metadata: Metadata = {
  title: 'MY PROFILE — BOOKLY',
}

export default function MePage() {
  return <ProfilePage />
}