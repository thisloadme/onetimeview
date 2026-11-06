import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'

const SCRYPT_N = 1 << 14
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 64

function deriveKey(passphrase: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(passphrase, salt, KEY_LENGTH, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P
    }, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(derivedKey)
    })
  })
}

export async function hashOptionalPassphrase(value: unknown): Promise<string | null> {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Passphrase must be text' })
  }

  const passphrase = value.trim()
  if (!passphrase) return null
  if (passphrase.length < 8 || passphrase.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Passphrase must be between 8 and 128 characters' })
  }

  const salt = randomBytes(16)
  const key = await deriveKey(passphrase, salt)
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${key.toString('hex')}`
}

export async function verifyPassphrase(passphrase: string, storedHash: string): Promise<boolean> {
  if (passphrase.length < 8 || passphrase.length > 128) return false

  const [algorithm, n, r, p, saltHex, keyHex, extra] = storedHash.split('$')
  if (algorithm !== 'scrypt' || n !== String(SCRYPT_N) || r !== String(SCRYPT_R) ||
      p !== String(SCRYPT_P) || extra !== undefined || !/^[a-f0-9]{32}$/i.test(saltHex) ||
      !/^[a-f0-9]{128}$/i.test(keyHex)) {
    return false
  }

  const expectedKey = Buffer.from(keyHex, 'hex')
  const actualKey = await deriveKey(passphrase, Buffer.from(saltHex, 'hex'))
  return timingSafeEqual(actualKey, expectedKey)
}
