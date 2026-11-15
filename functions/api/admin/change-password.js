// Cloudflare Pages Function: /api/admin/change-password
// Verifies current credentials and generates the new cryptographic password hash

function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=')
    if (name) cookies[name] = rest.join('=')
  })
  return cookies
}

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
    const cookieHeader = request.headers.get('Cookie') || ''
    const cookies = parseCookies(cookieHeader)
    const token = cookies.shoporbit_session

    const storedHash = (env.ADMIN_PASSWORD_HASH || '').trim().toLowerCase()
    const storedRaw = (env.ADMIN_PASSWORD || '').trim()
    const sessionSecret = env.SESSION_SECRET || storedHash || storedRaw || 'shoporbit-secret-salt-2026'

    // 1. Verify session
    if (!token || !token.includes('.')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized. Please log in first.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const [payloadBase64, providedSignature] = token.split('.')
    const expectedSignature = await createHmacSignature(payloadBase64, sessionSecret)

    if (!timingSafeEqual(providedSignature, expectedSignature)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session invalid or tampered with.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const payload = JSON.parse(atob(payloadBase64))
    if (!payload.exp || Date.now() > payload.exp) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session expired. Please log in again.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 2. Parse body
    const body = await request.json().catch(() => ({}))
    const currentPassword = (body.currentPassword || '').trim()
    const newPassword = (body.newPassword || '').trim()

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Both current password and new password are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (newPassword.length < 8) {
      return new Response(JSON.stringify({
        success: false,
        error: 'New password must be at least 8 characters long'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 3. Verify current password
    const currentHash = (await hashString(currentPassword)).toLowerCase()
    let isCurrentValid = false

    if (storedHash) {
      isCurrentValid = timingSafeEqual(currentHash, storedHash)
    } else if (storedRaw) {
      const storedRawHash = (await hashString(storedRaw)).toLowerCase()
      isCurrentValid = timingSafeEqual(currentHash, storedRawHash)
    }

    if (!isCurrentValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Current password does not match'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 4. Compute new hash
    const newHash = await hashString(newPassword)

    return new Response(JSON.stringify({
      success: true,
      message: 'Password verified and new cryptographic hash generated successfully.',
      newHash: newHash,
      instructions: 'Update the ADMIN_PASSWORD_HASH secret in your Cloudflare Pages dashboard under Settings > Environment variables > Production to complete the change.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Password change failed due to a server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
