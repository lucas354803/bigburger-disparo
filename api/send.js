export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Use POST' });

  try {
    const { phone, message, optIn } = req.body || {};

    if (!optIn) {
      return res.status(400).json({ ok:false, error:'Envio bloqueado: contato sem autorização/opt-in.' });
    }

    const only = String(phone || '').replace(/\D/g, '');
    if (!only || only.length < 10) {
      return res.status(400).json({ ok:false, error:'Telefone inválido.' });
    }

    if (!message || String(message).trim().length < 2) {
      return res.status(400).json({ ok:false, error:'Mensagem vazia.' });
    }

    // Usa as variáveis do Vercel. Se não existirem, usa sua configuração atual.
    const baseUrl = (process.env.EVOLUTION_API_URL || 'https://corocre-trailside-outbound.ngrok-free.dev').replace(/\/$/, '');
    const apiKey = process.env.EVOLUTION_API_KEY || '5736B9A6D254-44C4-8FC3-6A9EC7CF4428';
    const instance = process.env.EVOLUTION_INSTANCE || 'bidisparo';

    const number = only.startsWith('55') ? only : `55${only}`;
    const url = `${baseUrl}/message/sendText/${encodeURIComponent(instance)}`;

    const response = await fetch(url, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'apikey': apiKey,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({
        number,
        text: String(message)
      })
    });

    const raw = await response.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { raw }; }

    if (!response.ok) {
      return res.status(200).json({
        ok:false,
        error:`Falha na Evolution API: HTTP ${response.status}`,
        url,
        instance,
        number,
        details:data
      });
    }

    return res.status(200).json({ ok:true, data, instance, number });
  } catch (e) {
    return res.status(200).json({
      ok:false,
      error:e.message || 'Erro interno',
      hint:'Confira se o ngrok está aberto e se a URL do Vercel é a URL atual do ngrok.'
    });
  }
}
