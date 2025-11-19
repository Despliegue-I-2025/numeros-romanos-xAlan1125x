class InvalidRomanNumeralError extends Error {
  constructor(input) {
    super(`Número romano inválido: "${input}"`);
    this.name = "InvalidRomanNumeralError";
    this.status = 400;
    this.code = "invalid_roman";
  }
}

class OutOfRangeError extends Error {
  constructor(input) {
    super(`El número ${input} está fuera del rango permitido (1–3999)`);
    this.name = "OutOfRangeError";
    this.status = 400; 
    this.code = "out_of_range";
  }
}


class InvalidArabicError extends Error {
  constructor(input) {
    super(`Número arábigo inválido: "${input}"`);
    this.name = "InvalidArabicError";
    this.status = 400;
    this.code = "invalid_arabic";
  }
}

module.exports = { InvalidRomanNumeralError, OutOfRangeError, InvalidArabicError };
