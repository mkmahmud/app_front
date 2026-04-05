import Image from 'next/image'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

export default function PostCard(post: any) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="mb-[16px] rounded-[0px] bg-white transition-all">
      {/* Post Header */}
      <div className="mb-[16px] flex items-center justify-between px-[24px] pt-[24px]">
        <div className="flex cursor-pointer items-center">
          <div className="mr-[16px]">
            <Image
              height={44}
              width={44}
              src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
              alt={post.author}
              className="w-[44px] max-w-[44px] rounded-full transition-all hover:opacity-70"
            />
          </div>
          <div>
            <h4 className="text-[16px] font-normal text-black transition-all hover:underline">
              {post.author}
            </h4>
            <p className="text-black/46 text-[14px] font-normal">
              <a href="#" className="text-black/46 transition-all hover:underline">
                {post.time}
              </a>
            </p>
          </div>
        </div>
        <div className="relative">
          <button className="block cursor-pointer border-none bg-transparent p-[5px] outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="17"
              fill="none"
              viewBox="0 0 4 17"
            >
              <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-[16px] px-[24px] text-[14px] font-normal text-black">
        {post.content}
      </p>

      {/* Post Image */}

      <div className="mb-[24px] px-[24px]">
        <Image
          src="https://media.sproutsocial.com/uploads/2022/05/How-to-post-on-instagram-from-pc.jpg"
          alt="Post"
          className="h-auto w-full rounded-[6px]"
          height={400}
          width={400}
        />
      </div>

      {/* Reactions Row */}
      <div className="mb-[8px] flex items-center justify-between px-[24px]">
        <div className="flex items-center">
          <div className="flex cursor-pointer">
            <Image
              height={32}
              width={32}
              src="https://icons.veryicon.com/png/o/internet--web/web-interface-flat/6606-male-user.png"
              alt=""
              className={` 'max-w-[32px] h-[32px]' : 'max-w-[32px] -ml-[16px]'} h-[32px] w-[32px] w-[32px] cursor-pointer rounded-full border border-white bg-[#C4C4C4]`}
            />

            <div className="-ml-[16px] flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-white bg-[#1890FF] text-[14px] font-normal text-white">
              {post?.reactCount}+
            </div>
          </div>
        </div>
        <div className="flex">
          <p className="mx-[16px] text-[14px] font-normal">
            <a href="#" className="text-black/46">
              <span className="text-[#212121]">{post.commentCount}</span> Comments
            </a>
          </p>
          <p className="text-[14px] font-normal">
            <span className="text-[#212121]">{post.shareCount}</span>{' '}
            <span className="text-black/46">Share</span>
          </p>
        </div>
      </div>

      {/* Reaction Buttons */}
      <div className="flex bg-[#FBFCFD] px-[8px]">
        {[
          { label: 'Like', emoji: '👍' },
          { label: 'Love', emoji: '❤️' },
          { label: 'Haha', emoji: '😂' },
          { label: 'Wow', emoji: '😮' },
          { label: 'Sad', emoji: '😢' },
          { label: 'Angry', emoji: '😡' },
        ].map(r => (
          <button
            key={r.label}
            onClick={() => r.label === 'Like' && setLiked(!liked)}
            className={`flex h-[48px] flex-1 items-center justify-center rounded-[6px] border-none text-[14px] font-normal text-black transition-all hover:bg-[#e4f1fd] ${liked && r.label === 'Like' ? 'bg-[#e4f1fd]' : 'bg-transparent'}`}
          >
            <span className="mr-[8px]">{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-2 p-2">
        <Button
          variant="secondary"
          className="w-full border-none !outline-none hover:bg-primary/10 "
        >
          Haha
        </Button>
        <Button
          variant="secondary"
          className="w-full  border-none !outline-none hover:bg-primary/10 "
        >
          Comments
        </Button>
        <Button
          variant="secondary"
          className="w-full  border-none !outline-none hover:bg-primary/10 "
        >
          share
        </Button>
      </div>

      {/* Comment Input */}
      <div className="px-[24px] py-[24px] pt-[24px]">
        <div className="flex items-center justify-between rounded-[18px] bg-[#F6F6F6] px-[9px] py-[4px]">
          <div className="flex w-full flex-1 items-center">
            <img
              src="/assets/images/profile.png"
              alt=""
              className="w-[26px] max-w-[26px]"
            />
            <div className="relative w-full">
              <textarea
                className="h-[38px] w-full resize-none border-none bg-transparent px-[8px] py-[8px] text-[14px] focus:shadow-none focus:outline-none"
                placeholder="Write a comment..."
              />
            </div>
          </div>
          <div className="flex">
            <button className="mx-[4px] border-none bg-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="9" stroke="#1890FF" strokeWidth="1.5" />
                <path
                  stroke="#1890FF"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M7 10.5c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5M7.5 8h.01M12.5 8h.01"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* All comments */}
      <div className="p-4">
        <Button variant="link" className="  text-left hover:bg-transparent   ">
          View all comments
        </Button>
        <div>
          <div className="flex ">
            <div className="mr-[16px]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                alt={post.author}
                className="w-[44px] max-w-[44px] rounded-full transition-all hover:opacity-70"
              />
            </div>
            <div className="p-2">
              <div className="rounded bg-gray-200 p-2">
                <h2 className="text-lg">Test User</h2>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti ea
                  repellat eveniet quasi aliquid dolore tenetur, neque deleniti obcaecati
                  dolorum?
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="link" className="  text-left hover:bg-transparent   ">
                  like
                </Button>{' '}
                .
                <Button variant="link" className="  text-left hover:bg-transparent   ">
                  reply
                </Button>{' '}
                .
                <Button variant="link" className="  text-left hover:bg-transparent   ">
                  SHare
                </Button>{' '}
                .<p className="text-gray">21m</p>
              </div>
              <div className="px-[24px] py-[24px] pt-[24px]">
                <div className="flex items-center justify-between rounded-[18px] bg-[#F6F6F6] px-[9px] py-[4px]">
                  <div className="flex w-full flex-1 items-center">
                    <img
                      src="/assets/images/profile.png"
                      alt=""
                      className="w-[26px] max-w-[26px]"
                    />
                    <div className="relative w-full">
                      <textarea
                        className="h-[38px] w-full resize-none border-none bg-transparent px-[8px] py-[8px] text-[14px] focus:shadow-none focus:outline-none"
                        placeholder="Write a comment..."
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <button className="mx-[4px] border-none bg-transparent">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="9"
                          stroke="#1890FF"
                          strokeWidth="1.5"
                        />
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M7 10.5c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5M7.5 8h.01M12.5 8h.01"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
