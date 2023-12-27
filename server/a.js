const fs = require('fs');
const Papa = require('papaparse');
const natural = require('natural');
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

// Function to load the model from files
async function loadModel() {
  const modelPath = 'file://./model/model_weights/model.json';
  return await tf.loadLayersModel(modelPath);
}

// Path to your IMDB dataset file
const imdbDatasetPath = '../assets/data/2.csv';

// Load IMDB dataset
loadCSV(imdbDatasetPath, async (result) => {
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

// Load the pre-trained model
loadModel()
  .then(async (loadedModel) => {
    console.log('Model loaded successfully:', loadedModel);

    // Perform inference on new data
    const newReview = "the movie is bad";
    const tokenizedNewReview = tokenizer.tokenize(newReview.toLowerCase());
    const indices = tokenizedNewReview.map(word => vocabulary.indexOf(word));

    // Pad the new review sequence manually
    const maxLen = loadedModel.input.shape[1];
    const newReviewIndicesPadded = padSequences([indices], maxLen)[0];

    const newReviewTensor = tf.tensor2d([newReviewIndicesPadded]);
    console.log('Indices:', indices);
    console.log('New Review:', newReviewIndicesPadded);

    const prediction = loadedModel.predict(newReviewTensor);
    const sentiment = prediction.dataSync()[0] > 0.5 ? 'positive' : 'negative';
    console.log('prediction.dataSync()[0]:', prediction.dataSync()[0]);
    console.log(`Predicted sentiment: ${sentiment}`);
  })
  .catch(error => {
    console.error('Model loading failed:', error);
  })
});

