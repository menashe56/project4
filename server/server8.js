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
const imdbDatasetPath = '../assets/data/1.csv';

// Load IMDB dataset
loadCSV(imdbDatasetPath, (result) => {
  // Filter out rows with missing sentiment labels
  const filteredData = result.data.filter(row => row.sentiment !== undefined && row.review !== undefined);

  const reviews = filteredData.map(row => row.review);
  const labels = filteredData.map(row => row.sentiment === 'positive' ? 1 : 0); // Convert sentiment to binary (1 for positive, 0 for negative)

  const tokenizedReviews = reviews.map(review => tokenizer.tokenize(review.toLowerCase()));

  // Create a vocabulary from the reviews, including a special token for unknown words
  const unknownToken = "<UNK>";
  const vocabulary = Array.from(new Set(tokenizedReviews.flat()));
  vocabulary.push(unknownToken);

  // Convert words to indices in the vocabulary and pad sequences
  const reviewsAsIndicesPadded = padSequences(
    tokenizedReviews.map(review => review.map(word => vocabulary.indexOf(word) !== -1 ? vocabulary.indexOf(word) : vocabulary.indexOf(unknownToken))),
    Math.max(...tokenizedReviews.map(seq => seq.length))
  );

  // Split the dataset into training, validation, and test sets
  const splitIndexTrain = Math.floor(0.7 * reviewsAsIndicesPadded.length);
  const splitIndexValidation = Math.floor(0.9 * reviewsAsIndicesPadded.length);

  const trainData = reviewsAsIndicesPadded.slice(0, splitIndexTrain);
  const validationData = reviewsAsIndicesPadded.slice(splitIndexTrain, splitIndexValidation);
  const testData = reviewsAsIndicesPadded.slice(splitIndexValidation);

  // Convert labels to TensorFlow tensors
  const trainLabels = tf.tensor1d(labels.slice(0, splitIndexTrain));
  const validationLabels = tf.tensor1d(labels.slice(splitIndexTrain, splitIndexValidation));
  const testLabels = tf.tensor1d(labels.slice(splitIndexValidation));

  // Convert data arrays to TensorFlow tensors
  const trainTensor = tf.tensor2d(trainData);
  const validationTensor = tf.tensor2d(validationData);
  const testTensor = tf.tensor2d(testData);

  // Define the model
  const model = tf.sequential();
  model.add(tf.layers.embedding({
    inputDim: vocabulary.length,
    outputDim: 32,
    inputLength: trainTensor.shape[1]
  }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  // Compile the Model
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  // Train the model with a callback to log training progress
  model.fit(trainTensor, trainLabels, {
    epochs: 10,
    validationData: [validationTensor, validationLabels],
    callbacks: {
      onEpochBegin: (epoch) => {
        console.log(`Epoch ${epoch + 1}/${10} - Training...`);
      },
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}/${10} - loss: ${logs.loss.toFixed(4)} - accuracy: ${logs.acc.toFixed(4)} - val_loss: ${logs.val_loss.toFixed(4)} - val_accuracy: ${logs.val_acc.toFixed(4)}`);
      }
    }
  })
  .then(info => {
    console.log('Training complete:', info);

    // Evaluate the model on the test set
    const evalResult = model.evaluate(testTensor, testLabels);
    console.log('Test Loss:', evalResult[0].dataSync()[0].toFixed(4));
    console.log('Test Accuracy:', evalResult[1].dataSync()[0].toFixed(4));

    // Perform inference on new data
    const newReview = "the movie is bad";
    const tokenizedNewReview = tokenizer.tokenize(newReview.toLowerCase());
    const indices = tokenizedNewReview.map(word => vocabulary.indexOf(word) !== -1 ? vocabulary.indexOf(word) : vocabulary.indexOf(unknownToken));

    // Pad the new review sequence manually
    const maxLen = trainTensor.shape[1]; // Should match the 'maxlen' used during training
    const newReviewIndicesPadded = padSequences([indices], maxLen)[0];

    const newReviewTensor = tf.tensor2d([newReviewIndicesPadded]);
    console.log('Indices:', indices);
    console.log('New Review:', newReviewIndicesPadded);

    const prediction = model.predict(newReviewTensor);
    const sentiment = prediction.dataSync()[0] > 0.5 ? 'positive' : 'negative';
    console.log('prediction.dataSync()[0]:', prediction.dataSync()[0]);
    console.log(`Predicted sentiment: ${sentiment}`);
  })
  .catch(error => {
    console.error('Training failed:', error);
  });
});
