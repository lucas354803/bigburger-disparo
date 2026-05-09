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

    const baseUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;

    if (!baseUrl || !apiKey || !instance) {
      return res.status(200).json({
        ok:true,
        simulated:true,
        message:'Modo teste: variáveis da Evolution API não configuradas no Vercel.'
      });
    }

    const number = only.startsWith('55') ? only : `55${only}`;
    const url = `${baseUrl.replace(/\/$/,'')}/message/sendText/${encodeURIComponent(instance)}`;

    const response = await fetch(url, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number,
        text: String(message)
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        ok:false,
        error:'Falha na Evolution API',
        details:data
      });
    }

    return res.status(200).json({ ok:true, data });
  } catch (e) {
    return res.status(500).json({ ok:false, error:e.message || 'Erro interno' });
  }
}