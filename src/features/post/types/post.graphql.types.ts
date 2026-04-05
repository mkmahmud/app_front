export type Visibility = 'PUBLIC' | 'PRIVATE'
export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY'

export type CreatePostInput = {
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

export type PostAuthor = {
  id: string
  name: string
  avatar?: string | null
}

export type CommentEntity = {
  id: string
  content?: string | null
  isDeleted: boolean
  author: PostAuthor
  createdAt: string
  updatedAt: string
}

export type FeedPost = PostEntity & {
  author: PostAuthor
  comments?: CommentEntity[]
}

export type PostsMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type PaginatedPosts = {
  posts: FeedPost[]
  meta: PostsMeta
}

export type PostsFilterInput = {
  page?: number
  pageSize?: number
  authorId?: string
  visibility?: Visibility
}

export type CreateCommentInput = {
  postId: string
  content: string
}

export type ReactToPostInput = {
  postId: string
  type: ReactionType
}

export type ReactionResult = {
  type: ReactionType
  totalLikes: number
}

export type PostReactionUser = {
  userId: string
  name: string
  avatar?: string | null
  reactionType: ReactionType
  reactedAt: string
}

export type ReactionTypeCount = {
  type: ReactionType
  count: number
}

export type PostReactionsSummary = {
  totalReactions: number
  totalsByType: ReactionTypeCount[]
  reactors: PostReactionUser[]
}
