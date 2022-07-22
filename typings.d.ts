interface Comment {
  created_at: string
  id: number
  post_id: number
  text: string
  username: string
}

interface Vote {
  created_at: string
  id: number
  post_id: ID
  upvote: boolean
  username: string
}

interface Subreddit {
  created_at: string
  id: number
  topic: string
}

interface Post {
  body: string
  created_at: string
  id: number
  image: string
  subreddit_id: number
  title: string
  username: string
  votes: Vote[]
  comments: Comment[]
  subreddit: Subreddit[] 
}