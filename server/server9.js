const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const natural = require('natural');
const os = require('os');
const tf = require('@tensorflow/tfjs-node');

// Load natural library for tokenization
const tokenizer = new natural.WordTokenizer();

// Function to load CSV data
function loadCSV(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      complete: callback
    });
  });
}

// Function to pad sequences with zeros
function padSequences(sequences, maxLen, padding = 'post') {
  return sequences.map(seq => {
    const pad = Array.from({ length: Math.max(0, maxLen - seq.length) }, () => 0);
    return padding === 'post' ? [...seq, ...pad] : [...pad, ...seq];
  });
}

// Path to your IMDB dataset file
const imdbDatasetPath = '../assets/data/1.csv';

// Load IMDB dataset
loadCSV(imdbDatasetPath, (result) => {
  const reviews = result.data.map(row => row.review);
  const labels = result.data.map(row => row.sentiment === 'positive' ? 1 : 0); // Convert sentiment to binary (1 for positive, 0 for negative)

  const tokenizedReviews = reviews.map(review => {
    if (review) {
      return tokenizer.tokenize(review.toLowerCase());
    } else {
      return [];
    }
  });

  // Create a vocabulary from the reviews
  const vocabulary = Array.from(new Set(tokenizedReviews.flat()));
  vocabulary.push("movie", "amazing", "bad", "it");

  // Convert words to indices in the vocabulary and pad sequences
  const reviewsAsIndicesPadded = padSequences(
    tokenizedReviews.map(review => review.map(word => vocabulary.indexOf(word))),
    Math.max(...tokenizedReviews.map(seq => seq.length))
  );

  // Assuming reviewsAsIndicesPadded is a 2D array representing sequences of padded indices

  const ReviewsTensor = tf.tensor2d(reviewsAsIndicesPadded);

  // Convert labels to TensorFlow tensors
  const labelsTensor = tf.tensor1d(labels);

  // Define the model
  const model = tf.sequential();
  model.add(tf.layers.embedding({
    inputDim: vocabulary.length,
    outputDim: 32,
    inputLength: ReviewsTensor.shape[1]
  }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  // Compile the Model
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  const checkpointPath = './model/model_weights';

// Train the model with a callback to log training progress
model.fit(ReviewsTensor, labelsTensor, {
  epochs: 10,
  callbacks: {
    onEpochBegin: (epoch) => {
      console.log(`Epoch ${epoch + 1}/${10} - Training...`);
    },
    onEpochEnd: async (epoch, logs) => {
      console.log(`Epoch ${epoch + 1}/${10} - loss: ${logs.loss.toFixed(4)} - accuracy: ${logs.acc.toFixed(4)}`);

      // Save model weights after each epoch
      await model.save(`file://${checkpointPath}`);
    },
  },
})
  .then(info => {
    console.log('Training complete:', info);

    // Save the model architecture
    const modelArchitecture = model.toJSON();
    fs.writeFileSync('./model/model-architecture.json', JSON.stringify(modelArchitecture));

    // Load the model from the saved weights
    return tf.loadLayersModel(`file://${checkpointPath}/model.json`);
  })
  .then(loadedModel => {
    console.log('Model weights loaded successfully.');

    // Use the loadedModel for further predictions or training
  })
  .catch(error => {
    console.error('Training failed:', error);
  });
});
