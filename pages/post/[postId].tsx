import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import React from 'react'
import { GET_ALL_POSTS, GET_POST_BY_POST_ID } from '../../graphql/queries';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import client from '../../apollo-client';
import Post from '../../components/Post';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ADD_COMMENT } from '../../graphql/mutations';
import toast from 'react-hot-toast';
import Avatar from '../../components/Avatar';
import moment from 'moment';

type Props = {
  postData: Post
}

type FormData = {
  comment: string
}

function PostPage () {

  const router = useRouter();
  const {data: session} = useSession();
  const [ addComment ] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      GET_POST_BY_POST_ID, 'getPostListById'
    ]
  })
  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      post_id: router.query.postId
    }
  })

  const post: Post = data?.getPostListById

  // console.log(postData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async ({ comment }) => {
    const notification = toast.loading('Posting your comment...');
    
    try {
      const { data } = await addComment({
        variables: {
          post_id: router.query.postId,
          username: session?.user?.name,
          text: comment
        }
      })
  

      toast.success('Success', {
        id: notification
      })
  
    } catch (err) {
      toast.error('Whoops, error!', {
        id: notification
      })
    }
    setValue('comment', '')
  }

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />

      <div className="rounded-md border border-gray-300 bg-white p-5 mt-2 pl-16 z-50">
        <p className="text-sm">
          Comment as 
          <span className="text-red-500">
            {` `}{session?.user?.name}
          </span>
        </p>

        <form action="" className="flex flex-col space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register('comment')} 
            className="h-24 rounded-md border border-gray-300 outline-none disabled:bg-gray-50 p-2 pl-4"
            disabled={!session}
            placeholder={
              session ? 'Send me comment below!' : 'Please login in to comment!'
            }
          >
          </textarea>
          <button 
            type='submit'
            disabled={!session}
            className="rounded-full bg-red-500 text-white font-semibold p-3 disabled:bg-gray-200"
            >
            Comment
          </button>
        </form>
      </div>

      <div className="-mt-5 rounded-b-md border border-t-0 border-gray-300
      bg-white py-5 px-10">
        {post?.comments.map(comment => (
          <div className="flex relative items-center space-x-2 space-y-4" key={comment.id}>
            <hr className="absolute top-12 h-24 border left-7 " />
            <div className="">
              <Avatar seed={comment.username} />
            </div>
            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">
                  {comment.username}
                </span>{` `}
                {moment(comment.created_at).fromNow()}
              </p>
              <p className="">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default PostPage

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { data, error } = await client.query({
//         query: GET_POST_BY_POST_ID,
//         variables: {
//           post_id: params?.postId
//         }
//       })

//   console.log(data);

//   return {
//     props: {
//       post: await data?.getPostListById
//     }
//   }
// }

// export async function getStaticPaths()  {

//   const {data : {getPostList: posts}} = await client.query({
//     query: GET_ALL_POSTS
//   });


//   return { 
//     paths: posts.map((post: Post) => ({
//       params: {
//         postId: post.id
//       }
//     })),
//     fallback: false
//   }
// }

// export async function getStaticProps({ params } : any) {

//   const { data, error } = await client.query({
//     query: GET_POST_BY_POST_ID,
//     variables: {
//       post_id: params?.postId
//     }
//   })
  
//   const postData: Post[] = data?.getPostListById

//   return {
//     props: {
//       postData
//     }
//   }
// }
