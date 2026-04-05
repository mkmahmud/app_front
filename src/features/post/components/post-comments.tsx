'use client'

import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { PaginatedPosts } from '@/features/post/services/post.graphql.service'
import {
  FEED_POSTS_QUERY_KEY,
  postGraphqlService,
  postQueryKey,
} from '@/features/post/services/post.graphql.service'
import { useAppDispatch } from '@/store'
import { addToast } from '@/store/ui.slice'

type PostCommentsProps = {
  postId: string
  commentCount: number
  showAll?: boolean
}

export default function PostComments({
  postId,
  commentCount,
  showAll = false,
}: PostCommentsProps) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null)
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})

  const { data: postData } = useQuery({
    queryKey: postQueryKey(postId),
    queryFn: () => postGraphqlService.getPostById(postId),
    refetchInterval: 10_000,
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
      postGraphqlService.addComment({
        postId,
        content,
      }),
    onSuccess: addedComment => {
      queryClient.setQueryData(postQueryKey(postId), previous => {
        if (!previous) return previous
        const previousPost = previous as Awaited<
          ReturnType<typeof postGraphqlService.getPostById>
        >
        return {
          ...previousPost,
          comments: [...(previousPost.comments ?? []), addedComment],
          commentCount: previousPost.commentCount + 1,
        }
      })

      queryClient.setQueryData<InfiniteData<PaginatedPosts>>(
        FEED_POSTS_QUERY_KEY,
        previous => {
          if (!previous) return previous

          return {
            ...previous,
            pages: previous.pages.map(page => ({
              ...page,
              posts: page.posts.map(post =>
                post.id === postId
                  ? { ...post, commentCount: post.commentCount + 1 }
                  : post
              ),
            })),
          }
        }
      )

      setCommentText('')
      setReplyingTo(null)
    },
    onError: error => {
      dispatch(
        addToast({
          title: 'Comment failed',
          description: error instanceof Error ? error.message : 'Could not add comment.',
          variant: 'destructive',
        })
      )
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = commentText.trim()
    if (!value) return

    const payload = replyingTo ? `@${replyingTo.name} ${value}` : value
    addCommentMutation.mutate(payload)
  }

  const comments = postData?.comments ?? []
  const visibleComments = showAll ? comments : comments.slice(-1)

  return (
    <div className="px-[24px] pb-[24px] pt-[12px]">
      <div className="mb-2 text-[14px] text-[#666]">{commentCount} comments</div>
      {!showAll && comments.length > 1 && (
        <p className="mb-2 text-[12px] text-[#999]">Showing latest comment</p>
      )}

      <form onSubmit={onSubmit} className="mb-3">
        <div className="flex items-center justify-between rounded-[18px] bg-[#F6F6F6] px-[9px] py-[4px]">
          <div className="flex w-full flex-1 items-center">
            <Image
              src={user?.avatar || '/assets/images/profile.png'}
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] max-w-[26px] rounded-full"
            />
            <div className="relative w-full">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="h-[38px] w-full resize-none border-none bg-transparent px-[8px] py-[8px] text-[14px] focus:shadow-none focus:outline-none"
                placeholder={
                  replyingTo ? `Reply to ${replyingTo.name}...` : 'Write a comment...'
                }
              />
            </div>
          </div>
          <Button type="submit" variant="ghost" disabled={addCommentMutation.isPending}>
            Send
          </Button>
        </div>
        {replyingTo && (
          <button
            type="button"
            className="mt-1 text-xs text-[#377DFF]"
            onClick={() => setReplyingTo(null)}
          >
            Cancel reply
          </button>
        )}
      </form>

      <div className="space-y-3">
        {visibleComments.map(comment => (
          <div key={comment.id} className="flex items-start gap-3">
            <Image
              src={comment.author?.avatar || '/assets/images/profile.png'}
              alt={comment.author?.name || 'User'}
              width={36}
              height={36}
              className="h-[36px] w-[36px] rounded-full"
            />
            <div className="flex-1">
              <div className="rounded bg-gray-100 p-2">
                <p className="text-[13px] font-semibold text-[#212121]">
                  {comment.author?.name}
                </p>
                <p className="text-[13px] text-[#333]">{comment.content}</p>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-[#777]">
                <button
                  type="button"
                  className={
                    likedComments[comment.id] ? 'text-[#1890FF]' : 'hover:text-[#1890FF]'
                  }
                  onClick={() =>
                    setLikedComments(previous => ({
                      ...previous,
                      [comment.id]: !previous[comment.id],
                    }))
                  }
                >
                  Like
                </button>
                <span>•</span>
                <button
                  type="button"
                  className="hover:text-[#1890FF]"
                  onClick={() =>
                    setReplyingTo({
                      id: comment.id,
                      name: comment.author?.name || 'User',
                    })
                  }
                >
                  Reply
                </button>
                <span>•</span>
                <span>{formatRelativeTime(comment.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}

        {!visibleComments.length && (
          <p className="text-[13px] text-[#999]">
            No comments yet. Be the first to comment.
          </p>
        )}
      </div>
    </div>
  )
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffInMinutes = Math.max(1, Math.floor((now - then) / (1000 * 60)))

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}
