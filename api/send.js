export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Use POST' });

  try {
    const { phone, message, optIn, media, mimeType, fileName } = req.body || {};

    if (!optIn) {
      return res.status(400).json({ ok:false, error:'Envio bloqueado: contato sem autorização/opt-in.' });
    }

    const only = String(phone || '').replace(/\D/g, '');
    if (!only || only.length < 10) {
      return res.status(400).json({ ok:false, error:'Telefone inválido.' });
    }

    const text = String(message || '').trim();
    const hasMedia = Boolean(media && String(media).startsWith('data:image/'));

    if (!text && !hasMedia) {
      return res.status(400).json({ ok:false, error:'Mensagem vazia e sem imagem.' });
    }

    const baseUrl = (process.env.EVOLUTION_API_URL || 'https://coerce-trailside-outbound.ngrok-free.dev').replace(/\/$/, '');
    const apiKey = process.env.EVOLUTION_API_KEY || '5736B9A6D254-44C4-8FC3-6A9EC7CF4428';
    const instance = process.env.EVOLUTION_INSTANCE || 'bidisparo';
    const number = only.startsWith('55') ? only : `55${only}`;

    let endpoint = '/message/sendText/';
    let payload = { number, text };

    if (hasMedia) {
      endpoint = '/message/sendMedia/';
      const cleanBase64 = String(media).replace(/^data:[^;]+;base64,/, '');
      const safeMime = mimeType || 'image/jpeg';
      payload = {
        number,
        mediatype: 'image',
        mimetype: safeMime,
        caption: text,
        media: cleanBase64,
        fileName: fileName || `big-burger-${Date.now()}.jpg`
      };
    }

    const url = `${baseUrl}${endpoint}${encodeURIComponent(instance)}`;

    const response = await fetch(url, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'apikey': apiKey,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(payload)
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

    return res.status(200).json({ ok:true, data, instance, number, type: hasMedia ? 'image' : 'text' });
  } catch (e) {
    return res.status(200).json({
      ok:false,
      error:e.message || 'Erro interno',
      hint:'Confira se o ngrok está aberto e se a URL/API KEY/instância do Vercel estão corretas.'
    });
  }
}
