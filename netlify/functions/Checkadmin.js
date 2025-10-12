// netlify/functions/checkAdmin.js
exports.handler = async function(event, context) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Netlify environment variable
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const password = body.password || '';
    const authenticated = password === ADMIN_PASSWORD;
    return { statusCode: 200, body: JSON.stringify({ authenticated }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
