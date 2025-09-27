import { NextResponse } from 'next/server';

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer. Generate a complete Next.js 14 landing page code (JSX, CSS, and JS) based on the user\'s prompt. Return a valid JSON object with keys: `jsx`, `css`, `js`. The `jsx` field must be a string with escaped newlines (\\n) and quotes (\\"). Use Tailwind CSS for styling. Ensure the code is functional for Next.js 14 App Router. Example: {"jsx":"export default function LandingPage() {\\n  return <div className=\\\"bg-blue-500\\\">Hello</div>;\\n}","css":".custom { margin: 0; }","js":""}',
          },
          {
            role: 'user',
            content: `Generate a Next.js landing page for: ${prompt}`,
          },
        ],
        model: 'gemma2-9b-it',
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    console.log('Raw Groq response:', content);

    // Clean the response by removing Markdown code fences and extra whitespace
    content = content
      .replace(/```json\s*|\s*```/g, '') // Remove ```json and ```
      .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
      .replace(/(\r\n|\n|\r)/g, '\\n') // Normalize newlines to \n
      .replace(/\\"/g, '\\\\"'); // Ensure quotes are properly escaped

    let generatedCode;
    try {
      generatedCode = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse cleaned response:', content);
      console.error('Parse error:', parseError.message);
      throw new Error('Invalid JSON response from Groq API');
    }

    // Validate the parsed response
    if (!generatedCode.jsx || typeof generatedCode.css !== 'string' || typeof generatedCode.js !== 'string') {
      console.error('Incomplete or invalid code response:', generatedCode);
      throw new Error('Incomplete code response from Groq API');
    }

    // Normalize the JSX to ensure it's a valid component
    const normalizedCode = {
      jsx: generatedCode.jsx.startsWith('export default')
        ? generatedCode.jsx
        : `export default function LandingPage() {\n  return (${generatedCode.jsx});\n}`,
      css: generatedCode.css || '',
      js: generatedCode.js || '',
    };

    console.log('Normalized code sent to frontend:', normalizedCode);

    return NextResponse.json(normalizedCode);
  } catch (error) {
    console.error('Error in generate-landing API:', error.message);
    return NextResponse.json({ error: 'Failed to generate landing page: ' + error.message }, { status: 500 });
  }
}