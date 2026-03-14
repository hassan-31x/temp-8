import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'


import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/payload/Link'
import Logo from '@/components/payload/Logo/Logo'

export async function Footer() {
  const navItems: any = []

  return (
    <footer className="mt-auto border-t border-border bg-black text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }: any, i: number) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
