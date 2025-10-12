// netlify/functions/firebaseHandler.js
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
  });
}

const db = admin.firestore();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const { action, data, keys } = JSON.parse(event.body || '{}');

    if (action === 'push' && data) {
      const docRef = await db.collection('messages').add(data);
      return { statusCode: 200, body: JSON.stringify({ success: true, id: docRef.id }) };
    }

    if (action === 'clear') {
      const snapshot = await db.collection('messages').get();
      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    if (action === 'delete' && Array.isArray(keys)) {
      const batch = db.batch();
      keys.forEach(key => batch.delete(db.collection('messages').doc(key)));
      await batch.commit();
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
