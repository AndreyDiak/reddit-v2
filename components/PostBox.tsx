import { LinkIcon, PhotographIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar';
import { get, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations';
import client from '../apollo-client'
import { GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';

interface FormData {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

function PostBox() {

  const { data: session } = useSession();
  const [ addPost ] = useMutation(ADD_POST);
  const [ addSubreddit ] = useMutation(ADD_SUBREDDIT);
  const [ imageBoxOpen, setImageBoxOpen ] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    
    const notification = toast.loading('Creating new post...');

    try {

      const { data: { getSubredditListByTopic } } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: formData.subreddit
        }
      })

      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        // create subreddit...
        console.log('Subbreddit is new -> create a NEW subreddit!');

        const { data : { insertSubreddit: newSubreddit } } = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        })
        console.log(newSubreddit);
        console.log('New subreddit created!', newSubreddit);

        const image = formData.postImage || '';

        const {data: { insertPost: newPost }} = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

        console.log('New post added to the DB: ', newPost);

      } else {
        // use existings subreddit...
        console.log('Using existing subreddit');
        
        const image = formData.postImage || '';

        const { data: { insertPost: newPost}} = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })
        console.log('New post added to the DB: ', newPost);
      }

      setValue('postBody', '');
      setValue('postImage', '');
      setValue('postImage', '');
      setValue('postTitle', '');

      toast.success('New Post Created!', {
        id: notification,
      })

    } catch(err) {
      console.log(err);
      toast.error("Whoops something went wrong", {
        id: notification,
      })
    }
  })

  return (
    <form
      onSubmit={onSubmit} 
      action="" 
      className='sticky-0 z-50 top-16 border 
      border-gray-300 bg-white p-2'
    >
      <div className='flex items-center space-x-3'>

        <Avatar />

        <input
          {...register('postTitle', {required: true, maxLength: 20})} 
          type="text"
          disabled={!session}
          placeholder={
            session ? 'Create a post by entering a title!' : 'Sign in to post!'
          } 
          className='bg-gray-50 p-2 pl-5 outline-none flex-1 rounded-md'
        />
        <PhotographIcon onClick={() => setImageBoxOpen(!imageBoxOpen)} className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && 'text-blue-300'
          }`} 
        />
        <LinkIcon className='h-6 text-gray-300' />
      </div>
      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              {...register('postBody')}
              className='m-2 flex-1 bg-blue-50 p-2 outline-none' 
              type="text" 
              placeholder='Text (optional)' />
          </div>
          {/* Subreddit */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Subreddit:</p>
            <input
              {...register('subreddit')}
              className='m-2 flex-1 bg-blue-50 p-2 outline-none' 
              type="text" 
              placeholder='i.e. reactjs' />
          </div>
          {/* Image */}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
            <p className="min-w-[90px]">Image URL:</p>
            <input
              {...register('postImage')}
              className='m-2 flex-1 bg-blue-50 p-2 outline-none' 
              type="text" 
              placeholder='Optional...' />
          </div>
          )}
        </div>
      )}
      {/* Errors */}
      {Object.keys(errors).length > 0 && (
        <div className='space-y-2 p-2 text-red-500'>
          {errors.postTitle?.type === 'required' && (
            <p>- A post title is required!</p>
          )}
        </div>
      )}
      {!!watch('postTitle') && (
        <button type="submit" className="w-full rounded-full bg-blue-400 text-white p-2">
          Create Post
        </button>
      )}
    </form>
  )
}

export default PostBox