// Cloudflare Pages Function: /api/admin/logout
// Clears the secure session cookie on the server

export async function onRequestPost() {
  const expiredCookie = 'shoporbit_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
  return new Response(JSON.stringify({
    success: true,
    message: 'Logged out successfully'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': expiredCookie
    }
  })
}
