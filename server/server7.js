const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const Papa = require('papaparse');
const natural = require('natural');
require('@tensorflow/tfjs-node');

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
const imdbDatasetPath = '../assets/data/small Dataset.csv';

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
  vocabulary.push("movie", "amazing", "bad","it");

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

  // Train the model with a callback to log training progress
  model.fit(ReviewsTensor, labelsTensor, {
    epochs: 10,
    callbacks: {
      onEpochBegin: (epoch) => {
        console.log(`Epoch ${epoch + 1}/${10} - Training...`);
      },
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}/${10} - loss: ${logs.loss.toFixed(4)} - accuracy: ${logs.acc.toFixed(4)}`);
      }
    }
  })
    .then(info => {
      console.log('Training complete:', info);

      // Perform inference on new data
      const newReview = "the movie is great"
      const tokenizedNewReview = tokenizer.tokenize(newReview.toLowerCase());
      const indices = tokenizedNewReview.map(word => vocabulary.indexOf(word));

      // Pad the new review sequence manually
      const maxLen = ReviewsTensor.shape[1]; // Should match the 'maxlen' used during training
      const newReviewIndicesPadded = padSequences([indices], maxLen)[0];

      const newReviewTensor = tf.tensor2d([newReviewIndicesPadded]);
      console.log('Indices:', indices);
      console.log('New Review:', newReviewIndicesPadded);

      const prediction = model.predict(newReviewTensor);
      const sentiment = prediction.dataSync()[0] > 0.5 ? 'positive' : 'negative';
      console.log('prediction.dataSync()[0]:',prediction.dataSync()[0])
      console.log(`Predicted sentiment: ${sentiment}`);
    })
    .catch(error => {
      console.error('Training failed:', error);
    });
});
