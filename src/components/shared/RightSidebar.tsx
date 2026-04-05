import Image from 'next/image'
import React from 'react'

export default function RightSidebar() {
  const people = [
    { name: 'John Abraham', role: 'UI/UX Designer', img: '/assets/images/ppl1.png' },
    { name: 'Emily Carter', role: 'Product Manager', img: '/assets/images/ppl2.png' },
    { name: 'Alex Johnson', role: 'Frontend Dev', img: '/assets/images/ppl3.png' },
  ]

  return (
    <div className="flex h-[calc(100vh-75px)] flex-1 flex-col overflow-auto pb-0 pt-[18px]">
      {/* People You May Know */}
      <div className="mb-[16px] rounded-[6px] bg-white px-[24px] pb-[6px] pt-[24px] transition-all">
        <div className="mb-[24px] flex items-center justify-between">
          <h4 className="text-[16px] font-medium text-[#212121]">People you may know</h4>
          <a href="#" className="text-[12px] font-medium text-[#1890FF]">
            See All
          </a>
        </div>
        {people.map(p => (
          <div key={p.name} className="mb-[24px] flex items-center">
            <div className="mr-[20px]">
              <Image
                height={50}
                width={50}
                src={p.img}
                alt={p.name}
                className="h-[50px] w-[50px] max-w-[50px] rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-[16px] font-medium text-[#212121]">{p.name}</h4>
              <p className="text-[12px] font-normal text-[#212121]">{p.role}</p>
            </div>
            <div className="flex">
              <button className="mx-[4px] rounded-[6px] border border-[#f1f1f1] bg-transparent px-[40px] py-[9px] text-[14px] font-medium text-[#959eae] transition-all hover:bg-[#377DFF] hover:text-white">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Search People */}
      <div className="mb-[16px] rounded-[6px] bg-white px-[24px] pb-[24px] pt-[24px]">
        <div className="mb-[24px] flex items-center justify-between">
          <h4 className="text-[16px] font-medium text-[#212121]">Search People</h4>
        </div>
        <div className="relative mb-[24px]">
          <svg
            className="absolute left-[18px] top-[12px]"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            fill="none"
            viewBox="0 0 17 17"
          >
            <circle cx="7" cy="7" r="6" stroke="#1890FF" />
            <path stroke="#1890FF" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            className="h-[40px] w-full rounded-[32px] border border-[#F5F5F5] bg-[#F5F5F5] py-[7px] pl-[47px] pr-4 transition-colors hover:border-[#1890FF] focus:outline-none"
            placeholder="Search..."
          />
        </div>
        {people.map(p => (
          <div
            key={p.name}
            className="mb-[24px] flex cursor-pointer items-center justify-between rounded-[8px] p-[6px] transition-all hover:bg-[#e4e6e9]"
          >
            <div className="flex items-center">
              <div className="mr-[16px]">
                <Image
                  height={40}
                  width={40}
                  src={p.img}
                  alt={p.name}
                  className="h-[40px] w-[40px] max-w-[40px] rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-[#212121]">{p.name}</h4>
                <p className="text-[11px] font-light text-[#212121]">{p.role}</p>
              </div>
            </div>
            <span className="text-black/46 text-[11px] font-normal leading-[21px]">
              2d
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
