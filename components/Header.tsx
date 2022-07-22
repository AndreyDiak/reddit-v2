import Image from 'next/image'
import React from 'react'
import {  
  ChevronDownIcon,
  GlobeAltIcon, 
  HomeIcon,
  MenuIcon, 
} from '@heroicons/react/solid'

import {
  BellIcon, 
  ChatIcon,
  PlusIcon, 
  SearchIcon, 
  SparklesIcon, 
  SpeakerphoneIcon, 
  VideoCameraIcon 
} from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

function Header() {

  const { data: session } = useSession()

  return (
    <div className="flex bg-white px-4 py-2 shadow-sm items-center">
      {/* Image */}
      <div className='relative h-10 w-20 cursor-pointer flex-shrink-1'>
        <Link href='/'>
          <Image 
            src="https://links.papareact.com/fqy"
            layout='fill'
            objectFit='contain'
          />
        </Link>
      </div>

      {/* HomeIcon */}
      <div className="flex mx-7 items-center xl:min-w-[300px]">
        <HomeIcon width={20} height={20}/>
        <p className="ml-2 hidden flex-1 lg:inline">Home</p>
        <ChevronDownIcon width={20} height={20} />
      </div>

      {/* Search Input */}
      <form action="" 
        className="flex flex-1 items-center space-x-2 
        bg-gray-100 border-gray-200 px-2 py-1 border rounded-sm" 
      >
        <SearchIcon width={22} height={22} color="gray" />
        <input type="text" placeholder='Search in Reddit' />
        <button type='submit' hidden/>
      </form>

      {/* Icons */}
      <div className="text-gray-500 items-center space-x-2 hidden lg:inline-flex">
        <SparklesIcon className='icon' />
        <GlobeAltIcon className='icon' />
        <VideoCameraIcon className='icon' />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className='icon'/>
        <BellIcon className='icon' />
        <PlusIcon className='icon' />
        <SpeakerphoneIcon className='icon' />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon className='icon'/>
      </div>

      {/* Sign in / Sign out */}
      {session ? (
        <div
          onClick={() => signOut()} 
          className="hidden cursor-pointer items-center space-x-2 border 
        border-gray-100 p-2 lg:flex"
        >
          <div className='w-5 h-5 relative flex-shrink-0'> 
            <Image 
              src="https://links.papareact.com/23l"
              layout='fill'
              alt=''
            />
          </div>

          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">1 Karma</p>
          </div>

          <ChevronDownIcon className='h-4 flex-shrink text-gray-400'/>

      </div>
      ) : (
        <div
          onClick={() => signIn()} 
          className="hidden cursor-pointer items-center space-x-2 border 
        border-gray-100 p-2 lg:flex"
        >
          <div className='w-5 h-5 relative flex-shrink-0'> 
            <Image 
              src="https://links.papareact.com/23l"
              layout='fill'
              alt=''
            />
          </div>
          <p className="text-gray-400">Sign in</p>
        </div>
      )}
    </div>
  )
}

export default Header