# Conversor Romano ↔ Arábigo
Varela Alan Christian Emmanuel

**Proyecto Final** — Servicio serverless que convierte números romanos a arábigos y viceversa.  
Desplegado en Vercel como funciones serverless y con tests automáticos en Jest.

---

## Resumen / Objetivo
Desarrollar un servicio web (hosteado en Vercel) que proporcione dos endpoints REST que:
- conviertan números romanos a arábigos (`/api/r2a`)
- conviertan números arábigos a romanos (`/api/a2r`)

Cumple con las exigencias:
- endpoints definidos en `api/` (funciones serverless)
- tests unitarios y de integración con Jest + Supertest
- respuestas de error estandarizadas con **RFC 7807** (`application/problem+json`)
- CORS habilitado (soporte `OPTIONS` preflight)
- README técnico y pruebas de cobertura

---

## Estructura del repositorio
/ (root)
├─ package.json
├─ romano-arabigo.js # lógica + app express para pruebas locales (exporta app)
├─ /api
│ ├─ r2a.js # función serverless (roman -> arabic)
│ └─ a2r.js # función serverless (arabic -> roman)
├─ /errors
│ └─ custom-errors.js # clases de error con status y code
├─ /middlewares
│ └─ error-handler.js # formatea errores a RFC 7807
├─ /test
│ ├─ romanos.test.js
│ └─ api.test.js
└─ README.md # (este archivo)


---

## Endpoints (API)

### `GET /api/r2a?roman=<ROMAN>`
Convierte `ROMAN` (string) → número arábigo (integer).

- **Parámetros**: `roman` (query string, obligatorio)
- **Respuestas**:
  - `200 OK`  
    ```json
    {
      "type": "/success/roman-to-arabic",
      "title": "Conversión exitosa",
      "status": 200,
      "roman": "XXIV",
      "arabic": 24
    }
    ```
  - `400 Bad Request` (RFC 7807 `application/problem+json`, ejemplo):
    ```json
    {
      "type": "/errors/invalid_roman",
      "title": "Número romano inválido: \"IIII\"",
      "status": 400,
      "detail": "Número romano inválido: \"IIII\"",
      "instance": "/api/r2a?roman=IIII"
    }
    ```

### `GET /api/a2r?arabic=<NUMBER>`
Convierte `NUMBER` (integer) → número romano (string).

- **Parámetros**: `arabic` (query string, obligatorio, entero entre 1 y 3999)
- **Respuestas**:
  - `200 OK`
    ```json
    {
      "type": "/success/arabic-to-roman",
      "title": "Conversión exitosa",
      "status": 200,
      "arabic": 1987,
      "roman": "MCMLXXXVII"
    }
    ```
  - `400 Bad Request` (ejemplo para número fuera de rango):
    ```json
    {
      "type": "/errors/out_of_range",
      "title": "El número 4000 está fuera del rango permitido (1–3999)",
      "status": 400,
      "detail": "El número 4000 está fuera del rango permitido (1–3999)",
      "instance": "/api/a2r?arabic=4000"
    }
    ```

---

## CORS / Preflight
- El servicio responde a `OPTIONS` preflight con status `200` y cabeceras:

Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type

- Las respuestas de error devuelven `Content-Type: application/problem+json`.

---

## Validaciones principales
- Romanos: sólo caracteres `I V X L C D M` (mayúsculas/minúsculas normalizadas), regex canónica para estructura, máximo `MMM` en miles.
- Arábigos: debe ser `Number` entero y `1 <= n <= 3999`.

---

## Errores y formato (RFC 7807)
Los errores siguen la estructura `application/problem+json` con propiedades clave:
- `type` — URI corta que identifica el error (p. ej. `/errors/invalid_roman`)
- `title` — mensaje breve
- `status` — código HTTP (ej. 400)
- `detail` — mensaje que explica el problema (fallback a `title`)
- `instance` — path de la solicitud

---

## Ejecutar localmente (desarrollo)

Requisitos: Node.js 18+, npm

1. Instalar dependencias:
```bash
npm install

Ejecutar servidor local (modo Express, sólo para pruebas locales):
node romano-arabigo.js
# escucha por defecto en http://localhost:3000

Probar endpoints:

http://localhost:3000/r2a?roman=XXIV

http://localhost:3000/a2r?arabic=1987

Para emular Vercel localmente (opcional) usa vercel dev si tenés instalado Vercel CLI.

Tests (Jest + Supertest)

Ejecutar todos los tests y generar coverage:
npm test

Los tests cubren casos válidos, invalidaciones, casuística borde (repeticiones inválidas, subtractive rule, entradas mixtas, decimales, strings) y los endpoints serverless.

El proyecto incluye coverage y está configurado para ignorar .vercel/ en los tests.

Cobertura

Se incluye coverage de Jest (ver carpeta coverage/ tras ejecutar npm test).

Los tests de ejemplo en la entrega alcanzan cobertura alta en lógica y middleware.

Despliegue en Vercel

Repositorio conectado en Vercel:
https://vercel.com/alan-christian-emmanuel-varelas-projects/numeros-romanos-x-alan1125x 



Comprobar endpoints desplegados:

https://numeros-romanos-x-alan1125x.vercel.app/api/r2a?roman=XXIV

https://numeros-romanos-x-alan1125x.vercel.app/api/a2r?arabic=1987


Notas técnicas / decisiones

Código principal exporta module.exports = { app, romanToArabic, arabicToRoman } para permitir tests con Supertest.

API serverless en /api usa CommonJS (module.exports) para compatibilidad con Vercel node runtimes.

Middlewares: central error-handler que produce application/problem+json.

Validaciones realizadas tanto en capa API (parámetros) como en funciones puras (romanToArabic / arabicToRoman).

Evitado exponer stack traces en respuestas públicas (sólo se registran en consola).


Ética profesional

El servicio valida y rechaza inputs malformados evitando comportamiento inseguro o ambigüo.

Se aplican límites (rango 1–3999) para evitar condiciones de DoS por entradas excesivamente largas.

Se documentan claramente las respuestas y errores para que clientes sepan cómo actuar ante fallos.



