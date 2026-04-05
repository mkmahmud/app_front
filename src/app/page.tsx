'use client'

import CreatePost from '@/components/feed/createPost'
import PostCard from '@/features/post/postCard'

const DEMO_POSTS: any[] = [
  {
    id: 1,
    author: 'Dylan Field',
    authorImg: '/assets/images/profile.png',
    time: '2 hours ago • Public',
    content:
      'Just launched a new feature on Figma! Excited to share how we made collaboration even smoother. Check it out 🎉',
    image: '/assets/images/grp_ct1.png',
    reactions: [{ img: '/assets/images/f9.png' }, { img: '/assets/images/f9.png' }],
    reactCount: 24,
    commentCount: 8,
    shareCount: 3,
  },
]
export default function HomePage() {
  return (
    <div className=" w-full ">
      {/* Stories */}
      <StoriesArea />
      {/* Create Post */}
      <CreatePost />
      {/* Posts */}
      {DEMO_POSTS.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
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
