const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.FIRESTORE_CREDENTIALS)
});

exports.handler = async () => {
  try {
    const snapshot = await firestore.collection('transactions')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(transactions)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch transactions' })
    };
  }
};