'use client'

import { useEffect, type ReactNode } from 'react'
import { initialzeAnalytics, getApp } from '@/firebase'

interface IAnalyticsProps {
  children: ReactNode
}

export default function Analytics({ children }: IAnalyticsProps) {
  useEffect(() => {
    initialzeAnalytics(getApp())
  }, [])

  return <>{children}</>
}
