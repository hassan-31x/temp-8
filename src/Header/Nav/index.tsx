'use client'

import React from 'react'

import { CMSLink } from '@/components/payload/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: any }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }: any, i: number) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/listings" className="text-primary hover:text-primary/80 font-medium">
        Listings
      </Link>
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
