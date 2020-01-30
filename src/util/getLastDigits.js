function getLastDigits(text, n) {
  return text.slice(text.length - n, text.length);
}

module.exports = getLastDigits;
