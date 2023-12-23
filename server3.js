const fs = require('fs');
const csv = require('csv-parser');
const natural = require('natural');
const tf = require('@tensorflow/tfjs-node');
const { WordTokenizer } = require('natural');
const TextEncoding = require('text-encoding');

const wordTokenizer = new WordTokenizer();
const { TextEncoder, TextDecoder } = TextEncoding;

// Path to the IMDb dataset CSV file
const datasetPath = '../assets/data/IMDB Dataset.csv';

// Function for text cleaning
function cleanText(text) {
  // Remove HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, '');

  // Lowercase the text
  const lowercaseText = withoutHtml.toLowerCase();

  // Remove special characters and punctuation
  const withoutSpecialChars = lowercaseText.replace(/[^\w\s]/g, '');

  // Tokenization (splitting text into words)
  const tokens = wordTokenizer.tokenize(withoutSpecialChars);

  return tokens;
}

// Function to perform one-hot encoding on the tokenized sequences
function oneHotEncode(tokens, vocabulary) {
  const oneHotMatrix = [];
  
  // Iterate over each token in the sequence
  tokens.forEach((token) => {
    // Create a one-hot vector for the current token
    const oneHotVector = new Array(vocabulary.length).fill(0);
    
    // Find the index of the token in the vocabulary
    const index = vocabulary.indexOf(token);
    
    // If the token is in the vocabulary, set the corresponding index to 1
    if (index !== -1) {
      oneHotVector[index] = 1;
    }
    
    // Add the one-hot vector to the one-hot matrix
    oneHotMatrix.push(oneHotVector);
  });

  return oneHotMatrix;
}

// Function to load, clean, and inspect the dataset
async function loadAndInspectIMDBDataset() {
  try {
    // Read the contents of the file asynchronously using the 'csv-parser' module
    const rows = [];

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        // Process each row as an object
        rows.push(row);
      })
      .on('end', async () => {
        // Extract tokenized sequences and build vocabulary
        const cleanedTokenizedSequences = rows.slice(0, 3).map((row) => cleanText(row.review));
        const cleanedVocabulary = Array.from(new Set(cleanedTokenizedSequences.flat())); 

        // Log the structure of the dataset (assuming the first row contains headers)
        console.log('Dataset Structure:', Object.keys(rows[0]));

        // Check for missing values
        const missingValues = rows.some((row) => Object.values(row).some((value) => value === undefined || value === ''));
        console.log('Missing Values:', missingValues ? 'Yes' : 'No');

        // Understand the distribution of sentiment labels
        const sentimentDistribution = {
          positive: rows.filter((row) => row.sentiment === 'positive').length,
          negative: rows.filter((row) => row.sentiment === 'negative').length,
        };
        console.log('Sentiment Distribution:', sentimentDistribution);

        // One-hot encode the sequences using the generated vocabulary
        const oneHotEncodedSequences = cleanedTokenizedSequences.map(tokens => oneHotEncode(tokens, cleanedVocabulary));

        // Print the one-hot encoded sequences
        oneHotEncodedSequences.forEach((vector, index) => {
          //console.log(`One-Hot Encoded Sequence for row ${index + 1}:`, vector);
        });

        // Convert tokenized sequences into numerical vectors
        const numericalSequences = cleanedTokenizedSequences.map((tokens) => {
          const encodedTokens = tokens.map((token) => cleanedVocabulary.indexOf(token));
          return encodedTokens;
        });
        console.log(numericalSequences)
console.log(cleanedVocabulary.length)
        //console.log('Sequence Length:', numericalSequences[1].length);
        // Step 4: Model Definition
        const model = tf.sequential();
        model.add(tf.layers.embedding({
          inputDim: cleanedVocabulary.length,
          outputDim: 64,
          inputLength: 348, // Allow TensorFlow.js to infer input length
        }));
        // Add a reshape layer to provide input shape information for flatten
// Add a reshape layer to provide input shape information for flatten
model.add(tf.layers.reshape({ targetShape: [cleanedVocabulary.length, 32] }));
model.add(tf.layers.flatten()); // turns the matrix into a one demantional array

// Global Average Pooling1D layer
       model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));


        // Step 5: Compile the Model
        model.compile({
          optimizer: 'adam',
          loss: 'binaryCrossentropy',
          metrics: ['accuracy'],
        });

        // Print model summary
model.summary();


// Step 6: Training
// Corrected code for preparing training and validation data
const splitIndex = Math.floor(0.8 * numericalSequences.length);

const xTrain = numericalSequences.slice(0, splitIndex);
const yTrain = rows.slice(0, splitIndex).map((row) => row.sentiment === 'positive' ? 1 : 0);

const xValidation = numericalSequences.slice(splitIndex);
const yValidation = rows.slice(splitIndex).map((row) => row.sentiment === 'positive' ? 1 : 0);

const numEpochs = 3;

// Convert label arrays to tensors
const yTrainTensor = tf.tensor(yTrain);
const yValidationTensor = tf.tensor(yValidation);

// Reshape xTrainTensor and yTrainTensor to include the batch and sequence dimensions
const batchSize = 32;
const sequenceLength = xTrain[0].length;
const numBatchesTrain = Math.ceil(xTrain.length / batchSize);
const xTrainTensorReshaped = tf.tensor(xTrain).reshape([numBatchesTrain, batchSize, sequenceLength]);
const yTrainTensorReshaped = yTrainTensor.reshape([numBatchesTrain, batchSize, 1]); // Add an extra dimension for compatibility

await model.fit(xTrainTensorReshaped, yTrainTensorReshaped, {
  epochs: numEpochs,
  validationData: [tf.tensor(xValidation), yValidationTensor],
  batchSize: batchSize,
});

// Dispose of the label and input tensors to free up memory
yTrainTensor.dispose();
yValidationTensor.dispose();
xTrainTensorReshaped.dispose();




        // Step 7: Evaluation
        // Evaluate the Model on the Test Set
        const xTest = numericalSequences.slice(Math.floor(0.8 * numericalSequences.length), numericalSequences.length);
        const yTest = rows.slice(Math.floor(0.8 * rows.length)).map((row) => row.sentiment === 'positive' ? 1 : 0);

        const evalResult = await model.evaluate(tf.tensor(xTest), tf.tensor(yTest));
        console.log('Test Loss:', evalResult[0].dataSync()[0]);
        console.log('Test Accuracy:', evalResult[1].dataSync()[0]);

        // Step 8: Prediction
        // Make Predictions on New Text Data
        const newTextData = ["This is a positive review.", "I did not like this movie."];
        const tokenizedNewText = newTextData.map((text) => cleanText(text));
        const encodedNewText = tokenizedNewText.map((tokens) => oneHotEncode(tokens, cleanedVocabulary));

        const predictions = model.predict(tf.tensor(encodedNewText));
        const predictionValues = predictions.dataSync();

        for (let i = 0; i < newTextData.length; i++) {
          console.log(`Prediction for "${newTextData[i]}": ${predictionValues[i] > 0.5 ? 'Positive' : 'Negative'}`);
        }

        // ... (Continue with the rest of the code)
      });
  } catch (error) {
    console.error('Error loading dataset:', error);
  }
}

// Call the function to load and inspect the dataset
loadAndInspectIMDBDataset();
