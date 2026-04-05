'use client'
import {
  ArrowRight,
  Bell,
  FileQuestion,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'

import { Input } from '../ui/input'

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, initAuth, logout } = useAuth()

  useEffect(() => {
    // Ensure navbar has current user data on hard refresh/navigation.
    if (!user) {
      void initAuth()
    }
  }, [initAuth, user])

  const displayName = user?.name || 'User'
  const avatarSrc = user?.avatar || '/assets/images/profile.png'

  const handleLogout = async () => {
    setProfileOpen(false)
    await logout()
  }

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-[1030] border-b border-gray-100 bg-white p-2 md:p-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex w-full items-center justify-between py-0">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                height={40}
                width={169}
                src="/assets/images/logo.svg"
                alt="Logo"
                className="h-auto max-w-[169px]"
              />
            </Link>
          </div>

          <Search className="text-[#666] md:hidden" size={17} />

          {/* Search */}
          <div className="mx-auto hidden items-center lg:flex">
            <div className="relative">
              <Search className="absolute left-[18px] top-[12px] text-[#666]" size={17} />
              <Input
                className="h-[40px] w-[424px] rounded-[32px] px-[47px] py-[7px] text-[16px] transition-colors"
                type="search"
                placeholder="input search text"
              />
            </div>
          </div>

          {/* Nav Icons */}
          <div className="hidden items-center gap-0 lg:flex">
            <ul className="mr-[8px] flex items-center">
              <li className="mx-[12px]">
                <Link
                  href="/"
                  className="relative block border-b-2 border-[#00ACFF] px-[16px] py-[22px]"
                >
                  <Home className="text-[#1890FF]" size={22} />
                </Link>
              </li>
              <li className="mx-[12px]">
                <Link
                  href="/friends"
                  className="relative block px-[16px] py-[22px] transition-colors hover:text-[#1890FF]"
                >
                  <Users className="text-[#666]" size={22} />
                </Link>
              </li>
              <li className="mx-[12px] cursor-pointer">
                <Bell className="text-[#666]" size={22} />
              </li>
              <li className="mx-[12px]">
                <Link
                  href="/chat"
                  className="relative block px-[16px] py-[22px] transition-colors hover:text-[#1890FF]"
                >
                  <MessageCircle className="text-[#666]" size={22} />
                </Link>
              </li>
            </ul>

            {/* Profile Section */}
            <div className="relative flex items-center">
              {/* FIXED: Using a button instead of a clickable div. 
                               This handles keyboard 'Enter' and 'Space' automatically.
                            */}
              <button
                type="button"
                className="group flex cursor-pointer items-center border-none bg-transparent p-0 outline-none"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                <div className="mr-[8px] w-[24px] shrink-0">
                  <Image
                    height={24}
                    width={24}
                    src={avatarSrc}
                    alt="Profile"
                    className="h-[24px] w-[24px] rounded-full object-cover"
                  />
                </div>
                <div className="flex items-center">
                  <p className="text-[16px] font-normal leading-[24px] text-[#212121]">
                    {displayName}
                  </p>
                  <span
                    className="ml-[8px] mt-[-3px] transition-transform duration-200"
                    style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="6"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        fill="#112032"
                        d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
                      />
                    </svg>
                  </span>
                </div>
              </button>

              {/* Dropdown - Changed top to 'top-full' and mt-2 
                               so it doesn't overlap the navbar text.
                            */}
              <div
                className={`absolute right-0 top-full z-[1050] mt-3 w-[312px] rounded-[6px] bg-white px-[16px] py-[16px] shadow-[0px_10px_20px_rgba(0,0,0,0.08)] transition-all duration-200 ${
                  profileOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible translate-y-2 opacity-0'
                }`}
              >
                <div className="mb-4 flex items-center">
                  <Image
                    height={54}
                    width={54}
                    src={avatarSrc}
                    alt="User Profile"
                    className="mr-[12px] h-[54px] w-[54px] rounded-full"
                  />
                  <div>
                    <h4 className="mb-0 text-[16px] font-bold text-[#212121]">
                      {displayName}
                    </h4>
                    {user?.email && (
                      <p className="mb-[4px] text-[12px] text-[#666666]">{user.email}</p>
                    )}
                    <Link
                      href="/profile"
                      className="text-[14px] text-[#377DFF] hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
                <hr className="mb-4 border-gray-100" />
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/settings"
                      className="group flex items-center text-[16px] font-medium text-[#666666] transition-colors hover:text-[#1890FF]"
                    >
                      <div className="mr-3 rounded-full bg-[#F5F5F5] p-2 text-gray-500 transition-colors group-hover:bg-[#1890FF]/10 group-hover:text-[#1890FF]">
                        <Settings size={18} />
                      </div>
                      <span>Settings</span>
                      <ArrowRight
                        className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                        size={16}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className="group flex items-center text-[16px] font-medium text-[#666666] transition-colors hover:text-[#1890FF]"
                    >
                      <div className="mr-3 rounded-full bg-[#F5F5F5] p-2 text-gray-500 transition-colors group-hover:bg-[#1890FF]/10 group-hover:text-[#1890FF]">
                        <FileQuestion size={18} />
                      </div>
                      <span>Help & Support</span>
                      <ArrowRight
                        className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                        size={16}
                      />
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="group flex w-full items-center text-[16px] font-medium text-[#666666] transition-colors hover:text-red-500"
                    >
                      <div className="mr-3 rounded-full bg-[#F5F5F5] p-2 text-gray-500 transition-colors group-hover:bg-red-50 group-hover:text-red-500">
                        <LogOut size={18} />
                      </div>
                      <span>Log Out</span>
                      <ArrowRight
                        className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                        size={16}
                      />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
