const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const { TextEncoder, TextDecoder } = require('util');

// Load and preprocess the text data
const text = fs.readFileSync('../../assets/data/textGeneration/ocean.csv', 'utf-8');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const encodedText = encoder.encode(text);

// Create sequences from the text
const seqLength = 50; // You can adjust this sequence length
const sequences = [];
for (let i = 0; i < encodedText.length - seqLength; i++) {
  const sequence = encodedText.slice(i, i + seqLength + 1);
  sequences.push(sequence);
}

// Build the language model
const model = tf.sequential();
model.add(tf.layers.embedding({ inputDim: 256, outputDim: 16, inputLength: seqLength }));
model.add(tf.layers.lstm({ units: 128, returnSequences: true }));
model.add(tf.layers.lstm({ units: 128 }));
model.add(tf.layers.dense({ units: 256, activation: 'softmax' }));

model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy'],
});

// Prepare input and output data
const xs = sequences.map(seq => seq.slice(0, seqLength));
const ys = sequences.map(seq => seq[seqLength]);

// Train the model
model.fit(tf.tensor(xs), tf.tensor1d(ys), { epochs: 10 })
  .then(info => {
    console.log('Training complete!');
    // Generate text using the trained model
    generateText(model, 'Some seed text', 100);
  })
  .catch(error => console.error(error));

// Function to generate text
function generateText(model, seedText, length) {
  const seed = encoder.encode(seedText);
  let generated = seed;
  
  for (let i = 0; i < length; i++) {
    const input = tf.tensor([generated.slice(-seqLength)]);
    const prediction = model.predict(input);
    const nextCharIndex = tf.argMax(prediction.squeeze(), 1).arraySync()[0];
    generated.push(nextCharIndex);
  }

  const generatedText = decoder.decode(Uint8Array.from(generated));
  console.log(generatedText);
}
