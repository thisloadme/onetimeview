import { createHmac } from 'node:crypto'
import { DocumentAccessModel } from '~/server/models/DocumentAccess'
import { DocumentModel } from '~/server/models/Document'
import { SharedLinkPassphraseAttemptModel } from '~/server/models/SharedLinkPassphraseAttempt'
import { SharedLinkModel } from '~/server/models/SharedLink'
import { verifyPassphrase } from '~/server/utils/passphrase'

export async function loadSharedLinkView(
  event: any,
  token: string,
  options: { requirePassphrase?: boolean; passphrase?: unknown } = {}
) {
  const sharedLink = await SharedLinkModel.findActiveByToken(token)

  if (!sharedLink) {
    throw createError({ statusCode: 404, statusMessage: 'Link not found or expired' })
  }

  if (sharedLink.current_accesses >= sharedLink.max_accesses) {
    throw createError({ statusCode: 403, statusMessage: 'Maximum access limit reached' })
  }

  if (sharedLink.passphrase_hash) {
    if (!options.requirePassphrase) return { requiresPassphrase: true as const }

    const clientIP = getRequestIP(event) || 'unknown'
    const config = useRuntimeConfig()
    const ipHash = createHmac('sha256', config.jwtSecret)
      .update(`${sharedLink.id}:${clientIP}`)
      .digest('hex')
    const passphrase = typeof options.passphrase === 'string' ? options.passphrase.trim() : ''
    const reservation = await SharedLinkPassphraseAttemptModel.reserve(sharedLink.id, ipHash)

    if (!reservation.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: `Too many passphrase attempts. Try again in ${reservation.retryAfter} seconds.`
      })
    }

    let valid: boolean
    try {
      valid = await verifyPassphrase(passphrase, sharedLink.passphrase_hash)
    } catch (error) {
      await SharedLinkPassphraseAttemptModel.recordResult(
        sharedLink.id,
        ipHash,
        reservation.windowStartedAt,
        true
      )
      throw error
    }

    const recorded = await SharedLinkPassphraseAttemptModel.recordResult(
      sharedLink.id,
      ipHash,
      reservation.windowStartedAt,
      valid
    )
    if (!recorded) {
      throw createError({ statusCode: 429, statusMessage: 'Passphrase check expired. Try again.' })
    }
    if (!valid) {
      throw createError({ statusCode: 401, statusMessage: 'Incorrect passphrase' })
    }
  } else if (options.requirePassphrase) {
    throw createError({ statusCode: 400, statusMessage: 'This link does not require a passphrase' })
  }

  const document = await DocumentModel.findById(sharedLink.document_id)
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  const incremented = await SharedLinkModel.incrementAccessIfAvailable(sharedLink.id, sharedLink.max_accesses)
  if (!incremented) {
    throw createError({ statusCode: 403, statusMessage: 'This link is no longer active' })
  }

  await DocumentModel.incrementViews(sharedLink.document_id)

  const clientIP = getRequestIP(event) || 'unknown'
  const userAgent = getHeader(event, 'user-agent') || 'unknown'
  await DocumentAccessModel.create({
    document_id: document.id,
    shared_link_id: sharedLink.id,
    ip_address: clientIP,
    user_agent: userAgent,
    access_type: 'shared_link'
  })

  const updatedLink = await SharedLinkModel.findByToken(token)
  const currentAccesses = updatedLink?.current_accesses ?? sharedLink.current_accesses + 1

  return {
    document: { title: document.title, content: document.content },
    accessInfo: {
      currentAccesses,
      maxAccesses: sharedLink.max_accesses,
      remainingAccesses: Math.max(0, sharedLink.max_accesses - currentAccesses)
    }
  }
}
