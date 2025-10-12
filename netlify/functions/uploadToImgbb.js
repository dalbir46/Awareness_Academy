// netlify/functions/uploadToImgbb.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const imageBase64 = body.image;
    if (!imageBase64) return { statusCode: 400, body: JSON.stringify({ error: 'No image provided' }) };

    const formData = new URLSearchParams();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', imageBase64);

    const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
    const json = await res.json();

    if (json.success) {
      return { statusCode: 200, body: JSON.stringify({ url: json.data.url }) };
    } else {
      return { statusCode: 500, body: JSON.stringify({ error: json.error.message || 'Upload failed' }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
