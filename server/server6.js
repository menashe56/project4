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
  vocabulary.push("movie", "amazing", "bad");

  // Convert words to indices in the vocabulary
  const reviewsAsIndices = tokenizedReviews.map(review =>
    review.map(word => vocabulary.indexOf(word))
  );

// Assuming reviewsAsIndices is a 2D array representing sequences of indices

// Find the maximum sequence length
const maxLength = Math.max(...reviewsAsIndices.map(seq => seq.length));

console.log(reviewsAsIndices)

const ReviewsTensor = tf.tensor2d(reviewsAsIndices);

  // Convert labels to TensorFlow tensors
  const labelsTensor = tf.tensor1d(labels);
  console.log(ReviewsTensor)

  // Define and compile the model
  const model = tf.sequential();
  model.add(tf.layers.embedding({
    inputDim: vocabulary.length,
    outputDim: 32, // Adjust outputDim as needed
    inputLength: 320 //ReviewsTensor.shape[1]
  }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  // Train the model
  model.fit(ReviewsTensor, labelsTensor, { epochs: 100 })
    .then(info => {
      console.log('Training complete:', info);
    })
    .catch(error => {
      console.error('Training failed:', error);
    });

// Perform inference on new data
const newReview = "This movie is bad"; // Replace with your own review
const tokenizedNewReview = tokenizer.tokenize(newReview.toLowerCase());
const indices = tokenizedNewReview.map(word => vocabulary.indexOf(word));

// Pad the new review sequence manually
const maxLen = ReviewsTensor.shape[1]; // Should match the 'maxlen' used during training
const NewReview = Array.from({ length: maxLen }, (_, i) => indices[i] || 0);

const NewReviewTensor = tf.tensor2d([NewReview]);
console.log('Indices:', indices);
console.log('New Review:', NewReview);

const prediction = model.predict(NewReviewTensor);
const sentiment = prediction.dataSync()[0] > 0.5 ? 'positive' : 'negative';
console.log(`Predicted sentiment: ${sentiment}`);
});
