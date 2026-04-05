import { Bell, Home, Menu, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1030] bg-white px-[19px] py-[20px] lg:hidden">
      <ul className="flex items-center justify-between">
        {[
          { href: '', active: true, icon: <Home size={22} /> },
          { href: '/friends', active: false, icon: <Users size={22} /> },
          { href: '/notifications', active: false, icon: <Bell size={22} />, count: 6 },
          { href: '/chat', active: false, icon: <MessageCircle size={22} />, count: 2 },
          { href: '/', active: false, icon: <Menu size={22} /> },
        ].map((item, i) => (
          <li key={i} className="relative">
            <Link
              href={item.href}
              className={`text-[22px] ${item.active ? 'text-[#1890FF]' : 'text-black/60'}`}
            >
              {item.icon}
              {item.count && (
                <span className="absolute -right-[4px] -top-[4px] flex h-[17px] min-w-[17px] items-center justify-center rounded-[9px] border border-white bg-[#1890FF] px-[3px] text-[11px] text-white">
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
