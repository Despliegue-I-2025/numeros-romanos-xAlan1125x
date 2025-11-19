const { arabicToRoman } = require('../romano-arabigo.js');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const raw = req.query.arabic;
  if (!raw || String(raw).trim() === '') {
    return res.status(400).json({
      type: '/errors/missing-parameter',
      title: 'Parámetro requerido',
      status: 400,
      detail: 'El parámetro "arabic" es obligatorio.',
      instance: req.url
    });
  }

  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return res.status(400).json({
      type: '/errors/invalid-parameter',
      title: 'Formato inválido',
      status: 400,
      detail: 'El parámetro debe ser un número entero.',
      instance: req.url
    });
  }

  try {
    const out = arabicToRoman(n);
    return res.status(200).json({ type: '/success/arabic-to-roman', title: 'Conversión exitosa', status: 200, arabic: n, roman: out });
  } catch (err) {
    const status = err.status || 400;
    res.setHeader('Content-Type', 'application/problem+json');
    return res.status(status).json({
      type: err.code ? `/errors/${err.code}` : '/errors/out-of-range',
      title: err.message,
      status,
      detail: err.message,
      instance: req.url
    });
  }
};
