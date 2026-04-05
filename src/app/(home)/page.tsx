'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import CreatePost from '@/features/post/components/createPost'
import PostCard from '@/features/post/postCard'
import type {
  FeedPost,
  PaginatedPosts,
} from '@/features/post/services/post.graphql.service'
import {
  FEED_POSTS_QUERY_KEY,
  postGraphqlService,
} from '@/features/post/services/post.graphql.service'

const PAGE_SIZE = 10

export default function HomePage() {
  const scrollFeedToTop = () => {
    const scrollContainer = document.getElementById('home-feed-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [showRefreshButton, setShowRefreshButton] = useState(false)

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery<PaginatedPosts>({
    queryKey: FEED_POSTS_QUERY_KEY,
    initialPageParam: 1,
    refetchInterval: 15_000,
    queryFn: ({ pageParam }) =>
      postGraphqlService.getPosts({
        page: Number(pageParam),
        pageSize: PAGE_SIZE,
      }),
    getNextPageParam: lastPage => {
      if (!lastPage.meta.hasNextPage) {
        return undefined
      }
      return lastPage.meta.page + 1
    },
  })

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const scrollContainer = document.getElementById('home-feed-scroll-container')
    if (!scrollContainer) return

    const onScroll = () => {
      // Show after roughly 10 feed "pages" (10 viewport-heights of the scroll container).
      const threshold = scrollContainer.clientHeight * 10
      setShowRefreshButton(scrollContainer.scrollTop >= threshold)
    }

    onScroll()
    scrollContainer.addEventListener('scroll', onScroll)

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    // Prevent browser from restoring previous scroll offset.
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    // Force top on first paint and once more after layout settles.
    scrollFeedToTop()
    const rafId = window.requestAnimationFrame(scrollFeedToTop)
    const timeoutId = window.setTimeout(scrollFeedToTop, 120)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
    }
  }, [])

  const handleRefreshPosts = () => {
    scrollFeedToTop()
    void refetch().finally(() => {
      scrollFeedToTop()
    })
  }

  const posts = useMemo(() => data?.pages.flatMap(page => page.posts) ?? [], [data])

  const mappedPosts = useMemo(() => posts.map(mapFeedPostToCard), [posts])

  return (
    <div className=" relative   w-full">
      {/* Stories */}
      <StoriesArea />

      {showRefreshButton && (
        <div className="fixed left-1/2 top-24 z-[1100] -translate-x-1/2">
          <Button onClick={handleRefreshPosts} disabled={isRefetching}>
            <RefreshCcw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>{isRefetching ? 'Refreshing...' : 'Refresh Feed'}</span>
          </Button>
        </div>
      )}

      {/* Create Post */}
      <CreatePost />

      {isLoading && (
        <div className="mb-4 rounded-md bg-white p-4 text-sm text-gray-500">
          Loading posts...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
          Failed to load posts.
        </div>
      )}

      {/* Posts */}
      {mappedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {!isLoading && !error && mappedPosts.length === 0 && (
        <div className="mb-4 rounded-md bg-white p-6 text-center text-sm text-gray-500">
          No posts available yet.
        </div>
      )}

      <div ref={loadMoreRef} className="h-8" />

      {isFetchingNextPage && (
        <div className="mb-4 rounded-md bg-white p-4 text-center text-sm text-gray-500">
          Loading more posts...
        </div>
      )}

      {!hasNextPage && mappedPosts.length > 0 && (
        <div className="mb-4 rounded-md bg-white p-4 text-center text-sm text-gray-400">
          You reached the end.
        </div>
      )}
    </div>
  )
}

function mapFeedPostToCard(post: FeedPost) {
  return {
    id: post.id,
    author: post.author?.name || 'Unknown User',
    authorImg: post.author?.avatar || '/assets/images/profile.png',
    time: `${formatRelativeTime(post.createdAt)} • ${post.visibility}`,
    content: post.content || '',
    image: post.imageUrl || '',
    reactCount: post.likeCount,
    commentCount: post.commentCount,
    shareCount: post.shareCount,
  }
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

function StoriesArea() {
  return (
    <div className="relative mb-[16px] bg-white px-[16px] py-[16px]">
      <div className="flex items-center gap-[8px] overflow-auto">
        {/* My Story */}
        <div className="relative w-[120px] flex-shrink-0 cursor-pointer">
          <div className="relative z-[2]">
            <img
              src="/assets/images/story1.png"
              alt="Story"
              className="h-[160px] w-[120px] rounded-[6px] object-cover"
            />
            <div className="absolute inset-0 z-[1] rounded-[6px] bg-black opacity-50" />
          </div>
          <div className="absolute bottom-0 z-[1] w-full rounded-[25px_25px_6px_6px] bg-[#112032] px-0 pt-[30px]">
            <p className="mb-[10px] text-center text-[12px] font-medium text-white">
              Your Story
            </p>
          </div>
          <div className="absolute left-1/2 top-[-12px] z-[2] -translate-x-1/2">
            <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-[#112032] bg-[#1890FF] text-[18px] leading-none text-white">
              +
            </button>
          </div>
        </div>

        {/* Public Stories */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="relative w-[120px] flex-shrink-0 cursor-pointer overflow-hidden"
          >
            <div className="relative z-[2]">
              <img
                src={`/assets/images/story${i + 1}.png`}
                alt="Story"
                className="h-[160px] w-[120px] rounded-[6px] object-cover"
              />
              <div className="absolute inset-0 z-[1] rounded-[6px] bg-black opacity-50 transition-all hover:opacity-70" />
            </div>
            <div className="absolute bottom-0 z-[1] w-full px-0">
              <p className="mb-[10px] text-center text-[12px] font-medium leading-[19px] text-white">
                User Story {i}
              </p>
            </div>
            <div className="absolute right-[12px] top-[12px] z-[1]">
              <img
                src={`/assets/images/people${i}.png`}
                alt=""
                className="h-[28px] w-[28px] max-w-[28px] rounded-full border-2 border-white bg-[#C4C4C4] object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
