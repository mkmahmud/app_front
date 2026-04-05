import { graphqlRequest } from '@/lib/graphql'

export type Visibility = 'PUBLIC' | 'PRIVATE'

type CreatePostInput = {
  content?: string
  imageUrl?: string
  videoUrl?: string
  visibility?: Visibility
}

export type PostEntity = {
  id: string
  content?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  visibility: Visibility
  likeCount: number
  commentCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
}

type CreatePostMutationResponse = {
  createPost: PostEntity
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

export const postGraphqlService = {
  createPost: async (input: CreatePostInput): Promise<PostEntity> => {
    const data = await graphqlRequest<
      CreatePostMutationResponse,
      { input: CreatePostInput }
    >(CREATE_POST_MUTATION, { input })

    return data.createPost
  },
}
