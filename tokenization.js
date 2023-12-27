
const natural = require('natural');

// Load natural library for tokenization
const tokenizer = new natural.WordTokenizer();

// Tokenize a given text
export function tokenizeText(text) {
  if (text) {
    return tokenizer.tokenize(text.toLowerCase());
  } else {
    return [];
  }
}
