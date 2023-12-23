const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const { TextEncoder, TextDecoder } = require('util');
const Papa = require('papaparse');

// Load and preprocess the text data from CSV
const csvFilePath = '../../assets/data/textGeneration/small.csv';
const csvData = fs.readFileSync(csvFilePath, 'utf-8');
const parsedData = Papa.parse(csvData, { header: false, dynamicTyping: true });

// Flatten the array and convert to a string
const text = parsedData.data.flat().join(' ');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const encodedText = encoder.encode(text);

// Create sequences from the text
const seqLength = 50;
const sequences = [];
for (let i = 0; i < encodedText.length - seqLength; i++) {
  const sequence = encodedText.slice(i, i + seqLength + 1);
  sequences.push(sequence);
}

// Build the language model with a simple RNN layer
const model = tf.sequential();
model.add(tf.layers.embedding({
  inputDim: 256,
  outputDim: 16,
  inputLength: seqLength,
}));
model.add(tf.layers.simpleRNN({ units: 128, returnSequences: true }));
model.add(tf.layers.simpleRNN({ units: 128 }));
model.add(tf.layers.dense({ units: 256, activation: 'softmax' }));

model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy'],
});

// Prepare input and output data
const xs = sequences.map(seq => seq.slice(0, seqLength));
const ys = sequences.map(seq => seq[seqLength]);

// Train the model with logging
model.fit(tf.tensor(xs), tf.tensor1d(ys), {
  epochs: 50,
})
  .then(info => {
    console.log('Training complete!');
    // Generate text using the trained model
    generateText(model, 'what is ocean', 100);
  })
  .catch(error => console.error(error));

// Function to generate text
async function generateText(model, seedText, length) {
  const seed = encoder.encode(seedText);
  let generated = Array.from(seed);

  for (let i = 0; i < length; i++) {
    const lastSeq = generated.slice(-seqLength);
    const paddedSeq = lastSeq.concat(Array.from({ length: seqLength - lastSeq.length }, () => 0));
    const input = tf.tensor2d([paddedSeq], [1, seqLength]);
    const prediction = await model.predict(input);
    const temperature = 1.0; // Adjust this value
    const scaledPrediction = tf.div(prediction.flatten(), temperature);
    const nextCharIndex = tf.argMax(scaledPrediction, 0).arraySync();
    generated = generated.concat([nextCharIndex]);
  }

  const generatedText = decoder.decode(Uint8Array.from(generated));
  console.log(generatedText);
}
