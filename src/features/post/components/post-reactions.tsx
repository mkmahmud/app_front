'use client'

import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type {
  PaginatedPosts,
  PostReactionsSummary,
  ReactionType,
} from '@/features/post/services/post.graphql.service'
import {
  FEED_POSTS_QUERY_KEY,
  postGraphqlService,
} from '@/features/post/services/post.graphql.service'
import { useAppDispatch } from '@/store'
import { addToast } from '@/store/ui.slice'

type PostReactionsProps = {
  postId: string
  likeCount: number
  showReactionsModal: boolean
  onCloseReactionsModal: () => void
}

const REACTIONS: Array<{ type: ReactionType; label: string; emoji: string }> = [
  { type: 'LIKE', label: 'Like', emoji: '👍' },
  { type: 'LOVE', label: 'Love', emoji: '❤️' },
  { type: 'HAHA', label: 'Haha', emoji: '😂' },
  { type: 'WOW', label: 'Wow', emoji: '😮' },
  { type: 'SAD', label: 'Sad', emoji: '😢' },
  { type: 'ANGRY', label: 'Angry', emoji: '😡' },
]

export default function PostReactions({
  postId,
  likeCount,
  showReactionsModal,
  onCloseReactionsModal,
}: PostReactionsProps) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null)

  const reactMutation = useMutation({
    mutationFn: (type: ReactionType) =>
      postGraphqlService.reactToPost({
        postId,
        type,
      }),
    onMutate: async type => {
      setSelectedReaction(current => (current === type ? null : type))
    },
    onSuccess: data => {
      queryClient.setQueryData<InfiniteData<PaginatedPosts>>(
        FEED_POSTS_QUERY_KEY,
        previous => {
          if (!previous) return previous

          return {
            ...previous,
            pages: previous.pages.map(page => ({
              ...page,
              posts: page.posts.map(post =>
                post.id === postId ? { ...post, likeCount: data.totalLikes } : post
              ),
            })),
          }
        }
      )
    },
    onError: error => {
      dispatch(
        addToast({
          title: 'Reaction failed',
          description:
            error instanceof Error ? error.message : 'Could not react to this post.',
          variant: 'destructive',
        })
      )
    },
  })

  const selectedReactionConfig = REACTIONS.find(r => r.type === selectedReaction)

  const { data: reactionCount, isFetching: isCountLoading } = useQuery<number>({
    queryKey: ['post-reaction-count', postId],
    queryFn: () => postGraphqlService.getPostReactionCount(postId),
    enabled: true,
  })

  const { data: reactionsSummary, isFetching: isSummaryLoading } =
    useQuery<PostReactionsSummary>({
      queryKey: ['post-reactions-summary', postId],
      queryFn: () => postGraphqlService.getPostReactionsSummary(postId),
      enabled: showReactionsModal,
    })

  const totalReactions = reactionCount ?? likeCount
  const summaryTotal = reactionsSummary?.totalReactions ?? totalReactions

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Button
          variant="secondary"
          className="border-none !outline-none hover:bg-primary/10"
        >
          <span>{selectedReactionConfig?.emoji || '👍'}</span>
          <span>{selectedReactionConfig?.label || 'React'}</span>
          <span className="ml-1 text-[12px] text-[#666]">({totalReactions})</span>
        </Button>

        {isOpen && (
          <div className="absolute bottom-8 left-0 z-20 flex items-center gap-1 rounded-[999px] bg-white p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
            {REACTIONS.map(r => (
              <button
                key={r.type}
                onClick={() => reactMutation.mutate(r.type)}
                disabled={reactMutation.isPending}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] transition-transform hover:scale-110 disabled:opacity-50"
                title={r.label}
                aria-label={`React ${r.label}`}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {showReactionsModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[10px] bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#212121]">Reactions</h3>
              <button
                type="button"
                className="rounded p-1 text-[#666] hover:bg-gray-100"
                onClick={onCloseReactionsModal}
                aria-label="Close reactions modal"
              >
                x
              </button>
            </div>

            {isSummaryLoading || isCountLoading ? (
              <p className="py-6 text-center text-[14px] text-[#777]">
                Loading reactions...
              </p>
            ) : (
              <>
                <div className="mb-3 rounded-md border border-gray-100 px-3 py-4 text-center">
                  <p className="text-[13px] text-[#666]">Total Reactions</p>
                  <p className="mt-1 text-[24px] font-semibold text-[#212121]">
                    {summaryTotal}
                  </p>
                </div>

                {reactionsSummary?.totalsByType?.length ? (
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    {reactionsSummary.totalsByType
                      .filter(item => item.count > 0)
                      .map(item => {
                        const match = REACTIONS.find(r => r.type === item.type)
                        return (
                          <div
                            key={item.type}
                            className="rounded-md border border-gray-100 px-3 py-2 text-sm text-[#333]"
                          >
                            <span className="mr-2">{match?.emoji || '👍'}</span>
                            <span>{match?.label || item.type}</span>
                            <span className="float-right font-medium">{item.count}</span>
                          </div>
                        )
                      })}
                  </div>
                ) : null}

                <div className="max-h-[280px] space-y-2 overflow-auto pr-1">
                  {reactionsSummary?.reactors?.length ? (
                    reactionsSummary.reactors.map((reactor, index) => {
                      const match = REACTIONS.find(r => r.type === reactor.reactionType)
                      return (
                        <div
                          key={`${reactor.userId}-${reactor.reactionType}-${index}`}
                          className="flex items-center gap-3 rounded-md border border-gray-100 px-3 py-2"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[15px]">
                            {match?.emoji || '👍'}
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-medium text-[#212121]">
                              {reactor.name}
                            </p>
                            <p className="text-[12px] text-[#777]">
                              {match?.label || reactor.reactionType}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="py-4 text-center text-[13px] text-[#777]">
                      No user reactions found.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
