import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDIT_WITH_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {

  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10,
    }
  })


  console.log(data);

  const subreddits: Subreddit[] = data?.getSubredditWithLimit;

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit v2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    {/* PostBox */}
    <PostBox />
    
    <div className="flex space-x-5">
      <Feed />

      <div 
        className="sticky top-36 mt-5 hidden h-fit min-w-[300px] rounded-md
        border border-gray-300 bg-white lg:inline"
      >
        <p className="my-2 pl-2 font-bold">Top Communities</p>
        <div className="">
          {/* List subreddits... */}
          {subreddits?.map((subreddit, i) => (
            <SubredditRow 
              key={i} 
              index={i} 
              topic={subreddit.topic} 
            />
          ))}
        </div>
      </div>

    </div>

    </div>
  )
}

export default Home

// Transformer2002Andreyd2002.