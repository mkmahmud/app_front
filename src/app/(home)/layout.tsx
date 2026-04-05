import BottomNav from '@/components/shared/BottomNav'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Navbar from '@/components/shared/Navbar'
import RightSidebar from '@/components/shared/RightSidebar'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-[70px]">
        <div className="relative flex gap-0">
          {/* Left Sidebar */}
          <div className="hidden w-[25%] pr-0 lg:block xl:w-[25%] ">
            <LeftSidebar />
          </div>

          {/* Middle Feed */}
          <div
            id="home-feed-scroll-container"
            className="mt-2 h-[calc(100vh-75px)] w-full overflow-auto px-0 md:px-4 lg:w-[50%] lg:px-6 xl:w-[50%] [&::-webkit-scrollbar]:hidden"
          >
            <div className="pb-[10px] pt-[10px]">{children}</div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden w-[25%] pl-0 lg:block xl:w-[25%]">
            <RightSidebar />
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
