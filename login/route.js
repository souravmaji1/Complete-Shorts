import { randomBytes } from 'crypto';

export async function GET() {
  const state = randomBytes(16).toString('hex');
  console.log('Generated state:', state); // Debug log
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI);
  const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
  const scope = 'ads_management,pages_show_list,pages_manage_ads,business_management';

  // Set state cookie with unique name
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `fb_oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
  console.log('Setting fb_oauth_state cookie:', state); // Debug log

  const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  console.log('Redirecting to:', authUrl); // Debug log

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl, ...headers },
  });
}