const { romanToArabic, arabicToRoman } = require('../romano-arabigo.js');
const { InvalidRomanNumeralError, OutOfRangeError, InvalidArabicError } = require('../errors/custom-errors.js');

describe('Arabic -> Roman (función arabicToRoman)', () => {
  test('solo números (tipo number) convierte correctamente', () => {
    expect(arabicToRoman(1)).toBe('I');
    expect(arabicToRoman(24)).toBe('XXIV');
  });

  test('solo enteros: decimales lanzan InvalidArabicError', () => {
    expect(() => arabicToRoman(3.14)).toThrow(InvalidArabicError);
    expect(() => arabicToRoman(Number('3.14'))).toThrow(InvalidArabicError);
  });

  test('letras como entrada lanzan InvalidArabicError', () => {
    expect(() => arabicToRoman('100')).toThrow(InvalidArabicError);
    expect(() => arabicToRoman(null)).toThrow(InvalidArabicError);
    expect(() => arabicToRoman(undefined)).toThrow(InvalidArabicError);
  });

  test('rango: número entre 1 y 3999 (incluidos)', () => {
    expect(arabicToRoman(1)).toBe('I');
    expect(arabicToRoman(3999)).toBe('MMMCMXCIX');
  });

  test('número más alto (4000) lanza OutOfRangeError', () => {
    expect(() => arabicToRoman(4000)).toThrow(OutOfRangeError);
  });

  test('número más bajo (0) lanza OutOfRangeError', () => {
    expect(() => arabicToRoman(0)).toThrow(OutOfRangeError);
  });

  test('número negativo lanza OutOfRangeError', () => {
    expect(() => arabicToRoman(-5)).toThrow(OutOfRangeError);
  });
});

describe('Roman -> Arabic (función romanToArabic)', () => {
  test('solo letras (string) aceptadas y convierten', () => {
    expect(romanToArabic('I')).toBe(1);
    expect(romanToArabic('XXIV')).toBe(24);
  });

  test('error al insertar números (no string válido) lanza InvalidRomanNumeralError', () => {
    expect(() => romanToArabic(123)).toThrow(InvalidRomanNumeralError);
    expect(() => romanToArabic(null)).toThrow(InvalidRomanNumeralError);
  });

  test('error al insertar letras fuera del conjunto I,V,X,L,C,D,M lanza InvalidRomanNumeralError', () => {
    expect(() => romanToArabic('ABCD')).toThrow(InvalidRomanNumeralError);
    expect(() => romanToArabic('Z')).toThrow(InvalidRomanNumeralError);
  });

  test('no da error si hay mayúsculas y minúsculas mezcladas', () => {
    expect(romanToArabic('mCmXcix')).toBe(1999);
    expect(romanToArabic('xIv')).toBe(14);
  });

  test('regla subtractiva: símbolo menor que el siguiente se resta', () => {
    expect(romanToArabic('IV')).toBe(4);
    expect(romanToArabic('IX')).toBe(9);
  });

  test('regla aditiva: símbolo >= siguiente se suma', () => {
    expect(romanToArabic('VI')).toBe(6);
    expect(romanToArabic('XI')).toBe(11);
  });

  test('casos borde: repeticiones inválidas y combinaciones inválidas dan InvalidRomanNumeralError', () => {
    expect(() => romanToArabic('XXXX')).toThrow(InvalidRomanNumeralError);
    expect(() => romanToArabic('VX')).toThrow(InvalidRomanNumeralError);
    expect(() => romanToArabic('MMMM')).toThrow(InvalidRomanNumeralError);
  });

  test('espacios alrededor y normalización funcionan', () => {
    expect(romanToArabic('  xiv  ')).toBe(14);
    expect(romanToArabic('\tMCMXCIX\n')).toBe(1999);
  });

  test('entrada vacía lanza InvalidRomanNumeralError', () => {
    expect(() => romanToArabic('')).toThrow(InvalidRomanNumeralError);
  });

  test('entrada muy larga o malformada lanza InvalidRomanNumeralError (protección DoS parcial)', () => {
    const manyI = 'I'.repeat(1000);
    expect(() => romanToArabic(manyI)).toThrow(InvalidRomanNumeralError);
  });
});
