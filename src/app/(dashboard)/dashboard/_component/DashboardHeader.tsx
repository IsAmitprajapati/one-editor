'use client'
import Logo from '@/components/Logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SidebarTrigger, SidebarTriggerDashboard } from '@/components/ui/sidebar'
import UserAvatar from '@/components/UserAvatar'
import { getAvatarName } from '@/lib/getAvatarName'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const DashboardHeader = () => {
  const session = useSession()
  console.log("session ",session)

  return (
    <div
        className='h-14 bg-white flex items-center px-4 sticky top-0 z-40'
    >
      <div className='md:hidden'>
        <Logo w={80}/>
      </div>

      <div className='hidden md:block'>
        <span className='font-semibold'>Hii Welcome</span> {session.data?.user.name}
      </div>

      <div className='ml-auto hidden md:block'>
          <UserAvatar/>
          {/* <Popover>
            <PopoverTrigger>
                <Avatar className='w-10 h-10 drop-shadow cursor-pointer' >
                    <AvatarImage src={session.data?.user?.image as string}/>
                    <AvatarFallback>{getAvatarName(session.data?.user.name as string)}</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent>
              <p className='font-semibold py-2'>{session.data?.user?.name}</p>
              <div className='p-[0.5px] bg-gray-200'></div>

              <Button variant={'destructive'} className='w-full mt-4 cursor-pointer' onClick={()=>signOut()}>Logout</Button>
            </PopoverContent>
          </Popover> */}
      </div>

      <div className='md:hidden ml-auto'>
        <SidebarTriggerDashboard/>
      </div>

    </div>
  )
}

export default DashboardHeader
