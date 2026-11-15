// Cloudflare Pages Function: /api/admin/verify
// Verifies session cookie authenticity on the server

function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=')
    if (name) cookies[name] = rest.join('=')
  })
  return cookies
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

export async function onRequestGet(context) {
  try {
    const { request, env } = context
    const cookieHeader = request.headers.get('Cookie') || ''
    const cookies = parseCookies(cookieHeader)
    const token = cookies.shoporbit_session

    if (!token || !token.includes('.')) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const [payloadBase64, providedSignature] = token.split('.')
    const storedHash = (env.ADMIN_PASSWORD_HASH || '').trim().toLowerCase()
    const storedRaw = (env.ADMIN_PASSWORD || '').trim()
    const sessionSecret = env.SESSION_SECRET || storedHash || storedRaw || 'shoporbit-secret-salt-2026'

    const expectedSignature = await createHmacSignature(payloadBase64, sessionSecret)
    if (!timingSafeEqual(providedSignature, expectedSignature)) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const payload = JSON.parse(atob(payloadBase64))
    if (!payload.exp || Date.now() > payload.exp) {
      return new Response(JSON.stringify({ authenticated: false, expired: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      authenticated: true,
      role: payload.role
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
