import type {
  CommentEntity,
  CreateCommentInput,
  CreatePostInput,
  FeedPost,
  PaginatedPosts,
  PostEntity,
  PostReactionsSummary,
  PostsFilterInput,
  ReactToPostInput,
  ReactionResult,
} from '@/features/post/types/post.graphql.types'
import { GraphQLClientError, graphqlRequest } from '@/lib/graphql'

export type {
  CommentEntity,
  CreateCommentInput,
  CreatePostInput,
  FeedPost,
  PaginatedPosts,
  PostEntity,
  PostReactionsSummary,
  PostsFilterInput,
  ReactToPostInput,
  ReactionResult,
  ReactionType,
  Visibility,
} from '@/features/post/types/post.graphql.types'

export const FEED_POSTS_QUERY_KEY = ['feed-posts'] as const
export const postQueryKey = (postId: string) => ['post', postId] as const

type CreatePostMutationResponse = {
  createPost: PostEntity
}

type GetPostsQueryResponse = {
  posts: PaginatedPosts
}

type GetPostQueryResponse = {
  post: FeedPost
}

type AddCommentMutationResponse = {
  addComment: CommentEntity
}

type ReactToPostMutationResponse = {
  reactToPost: ReactionResult
}

type GetPostReactionCountQueryResponse = {
  postReactionCount: number
}

type GetPostReactionsSummaryQueryResponse = {
  postReactionsSummary: PostReactionsSummary
}

const CREATE_POST_MUTATION = /* GraphQL */ `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      content
      imageUrl
      videoUrl
      visibility
      likeCount
      commentCount
      shareCount
      createdAt
      updatedAt
    }
  }
`

const GET_POSTS_QUERY = /* GraphQL */ `
  query GetPosts($filter: PostsFilterInput) {
    posts(filter: $filter) {
      posts {
        id
        content
        imageUrl
        videoUrl
        visibility
        likeCount
        commentCount
        shareCount
        createdAt
        updatedAt
        author {
          id
          name
          avatar
        }
      }
      meta {
        page
        pageSize
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const GET_POST_QUERY = /* GraphQL */ `
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      content
      imageUrl
      videoUrl
      visibility
      likeCount
      commentCount
      shareCount
      createdAt
      updatedAt
      author {
        id
        name
        avatar
      }
      comments {
        id
        content
        isDeleted
        createdAt
        updatedAt
        author {
          id
          name
          avatar
        }
      }
    }
  }
`

const ADD_COMMENT_MUTATION = /* GraphQL */ `
  mutation AddComment($input: CreateCommentInput!) {
    addComment(input: $input) {
      id
      content
      isDeleted
      createdAt
      updatedAt
      author {
        id
        name
        avatar
      }
    }
  }
`

const REACT_TO_POST_MUTATION = /* GraphQL */ `
  mutation ReactToPost($input: ReactToPostInput!) {
    reactToPost(input: $input) {
      type
      totalLikes
    }
  }
`

const GET_POST_REACTION_COUNT_QUERY = /* GraphQL */ `
  query GetPostReactionCount($postId: ID!) {
    postReactionCount(postId: $postId)
  }
`

const GET_POST_REACTIONS_SUMMARY_QUERY = /* GraphQL */ `
  query GetPostReactionsSummary($postId: ID!) {
    postReactionsSummary(postId: $postId) {
      totalReactions
      totalsByType {
        type
        count
      }
      reactors {
        userId
        name
        avatar
        reactionType
        reactedAt
      }
    }
  }
`

export const postGraphqlService = {
  createPost: async (input: CreatePostInput): Promise<PostEntity> => {
    const data = await graphqlRequest<
      CreatePostMutationResponse,
      { input: CreatePostInput }
    >(CREATE_POST_MUTATION, { input })

    return data.createPost
  },

  getPosts: async (filter?: PostsFilterInput): Promise<PaginatedPosts> => {
    const data = await graphqlRequest<
      GetPostsQueryResponse,
      { filter?: PostsFilterInput }
    >(GET_POSTS_QUERY, { filter })

    return data.posts
  },

  getPostById: async (id: string): Promise<FeedPost> => {
    const data = await graphqlRequest<GetPostQueryResponse, { id: string }>(
      GET_POST_QUERY,
      { id }
    )

    return data.post
  },

  addComment: async (input: CreateCommentInput): Promise<CommentEntity> => {
    const data = await graphqlRequest<
      AddCommentMutationResponse,
      { input: CreateCommentInput }
    >(ADD_COMMENT_MUTATION, { input })

    return data.addComment
  },

  reactToPost: async (input: ReactToPostInput): Promise<ReactionResult> => {
    const data = await graphqlRequest<
      ReactToPostMutationResponse,
      { input: ReactToPostInput }
    >(REACT_TO_POST_MUTATION, { input })

    return data.reactToPost
  },

  getPostReactionCount: async (postId: string): Promise<number> => {
    const data = await graphqlRequest<
      GetPostReactionCountQueryResponse,
      { postId: string }
    >(GET_POST_REACTION_COUNT_QUERY, { postId })

    return data.postReactionCount
  },

  getPostReactionsSummary: async (postId: string): Promise<PostReactionsSummary> => {
    try {
      const data = await graphqlRequest<
        GetPostReactionsSummaryQueryResponse,
        { postId: string }
      >(GET_POST_REACTIONS_SUMMARY_QUERY, { postId })

      return data.postReactionsSummary
    } catch (error) {
      if (error instanceof GraphQLClientError) {
        return {
          totalReactions: 0,
          totalsByType: [],
          reactors: [],
        }
      }
      throw error
    }
  },
}
