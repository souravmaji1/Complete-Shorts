export async function POST() {
  const headers = new Headers();
  headers.append('Set-Cookie', 'fb_access_token=; HttpOnly; Path=/; Max-Age=0');

  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}