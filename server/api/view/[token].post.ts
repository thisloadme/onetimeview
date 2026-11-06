import { loadSharedLinkView } from '~/server/utils/sharedLinkView'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token is required' })
  }

  const body = await readBody(event)
  return loadSharedLinkView(event, token, {
    requirePassphrase: true,
    passphrase: body?.passphrase
  })
})
