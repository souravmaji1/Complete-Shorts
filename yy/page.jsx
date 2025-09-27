'use client';

import { useState } from 'react';

export default function DomainsPage() {
  const [domain, setDomain] = useState('');
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState({
    registrant: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    admin: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    tech: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    billing: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });

  const handleCheck = async () => {
    setError(null);
    setAvailability(null);
    try {
      const res = await fetch('/api/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', domain }),
      });
      const data = await res.json();
      if (res.ok && data.results?.[0]) {
        setAvailability(data.results[0]);
      } else {
        setError(data.error || 'No availability data');
      }
    } catch (error) {
      setError('Failed to check availability');
    }
  };

  const handleBuy = async () => {
    setError(null);
    try {
      const res = await fetch('/api/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'buy', domain, years: 1, contacts, enablePrivacy: true }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Domain purchased successfully in sandbox!');
      } else {
        setError(data.error || 'Failed to purchase domain');
      }
    } catch (error) {
      setError('Failed to purchase domain');
    }
  };

  return (
    <div>
      <h1>Domain Checker and Buyer</h1>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="example.com"
      />
      <button onClick={handleCheck}>Check Availability</button>
      {availability && (
        <div>
          <p>Available: {availability.purchasable ? 'true' : 'false'}</p>
          {availability.purchasable && (
            <>
              <p>Price: ${availability.purchasePrice}</p>
              {/* Simple contact form */}
              <input
                placeholder="First Name"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, firstName: e.target.value },
                    admin: { ...contacts.admin, firstName: e.target.value },
                    tech: { ...contacts.tech, firstName: e.target.value },
                    billing: { ...contacts.billing, firstName: e.target.value },
                  })
                }
              />
              <input
                placeholder="Last Name"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, lastName: e.target.value },
                    admin: { ...contacts.admin, lastName: e.target.value },
                    tech: { ...contacts.tech, lastName: e.target.value },
                    billing: { ...contacts.billing, lastName: e.target.value },
                  })
                }
              />
              <input
                placeholder="Email"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, email: e.target.value },
                    admin: { ...contacts.admin, email: e.target.value },
                    tech: { ...contacts.tech, email: e.target.value },
                    billing: { ...contacts.billing, email: e.target.value },
                  })
                }
              />
              <input
                placeholder="Phone"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, phone: e.target.value },
                    admin: { ...contacts.admin, phone: e.target.value },
                    tech: { ...contacts.tech, phone: e.target.value },
                    billing: { ...contacts.billing, phone: e.target.value },
                  })
                }
              />
              <input
                placeholder="Address"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, address1: e.target.value },
                    admin: { ...contacts.admin, address1: e.target.value },
                    tech: { ...contacts.tech, address1: e.target.value },
                    billing: { ...contacts.billing, address1: e.target.value },
                  })
                }
              />
              <input
                placeholder="City"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, city: e.target.value },
                    admin: { ...contacts.admin, city: e.target.value },
                    tech: { ...contacts.tech, city: e.target.value },
                    billing: { ...contacts.billing, city: e.target.value },
                  })
                }
              />
              <input
                placeholder="State"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, state: e.target.value },
                    admin: { ...contacts.admin, state: e.target.value },
                    tech: { ...contacts.tech, state: e.target.value },
                    billing: { ...contacts.billing, state: e.target.value },
                  })
                }
              />
              <input
                placeholder="Zip"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, zip: e.target.value },
                    admin: { ...contacts.admin, zip: e.target.value },
                    tech: { ...contacts.tech, zip: e.target.value },
                    billing: { ...contacts.billing, zip: e.target.value },
                  })
                }
              />
              <input
                placeholder="Country"
                onChange={(e) =>
                  setContacts({
                    ...contacts,
                    registrant: { ...contacts.registrant, country: e.target.value },
                    admin: { ...contacts.admin, country: e.target.value },
                    tech: { ...contacts.tech, country: e.target.value },
                    billing: { ...contacts.billing, country: e.target.value },
                  })
                }
              />
              <button onClick={handleBuy}>Buy Domain</button>
            </>
          )}
        </div>
      )}
      {error && <p>Error: {JSON.stringify(error)}</p>}
    </div>
  );
}