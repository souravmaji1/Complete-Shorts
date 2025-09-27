export async function GET(request) {
  const accessToken = request.headers.get('cookie')?.match(/fb_access_token=([^;]+)/)?.[1];
  return new Response(
    JSON.stringify({ isAuthenticated: !!accessToken }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}