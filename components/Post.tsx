import { useMutation, useQuery } from '@apollo/client'
import { ArrowDownIcon, ArrowUpIcon, ChatAltIcon, DotsHorizontalIcon, GiftIcon, SaveIcon, ShareIcon } from '@heroicons/react/outline'
import { Jelly } from '@uiball/loaders'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ADD_VOTE } from '../graphql/mutations'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import Avatar from './Avatar'

type Props = {
  post: Post
}

function Post( { post } : Props) {

  const {data: session} = useSession();
  const [vote, setVote] = useState<boolean>();

  const {data, loading} = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    }
  })

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesByPostId']
  })

  const upVote = async (isUpVote: boolean) => {
    if (!session) {
      toast("! You'll need to sign in to Vote!")
      return;
    }

    if (vote && isUpVote) return;
    if (vote === false && !isUpVote) return;

    console.log('voting...', vote);

    const {data: {insertVote} } = await addVote({
      variables: {
        post_id: post.id,
        username: session.user?.name,
        upvote: isUpVote
      }
    })

  } 

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;
    
    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
      )?.upvote;

    setVote(vote);

  }, [data])

  const displayVotes = () => {
    const votes: Vote[] = data?.getVotesByPostId;

    if (votes?.length === 0) return 0;

    const dispayedNumber = votes?.reduce(
      (acc, vote) => vote.upvote ? acc + 1 : acc - 1, 0
    )

    if (dispayedNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }

    return dispayedNumber;
    
  }

  if (!post) return (
    <div className="flex w-full items-center justify-center p-10 text-xl">
      <Jelly size={50} color="#ff4501" />
    </div>
  )

  return (
    <Link href={`/post/${post.id}`}>
      <div className='rounded-md flex cursor-pointer border border-gray-300
    bg-white shadow-sm hover:border hover:border-gray-600 w-full'>
      {/* Votes */}
      <div 
        className="flex-col items-center justify-start 
        space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400"
      >
        <ArrowUpIcon 
          onClick={() => upVote(true)} 
          className={`voteButton hover:text-red-400 ${vote && 'text-red-400'}`}
        />
        <p className="text-xs font-bold text-black text-center">
          {displayVotes()}
        </p>
        <ArrowDownIcon 
          onClick={() => upVote(false)} 
          className={`voteButton hover:text-blue-400 ${vote === false && 'text-blue-400'}`}
        />
      </div>
      <div className="p-3 pb-1">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Avatar seed={post.subreddit[0].topic} />
          <p className="text-xs text-gray-400">
            <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
              <span className="font-bold text-black hover:text-blue-400 hover:underline">
                r/{post.subreddit[0]?.topic}
              </span>
            </Link>
             - 
            Posted by u/{post.username}
            {moment(post.created_at).fromNow()}
          </p>
        </div>
        {/* Body */}
        <div className="py-4">
          <h2 className='text-xl font-semibold'>{post.title}</h2>
          <p className="mt-2 text-sm font-light">{post.body}</p>
        </div>
        {/* Image */}
        {/* <img src= alt="" /> */}
        {/* Footer */}
        <div className="flex space-x-4 text-gray-400">
          <div className="postButton">
            <ChatAltIcon className="h-6 w-6" />
            <p className="">{post.comments.length} Comments</p>
          </div>
          <div className="postButton">
            <GiftIcon className="h-6 w-6" />
            <p className="hidden sm:inline">Award</p>
          </div>
          <div className="postButton">
            <ShareIcon className="h-6 w-6" />
            <p className="hidden sm:inline">Share</p>
          </div>
          <div className="postButton">
            <SaveIcon className="h-6 w-6" />
            <p className="hidden sm:inline">Save</p>
          </div>
          <div className="postButton">
            <DotsHorizontalIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default Post