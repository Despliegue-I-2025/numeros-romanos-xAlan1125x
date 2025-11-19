const { romanToArabic } = require('../romano-arabigo.js');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const roman = req.query.roman;
  if (!roman || String(roman).trim() === '') {
    return res.status(400).json({
      type: '/errors/missing-parameter',
      title: 'Parámetro requerido',
      status: 400,
      detail: 'El parámetro "roman" es obligatorio.',
      instance: req.url
    });
  }

  try {
    const out = romanToArabic(roman);
    return res.status(200).json({ type: '/success/roman-to-arabic', title: 'Conversión exitosa', status: 200, roman, arabic: out });
  } catch (err) {
    const status = err.status || 400;
    res.setHeader('Content-Type', 'application/problem+json');
    return res.status(status).json({
      type: err.code ? `/errors/${err.code}` : '/errors/invalid-roman',
      title: err.message,
      status,
      detail: err.message,
      instance: req.url
    });
  }
};
