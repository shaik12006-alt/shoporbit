// Cloudflare Pages Function: /api/admin/login
// Server-side admin authentication with cryptographic hashing & secure HTTP-only cookies

async function hashString(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

async function createHmacSignature(message, secret) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context
    const body = await request.json().catch(() => ({}))
    const submittedPassword = (body.password || '').trim()

    if (!submittedPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Password is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Retrieve configured secret from Cloudflare Environment Secrets
    // Recommended: ADMIN_PASSWORD_HASH (SHA-256 hex string)
    // Optional: ADMIN_PASSWORD (raw password stored as encrypted secret)
    const storedHash = (env.ADMIN_PASSWORD_HASH || '').trim().toLowerCase()
    const storedRaw = (env.ADMIN_PASSWORD || '').trim()

    if (!storedHash && !storedRaw) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Admin authentication is not configured yet. Please configure ADMIN_PASSWORD_HASH in Cloudflare Pages Secrets.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Hash submitted password
    const submittedHash = (await hashString(submittedPassword)).toLowerCase()

    let isValid = false
    if (storedHash) {
      isValid = timingSafeEqual(submittedHash, storedHash)
    } else if (storedRaw) {
      const storedRawHash = (await hashString(storedRaw)).toLowerCase()
      isValid = timingSafeEqual(submittedHash, storedRawHash)
    }

    if (!isValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid admin credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate signed session token: Base64(payload).signature
    const sessionSecret = env.SESSION_SECRET || storedHash || storedRaw || 'shoporbit-secret-salt-2026'
    const payload = JSON.stringify({
      role: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })
    const payloadBase64 = btoa(payload)
    const signature = await createHmacSignature(payloadBase64, sessionSecret)
    const token = `${payloadBase64}.${signature}`

    // Set secure, HTTP-only cookie
    const cookieHeader = `shoporbit_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin authenticated successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Authentication failed due to server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
