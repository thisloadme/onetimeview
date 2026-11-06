import { loadSharedLinkView } from '~/server/utils/sharedLinkView'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token is required' })
  }

  return loadSharedLinkView(event, token)
})
