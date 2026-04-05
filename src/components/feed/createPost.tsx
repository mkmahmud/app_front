import { Calendar, FileText, Send, Video } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '../ui/button'

export default function CreatePost() {
  const [text, setText] = useState('')

  return (
    <div className="mb-[16px] bg-white p-4 transition-all">
      <div className="flex items-start ">
        <div className="mr-[16px] cursor-pointer">
          <Image
            height={40}
            width={40}
            src="/assets/images/profile.png"
            alt=""
            className="w-[40px] max-w-[40px] rounded-full p-[1px]"
          />
        </div>
        <div className="relative w-full">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="h-[88px] w-full resize-none border-none bg-transparent px-[8px] py-[8px] text-[16px]  focus:outline-none"
            placeholder="Write Something ..."
          />
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="mt-[10px] flex h-[64px] items-center justify-between rounded-b-[6px] bg-[rgba(24,144,255,0.05)] px-[15px]">
        <div className="flex items-center">
          {[
            { title: 'Video', emoji: <Video size={18} /> },
            { title: 'Event', emoji: <Calendar size={18} /> },
            { title: 'Article', emoji: <FileText size={18} /> },
          ].map(item => (
            <button
              key={item.title}
              className="flex cursor-pointer items-center border-none bg-transparent px-[10px] text-[16px] font-normal text-[#666666] transition-all hover:text-[#1890FF]"
            >
              <span className="mr-[8px]">{item.emoji}</span>
              <span className="hidden xl:inline">{item.title}</span>
            </button>
          ))}
        </div>
        <Button className="  h-12 px-[22px] py-[12px]">
          <Send className="mr-[8px]" size={18} />
          <span>Post</span>
        </Button>
      </div>
    </div>
  )
}
