import { APP_CONFIG } from '@/config/constants'
import { apiClient } from '@/lib/api'

type GraphQLErrorItem = {
  message: string
  path?: Array<string | number>
  extensions?: Record<string, unknown>
}

type GraphQLResponse<TData> = {
  data?: TData
  errors?: GraphQLErrorItem[]
}

export class GraphQLClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: GraphQLErrorItem[]
  ) {
    super(message)
    this.name = 'GraphQLClientError'
  }
}

export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const response = await apiClient.post<GraphQLResponse<TData>>(
    APP_CONFIG.api.graphqlUrl,
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    }
  )

  const payload = response.data

  if (payload.errors?.length) {
    throw new GraphQLClientError(
      payload.errors[0]?.message || 'GraphQL execution failed.',
      response.status,
      payload.errors
    )
  }

  if (!payload.data) {
    throw new GraphQLClientError('No data returned from GraphQL server.', response.status)
  }

  return payload.data
}
