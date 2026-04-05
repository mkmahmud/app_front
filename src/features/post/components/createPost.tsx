'use client'

import type { InfiniteData } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { ImageDown, Send, Video } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { PaginatedPosts } from '@/features/post/services/post.graphql.service'
import {
  FEED_POSTS_QUERY_KEY,
  postGraphqlService,
} from '@/features/post/services/post.graphql.service'
import { useAppDispatch } from '@/store'
import { addToast } from '@/store/ui.slice'

type CreatePostFormValues = {
  caption?: string
  image?: FileList
  visibility: 'PUBLIC' | 'PRIVATE'
}

export default function CreatePost() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  //Get Current User
  const { user } = useAuth()

  const avatarSrc = user?.avatar || '/assets/images/profile.png'
  console.log('Current user:', user)

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { isSubmitting },
  } = useForm<CreatePostFormValues>({
    defaultValues: {
      visibility: 'PUBLIC',
    },
  })

  const selectedImage = watch('image')
  const selectedFileName = selectedImage?.[0]?.name
  const selectedFile = selectedImage?.[0]
  const selectedVisibility = watch('visibility')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])

  const onSubmit = async (data: CreatePostFormValues) => {
    const caption = data.caption?.trim()
    const file = data.image?.[0]
    const visibility = data.visibility
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

    if (!caption && !file) {
      dispatch(
        addToast({
          title: 'Post is empty',
          description: 'Add caption or select an image to post.',
          variant: 'destructive',
        })
      )
      return
    }

    try {
      let imageUrl: string | undefined

      if (file) {
        if (!imgbbApiKey) {
          dispatch(
            addToast({
              title: 'Configuration missing',
              description: 'NEXT_PUBLIC_IMGBB_API_KEY is not set.',
              variant: 'destructive',
            })
          )
          return
        }

        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const result = await response.json()

        if (!response.ok || !result?.success) {
          dispatch(
            addToast({
              title: 'Upload failed',
              description: 'Failed to upload image to imgbb.',
              variant: 'destructive',
            })
          )
          return
        }

        imageUrl = result?.data?.url

        if (!imageUrl) {
          dispatch(
            addToast({
              title: 'Upload failed',
              description: 'Image URL was missing in upload response.',
              variant: 'destructive',
            })
          )
          return
        }
      }

      const createdPost = await postGraphqlService.createPost({
        content: caption,
        imageUrl,
        visibility,
      })

      queryClient.setQueryData<InfiniteData<PaginatedPosts>>(
        FEED_POSTS_QUERY_KEY,
        previous => {
          if (!previous || !previous.pages.length) return previous

          const firstPage = previous.pages[0]
          const optimisticPost = {
            ...createdPost,
            author: {
              id: user?.id || 'me',
              name: user?.name || 'You',
              avatar: user?.avatar || '/assets/images/profile.png',
            },
            comments: [],
          }

          return {
            ...previous,
            pages: [
              {
                ...firstPage,
                posts: [optimisticPost, ...firstPage.posts],
                meta: {
                  ...firstPage.meta,
                  total: firstPage.meta.total + 1,
                },
              },
              ...previous.pages.slice(1),
            ],
          }
        }
      )

      resetField('image')
      resetField('caption')
      resetField('visibility', { defaultValue: 'PUBLIC' })
      dispatch(
        addToast({
          title: 'Post created',
          description: 'Your post has been published successfully.',
          variant: 'success',
        })
      )
    } catch (error) {
      console.error('Create post failed.', error)
      dispatch(
        addToast({
          title: 'Post failed',
          description: error instanceof Error ? error.message : 'Unable to create post.',
          variant: 'destructive',
        })
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-[16px] bg-white p-4 transition-all"
    >
      <div className="flex items-start ">
        <div className="mr-[16px] cursor-pointer">
          <Image
            height={40}
            width={40}
            src={avatarSrc}
            alt=""
            className="h-[40px] w-[40px] max-w-[40px] rounded-full p-[1px]"
          />
        </div>
        <div className="relative w-full px-[8px] py-[8px] text-[15px] text-gray-600">
          <textarea
            {...register('caption')}
            className="h-[88px] w-full resize-none border-none bg-transparent text-[16px] focus:outline-none"
            placeholder="Write Something ..."
          />
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="mt-[10px] flex h-[64px] items-center justify-between rounded-b-[6px] bg-[rgba(24,144,255,0.05)] px-[15px]">
        <div className="flex items-center">
          <input
            id="post-image"
            type="file"
            accept="image/*"
            className="hidden"
            {...register('image')}
          />
          <Button type="button" variant="ghost" asChild>
            <label htmlFor="post-image" className="cursor-pointer">
              <ImageDown size={18} />
              <span>Photo</span>
            </label>
          </Button>
          <Button disabled variant="ghost">
            <Video size={18} />
            <span>Video</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <select
            {...register('visibility')}
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#1890FF]"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-[22px] py-[12px]"
          >
            <Send className="mr-[8px]" size={18} />
            <span>{isSubmitting ? 'Posting...' : `Post`}</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
