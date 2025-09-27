import { NextResponse } from 'next/server';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const params = {
      ApiUser: process.env.NAMECHEAP_API_USER,
      ApiKey: process.env.NAMECHEAP_API_KEY,
      Username: process.env.NAMECHEAP_USERNAME,
      ClientIp: process.env.NAMECHEAP_CLIENT_IP,
      Command: 'namecheap.users.create',
      NewUserName: username,
      NewUserPassword: password,
      EmailAddress: email,
      AcceptTerms: 1, // Required parameter to accept Namecheap's terms
      // Minimal required fields for Sandbox (not strictly validated)
      FirstName: 'Sourav',
      LastName: 'Maji',
      Address1: 'Dhirenpara bhupen hazrika path',
      City: 'Guwahati',
      StateProvince: 'AS',
      PostalCode: '781025',
      Country: 'IN',
      Phone: '+91.9101462476',
    };

   

    const response = await axios.get(process.env.NAMECHEAP_SANDBOX_URL, { params });
    const xml = response.data;

    // Log the raw XML response
    console.log('API Response XML:', xml);

    // Parse XML to JSON
    const parsed = await parseStringPromise(xml, { explicitArray: false });
    const result = parsed.ApiResponse;

    if (result.$.Status === 'ERROR') {
      return NextResponse.json(
        { error: result.Errors.Error._ || 'Unknown error' },
        { status: 400 }
      );
    }

    const createResult = result.CommandResponse.UserCreateResult.$;
    return NextResponse.json({
      username: username, // Use input username since UserName is not in response
      created: createResult.Success === 'true',
      customerId: createResult.UserId, // Use UserId instead of CustomerID
    });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'API request failed', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}