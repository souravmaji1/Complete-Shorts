import { NextResponse } from 'next/server';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const action = searchParams.get('action') || 'check';

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  const params = {
    ApiUser: process.env.NAMECHEAP_API_USER,
    ApiKey: process.env.NAMECHEAP_API_KEY,
    Username: process.env.NAMECHEAP_USERNAME,
    ClientIp: process.env.NAMECHEAP_CLIENT_IP,
    Command: action === 'check' ? 'namecheap.domains.check' : 'namecheap.domains.create',
    DomainList: domain,
  };

  if (action === 'buy') {
    params.DomainName = domain;
    params.Years = 1;
    params.RegistrantFirstName = 'Test';
    params.RegistrantLastName = 'User';
    params.RegistrantAddress1 = '123 Test St';
    params.RegistrantCity = 'Test City';
    params.RegistrantStateProvince = 'CA';
    params.RegistrantPostalCode = '12345';
    params.RegistrantCountry = 'US';
    params.RegistrantPhone = '+1.1234567890';
    params.RegistrantEmailAddress = 'test@example.com';
    params.TechFirstName = params.RegistrantFirstName;
    params.TechLastName = params.RegistrantLastName;
    params.TechAddress1 = params.RegistrantAddress1;
    params.TechCity = params.RegistrantCity;
    params.TechStateProvince = params.RegistrantStateProvince;
    params.TechPostalCode = params.RegistrantPostalCode;
    params.TechCountry = params.RegistrantCountry;
    params.TechPhone = params.RegistrantPhone;
    params.TechEmailAddress = params.RegistrantEmailAddress;
    params.AdminFirstName = params.RegistrantFirstName;
    params.AdminLastName = params.RegistrantLastName;
    params.AdminAddress1 = params.RegistrantAddress1;
    params.AdminCity = params.RegistrantCity;
    params.AdminStateProvince = params.RegistrantStateProvince;
    params.AdminPostalCode = params.RegistrantPostalCode;
    params.AdminCountry = params.RegistrantCountry;
    params.AdminPhone = params.RegistrantPhone;
    params.AdminEmailAddress = params.RegistrantEmailAddress;
    params.AuxBillingFirstName = params.RegistrantFirstName;
    params.AuxBillingLastName = params.RegistrantLastName;
    params.AuxBillingAddress1 = params.RegistrantAddress1;
    params.AuxBillingCity = params.RegistrantCity;
    params.AuxBillingStateProvince = params.RegistrantStateProvince;
    params.AuxBillingPostalCode = params.RegistrantPostalCode;
    params.AuxBillingCountry = params.RegistrantCountry;
    params.AuxBillingPhone = params.RegistrantPhone;
    params.AuxBillingEmailAddress = params.RegistrantEmailAddress;
  }

  try {
    const response = await axios.get(process.env.NAMECHEAP_SANDBOX_URL, { params });
    const xml = response.data;

    // Parse XML to JSON
    const parsed = await parseStringPromise(xml, { explicitArray: false });
    const result = parsed.ApiResponse;

    if (result.$.Status === 'ERROR') {
      return NextResponse.json(
        { error: result.Errors.Error._ || 'Unknown error' },
        { status: 400 }
      );
    }

    if (action === 'check') {
      const checkResult = result.CommandResponse.DomainCheckResult.$;
      return NextResponse.json({
        domain: checkResult.Domain,
        available: checkResult.Available === 'true',
        isPremium: checkResult.IsPremiumName === 'true',
      });
    } else {
      // For buy action, return relevant details
      const createResult = result.CommandResponse.DomainCreateResult.$;
      return NextResponse.json({
        domain: createResult.Domain,
        registered: createResult.Registered === 'true',
        orderId: createResult.OrderID,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'API request failed', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}