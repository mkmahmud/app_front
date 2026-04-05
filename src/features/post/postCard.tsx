'use client'

import { MessageCircle, Share2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import PostComments from '@/features/post/components/post-comments'
import PostReactions from '@/features/post/components/post-reactions'
import { useAppDispatch } from '@/store'
import { addToast } from '@/store/ui.slice'

type PostCardProps = {
  post: {
    id: string
    author: string
    authorImg: string
    time: string
    content: string
    image?: string
    reactCount: number
    commentCount: number
    shareCount: number
  }
}

export default function PostCard(props: PostCardProps) {
  const dispatch = useAppDispatch()
  const [showAllComments, setShowAllComments] = useState(false)
  const [showReactionsModal, setShowReactionsModal] = useState(false)
  const post = props?.post ?? props

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?post=${post.id}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      dispatch(
        addToast({
          title: 'Link copied',
          description: 'Post link copied to clipboard.',
          variant: 'success',
        })
      )
    } catch {
      dispatch(
        addToast({
          title: 'Share failed',
          description: 'Could not copy post link.',
          variant: 'destructive',
        })
      )
    }
  }

  return (
    <div className="mb-[16px] rounded-[0px] bg-white transition-all">
      {/* Post Header */}
      <div className="mb-[16px] flex items-center justify-between px-[24px] pt-[24px]">
        <div className="flex cursor-pointer items-center">
          <div className="mr-[16px]">
            <Image
              height={44}
              width={44}
              src={post.authorImg || '/assets/images/profile.png'}
              alt={post.author}
              className="h-[44px] w-[44px] max-w-[44px] rounded-full transition-all hover:opacity-70"
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
      {post?.image ? (
        <div className="mb-[24px] px-[24px]">
          <Image
            src={post.image}
            alt="Post"
            className="h-auto w-full rounded-[6px]"
            height={400}
            width={400}
          />
        </div>
      ) : null}

      {/* Reactions Row */}
      <div className="mb-[8px] flex items-center justify-between px-[24px]">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setShowReactionsModal(true)}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-[32px] min-w-[32px] items-center justify-center rounded-full border-2 border-white bg-[#1890FF] px-2 text-[12px] font-normal text-white">
              {post?.reactCount}
            </div>
            <span className="text-[13px] text-[#666]">Reactions</span>
          </button>
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

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-2 p-2">
        <PostReactions
          postId={post.id}
          likeCount={post.reactCount}
          showReactionsModal={showReactionsModal}
          onCloseReactionsModal={() => setShowReactionsModal(false)}
        />
        <Button
          variant="secondary"
          className="w-full border-none !outline-none hover:bg-primary/10"
          onClick={() => setShowAllComments(previous => !previous)}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{showAllComments ? 'Hide Comments' : 'Comments'}</span>
        </Button>
        <Button
          variant="secondary"
          className="w-full border-none !outline-none hover:bg-primary/10"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      <PostComments
        postId={post.id}
        commentCount={post.commentCount}
        showAll={showAllComments}
      />
    </div>
  )
}
