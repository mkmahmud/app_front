import { Bookmark, Gamepad2, Play, Save, Settings, Users } from 'lucide-react'
import Image from 'next/image'

export default function LeftSidebar() {
  const exploreItems = [
    { icon: <Play />, label: 'Learning', badge: 'New' },

    { icon: <Users />, label: 'Find friends', badge: null },
    { icon: <Bookmark />, label: 'Bookmarks', badge: null },
    { icon: <Users />, label: 'Group', badge: null },
    { icon: <Gamepad2 />, label: 'Gaming', badge: 'New' },
    { icon: <Settings />, label: 'Settings', badge: null },
    { icon: <Save />, label: 'Save post', badge: null },
  ]

  const suggestedPeople = [
    { name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png' },
    {
      name: 'Ryan Roslansky',
      role: 'CEO of Linkedin',
      img: '/assets/images/people2.png',
    },
    { name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png' },
  ]

  return (
    <div className="flex h-[calc(100vh-75px)] flex-1 flex-col overflow-y-auto pb-0 pt-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Explore */}
      <div className="mb-[16px] rounded-[6px] bg-white px-[24px] pb-[6px] pt-[24px] transition-all">
        <h4 className="mb-[24px] text-[16px] font-medium leading-[1.4] text-[#212121]">
          Explore
        </h4>
        <ul>
          {exploreItems.map(item => (
            <li
              key={item.label}
              className="relative mb-[24px] flex items-center justify-between"
            >
              <a
                href="#"
                className="flex w-full items-center text-[16px] font-medium text-[#666666] transition-colors hover:text-[#1890FF]"
              >
                <span className="mr-[14px] text-[18px]">{item.icon}</span>
                {item.label}
              </a>
              {item.badge && (
                <span className="absolute right-0 flex h-[24px] w-[36px] items-center justify-center rounded-[8px] border-2 border-white bg-[#0ACF83] text-[13px] font-normal text-white">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested People */}
      <div className="mb-[16px] rounded-[6px] bg-white px-[24px] pb-[6px] pt-[24px] transition-all">
        <div className="mb-[24px] flex items-center justify-between">
          <h4 className="text-[16px] font-medium text-[#212121]">Suggested People</h4>
          <a href="#" className="text-[12px] font-medium text-[#1890FF]">
            See All
          </a>
        </div>
        {suggestedPeople.map(p => (
          <div
            key={p.name}
            className="mb-[24px] flex flex-wrap items-center justify-between"
          >
            <div className="flex flex-1 items-center">
              <div className="mr-[16px]">
                <a href="#">
                  <Image
                    height={37}
                    width={37}
                    src={p.img}
                    alt={p.name}
                    className="h-[37px] w-[37px] max-w-[37px] rounded-full object-cover"
                  />
                </a>
              </div>
              <div className="flex-1">
                <a href="#">
                  <h4 className="text-[14px] font-medium leading-[1.1] text-[#212121]">
                    {p.name}
                  </h4>
                </a>
                <p className="text-[11px] font-light text-[#212121]">{p.role}</p>
              </div>
            </div>
            <div>
              <a
                href="#"
                className="block rounded-[2px] border border-[#DCDFE4] bg-white px-[7px] py-[7px] text-[12px] font-medium text-[#959EAE] transition-all hover:border-[#1890FF] hover:bg-[#1890FF] hover:text-white"
              >
                Connect
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="mb-[16px] rounded-[6px] bg-white px-[24px] pb-[6px] pt-[24px] transition-all">
        <div className="mb-[24px] flex items-center justify-between">
          <h4 className="text-[16px] font-medium text-[#212121]">Events</h4>
          <a href="#" className="text-[12px] font-medium text-[#1890FF]">
            See all
          </a>
        </div>
        <div className="mb-[16px] cursor-pointer rounded-[6px] bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.08)]">
          <Image
            height={200}
            width={400}
            src="/assets/images/feed_event1.png"
            alt="Event"
            className="h-auto w-full rounded-t-[6px]"
          />
          <div className="flex items-center px-[16px] pb-[14px] pt-[20px]">
            <div className="rounded-[2px] bg-[#0ACF83] px-[8px] py-[8px] text-center">
              <p className="text-[18px] font-bold leading-[1.1] text-white">10</p>
              <p className="text-[18px] font-normal leading-[1.1] text-white">Jul</p>
            </div>
            <div className="pl-[8px]">
              <h4 className="text-[16px] font-medium leading-[1.4] text-black">
                No more terrorism no more cry
              </h4>
            </div>
          </div>
          <hr className="mx-0 my-[4px] mb-[10px] border-[#DFDFDF]" />
          <div className="flex items-center justify-between px-[16px] pb-[12px]">
            <p className="text-[12px] font-medium text-[#8A8A8A] opacity-70">
              17 People Going
            </p>
            <a
              href="#"
              className="rounded-[2px] border border-[#1890FF] bg-[#F3F9FF] px-[14px] py-[3px] text-[12px] font-medium text-[#1890FF] transition-all hover:bg-[#1890FF] hover:text-white"
            >
              Going
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
