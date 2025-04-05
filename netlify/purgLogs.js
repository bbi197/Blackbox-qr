// netlify/functions/purgeLogs.js
const deleteLogs = async () => {
    await fetch('https://api.netlify.com/api/v1/logs', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
    });
  };