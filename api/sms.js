export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, username, password, to, from, message } = req.body;
  const SMS_API = 'https://api.smsbroadcast.com.au/api-adv.php';

  try {
    if (action === 'balance') {
      const params = new URLSearchParams({ username, password, action: 'balance' });
      const response = await fetch(`${SMS_API}?${params}`);
      const text = await response.text();
      
      if (text.startsWith('OK:')) {
        return res.status(200).json({ success: true, balance: text.split(':')[1].trim() });
      }
      return res.status(400).json({ success: false, error: text });
    }

    if (action === 'send') {
      const params = new URLSearchParams({ username, password, to, from, message });
      const response = await fetch(`${SMS_API}?${params}`);
      const text = await response.text();
      
      if (text.startsWith('OK:')) {
        return res.status(200).json({ success: true, response: text });
      }
      return res.status(400).json({ success: false, error: text });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
