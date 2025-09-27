import axios from 'axios';

export async function GET(request) {
  const accessToken = request.headers.get('cookie')?.match(/fb_access_token=([^;]+)/)?.[1];
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios.get('https://graph.facebook.com/v20.0/me/accounts', {
      params: { fields: 'id,name', access_token: accessToken },
    });
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}