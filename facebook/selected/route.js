import axios from 'axios';

// In-memory storage (replace with a database in production)
let storedSelections = { adAccount: null, page: null };

export async function GET(request) {
  const accessToken = request.headers.get('cookie')?.match(/fb_access_token=([^;]+)/)?.[1];
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let adAccount = null;
    let page = null;

    if (storedSelections.adAccount) {
      const adAccountResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${storedSelections.adAccount.id}`,
        {
          params: { fields: 'id,name', access_token: accessToken },
        }
      );
      adAccount = adAccountResponse.data;
    }

    if (storedSelections.page) {
      const pageResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${storedSelections.page.id}`,
        {
          params: { fields: 'id,name', access_token: accessToken },
        }
      );
      page = pageResponse.data;
    }

    return new Response(JSON.stringify({ adAccount, page }), {
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

export async function POST(request) {
  const accessToken = request.headers.get('cookie')?.match(/fb_access_token=([^;]+)/)?.[1];
  const { adAccountId, pageId } = await request.json();

  if (!accessToken || !adAccountId || !pageId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch ad account details
    const adAccountResponse = await axios.get(
      `https://graph.facebook.com/v20.0/${adAccountId}`,
      {
        params: { fields: 'id,name', access_token: accessToken },
      }
    );

    // Fetch page details
    const pageResponse = await axios.get(`https://graph.facebook.com/v20.0/${pageId}`, {
      params: { fields: 'id,name', access_token: accessToken },
    });

    // Store selections
    storedSelections = {
      adAccount: adAccountResponse.data,
      page: pageResponse.data,
    };

    return new Response(JSON.stringify({ message: 'Selections saved' }), {
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