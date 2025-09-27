'use client';

import { useState } from 'react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [subaccount, setSubaccount] = useState({ username: '', email: '', password: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate domain format (e.g., example.com)
  const isValidDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  };

  // Validate subaccount inputs
  const isValidSubaccount = ({ username, email, password }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
    const passwordRegex = /^.{6,}$/;
    return (
      usernameRegex.test(username) &&
      emailRegex.test(email) &&
      passwordRegex.test(password)
    );
  };

  const handleDomainAction = async (action) => {
    setResult(null);
    setError(null);

    if (!domain) {
      setError('Please enter a domain');
      return;
    }
    if (!isValidDomain(domain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/domain?domain=${encodeURIComponent(domain)}&action=${action}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubaccountCreation = async () => {
    setResult(null);
    setError(null);

    if (!subaccount.username || !subaccount.email || !subaccount.password) {
      setError('Please fill in all subaccount fields');
      return;
    }
    if (!isValidSubaccount(subaccount)) {
      setError('Invalid subaccount details. Username (3-30 chars), valid email, and password (6+ chars) required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/subaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subaccount),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to create subaccount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Namecheap Sandbox Domain Tester</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Domain Operations</h2>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value.trim())}
          placeholder="Enter domain (e.g., example.com)"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex space-x-4">
          <button
            onClick={() => handleDomainAction('check')}
            disabled={loading || !domain}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Checking...' : 'Check Availability'}
          </button>
          <button
            onClick={() => handleDomainAction('buy')}
            disabled={loading || !domain}
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Simulate Purchase'}
          </button>
        </div>
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Subaccount</h2>
        <input
          type="text"
          value={subaccount.username}
          onChange={(e) => setSubaccount({ ...subaccount, username: e.target.value.trim() })}
          placeholder="Enter username (3-30 characters)"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          value={subaccount.email}
          onChange={(e) => setSubaccount({ ...subaccount, email: e.target.value.trim() })}
          placeholder="Enter email"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={subaccount.password}
          onChange={(e) => setSubaccount({ ...subaccount, password: e.target.value })}
          placeholder="Enter password (6+ characters)"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleSubaccountCreation}
          disabled={loading || !subaccount.username || !subaccount.email || !subaccount.password}
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Subaccount'}
        </button>
      </div>
      {result && (
        <div className="w-full max-w-md mt-6 p-4 bg-gray-100 rounded">
          {result.available !== undefined ? (
            <p className={result.available ? 'text-green-600' : 'text-red-600'}>
              {result.domain} is {result.available ? 'available' : 'not available'}.
              {result.isPremium && ' (Premium Domain)'}
            </p>
          ) : result.created !== undefined ? (
            <p className={result.created ? 'text-green-600' : 'text-red-600'}>
              {result.created
                ? `Subaccount ${result.username} created successfully. Customer ID: ${result.customerId}`
                : `Failed to create subaccount ${result.username}.`}
            </p>
          ) : (
            <p className={result.registered ? 'text-green-600' : 'text-red-600'}>
              {result.registered
                ? `Successfully simulated purchase of ${result.domain}. Order ID: ${result.orderId}`
                : `Failed to simulate purchase of ${result.domain}.`}
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="w-full max-w-md mt-4 text-red-500">{error}</p>
      )}
    </div>
  );
}