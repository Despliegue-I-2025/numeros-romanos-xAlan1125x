const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});
const { InvalidRomanNumeralError, OutOfRangeError, InvalidArabicError } = require('./errors/custom-errors');


// Romanos a arábigos
app.get('/r2a', (req, res, next) => {
  const raw = req.query.roman;

  // validar parámetro
  if (raw === undefined || raw.trim() === '') {
    res.setHeader('Content-Type', 'application/problem+json');
    return res.status(400).json({
      type: '/errors/missing-parameter',
      title: 'Parámetro requerido',
      status: 400,
      detail: 'El parámetro "roman" es obligatorio.',
      instance: req.originalUrl
    });
  }


  try {
    const arabicNumber = romanToArabic(raw);
    return res.status(200).json({ success: true, input: raw, output: arabicNumber });
    } catch (err) {
    return next(err);
  }

});

// Arábigos a romanos
app.get('/a2r', (req, res, next) => {
  const raw = req.query.arabic;

  // validar parámetro 
    if (raw === undefined || String(raw).trim() === '') {
    res.setHeader('Content-Type', 'application/problem+json');
    return res.status(400).json({
      type: '/errors/missing-parameter',
      title: 'Parámetro requerido',
      status: 400,
      detail: 'El parámetro "arabic" es obligatorio.',
      instance: req.originalUrl
    });
  }


  // convertir a Number y validar entero
  const n = Number(raw);
   if (Number.isNaN(n) || !Number.isFinite(n) || !Number.isInteger(n)) {
    res.setHeader('Content-Type', 'application/problem+json');
    return res.status(400).json({
      type: '/errors/invalid-parameter',
      title: 'Formato inválido',
      status: 400,
      detail: 'El parámetro "arabic" debe ser un número entero válido (no decimales).',
      instance: req.originalUrl
    });
  }


  try {
    const romanNumeral = arabicToRoman(n); 
    return res.status(200).json({ success: true, input: n, output: romanNumeral });
   } catch (err) {
    return next(err);
  }

});

//Declaración de valores
const valorRomanos = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }; //Valor de cada letra romana
const valorArabigos = [ //Valores de los números romanos
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1]
  ];

//Romano a arabigo
function romanToArabic(roman) {
 
if (typeof roman !== 'string') {
  throw new InvalidRomanNumeralError(String(roman));
}

const s = roman.trim().toUpperCase();
if (s.length === 0) {
  throw new InvalidRomanNumeralError(s);
}

const CANONICAL = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
if (!CANONICAL.test(s)) {
  throw new InvalidRomanNumeralError(s);
}

   
 //Acumulador
  let total = 0;

//Recorrer la cadena de texto
  for (let i = 0; i < s.length; i++) {
    const valorActual = valorRomanos[s[i]];
    const valorSiguiente = valorRomanos[s[i + 1]] || 0; 
 
 //Regla de resta y suma
 if (valorActual < valorSiguiente) {
      total -= valorActual;
    } else {
      total += valorActual;
    }
  }

  return total; //Devuelve el valor total en formato arábigo
}
  


  //Arabigo a romano
function arabicToRoman(arabic) {

if (typeof arabic !== 'number' || !Number.isInteger(arabic)) {
  throw new InvalidArabicError(String(arabic));
}

if (arabic < 1 || arabic > 3999) {
  throw new OutOfRangeError(arabic);
}


  let n = arabic; //Número a convertir
  let resultado = ''; //Acumulador del resultado

  for (const [simbolo, valor] of valorArabigos) { //Recorre cada símbolo y su valor
    while (n >= valor) { //Mientras el número sea mayor o igual al símbolo
      resultado += simbolo; //Concatena el símbolo al resultado
      n -= valor; //Resta el valor al número
    }
    if (n === 0) break;
  }

  return resultado; //Devuelve el número romano en formato texto
}

/* istanbul ignore next */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor del conversor escuchando en el puerto ${PORT}`);
  });
}

const errorHandler = require('./middlewares/error-handler');
app.use(errorHandler);

module.exports = { app, romanToArabic, arabicToRoman };



