const request = require('supertest');
const { app } = require('../romano-arabigo.js'); 

function expectProblem(res, expectedStatus) {
  expect(res.status).toBe(expectedStatus);
  const ct = res.headers['content-type'] || '';
  expect(ct).toMatch(/application\/problem\+json|application\/json/);
  expect(res.body).toHaveProperty('type');
  expect(res.body).toHaveProperty('title');
  expect(res.body).toHaveProperty('status', expectedStatus);
  expect(res.body).toHaveProperty('detail');
}

describe('API endpoints', () => {
  describe('GET /r2a', () => {
    test('200 OK con XXIV -> 24', async () => {
      const res = await request(app).get('/r2a').query({ roman: 'XXIV' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('output', 24);
      expect(res.body).toHaveProperty('input', 'XXIV');
    });

    test('OPTIONS preflight responde 200 y agrega cabeceras CORS', async () => {
      const res = await request(app).options('/r2a');
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    test('400 con numeral inválido (IIII) devuelve problem+json', async () => {
      const res = await request(app).get('/r2a').query({ roman: 'IIII' });
      expectProblem(res, 400);
    });

    test('400 con vacío devuelve problem+json', async () => {
      const res = await request(app).get('/r2a').query({ roman: '' });
      expectProblem(res, 400);
    });

    test('400 con número en vez de letras devuelve problem+json', async () => {
      const res = await request(app).get('/r2a').query({ roman: '123' });
      expectProblem(res, 400);
    });
  });

  describe('GET /a2r', () => {
    test('200 OK con 1987 -> MCMLXXXVII', async () => {
      const res = await request(app).get('/a2r').query({ arabic: '1987' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('output', 'MCMLXXXVII');
      expect(res.body).toHaveProperty('input', 1987);
    });

    test('OPTIONS preflight responde 200 y agrega cabeceras CORS', async () => {
      const res = await request(app).options('/a2r');
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    test('400 con decimal 3.14 devuelve problem+json', async () => {
      const res = await request(app).get('/a2r').query({ arabic: '3.14' });
      expectProblem(res, 400);
    });

    test('400 con letras en vez de número devuelve problem+json', async () => {
      const res = await request(app).get('/a2r').query({ arabic: 'abc' });
      expectProblem(res, 400);
    });

    test('400 con 0 y con negativo devuelve problem+json', async () => {
      const res0 = await request(app).get('/a2r').query({ arabic: '0' });
      expectProblem(res0, 400);
      const resNeg = await request(app).get('/a2r').query({ arabic: '-5' });
      expectProblem(resNeg, 400);
    });

    test('400 con número demasiado grande (4000) devuelve problem+json', async () => {
      const res = await request(app).get('/a2r').query({ arabic: '4000' });
      expectProblem(res, 400);
    });
  });

  test('400 cuando falta el parámetro arabic (no provisto)', async () => {
    const res = await request(app).get('/a2r'); 
    expectProblem(res, 400);
    expect(res.body.type).toMatch(/missing-parameter|invalid-parameter/);
  });

  test('400 cuando parámetro arabic está vacío', async () => {
    const res = await request(app).get('/a2r').query({ arabic: '' });
    expectProblem(res, 400);
  });
});
