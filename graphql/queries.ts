import { gql } from '@apollo/client';

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      created_at
      id
      topic
    }
}
`
export const GET_POST_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostListById(post_id: $post_id) {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
      comments {
        username
        text
        id
        created_at
        post_id
      }
      subreddit {
        topic
        id
        created_at
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`
export const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      created_at
      id
      post_id
      username
      upvote
    }
  }
`
export const GET_SUBREDDIT_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getSubredditWithLimit(limit: $limit) {
      created_at
      id
      topic
    }
  }
`
export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
      comments {
        username
        text
        id
        created_at
        post_id
      }
      subreddit {
        topic
        id
        created_at
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
}
`
export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
      comments {
        username
        text
        id
        created_at
        post_id
      }
      subreddit {
        topic
        id
        created_at
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`