const tf = require('@tensorflow/tfjs');

// Generate random data for training
const numSamples = 1000;
const inputSize = 10;
const outputSize = 2;

const inputData = tf.randomNormal([numSamples, inputSize]);
const outputData = tf.randomNormal([numSamples, outputSize]);
console.log(inputData)
console.log(outputData)

// Define a simple feedforward neural network
const model = tf.sequential();
model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [inputSize] }));
model.add(tf.layers.dense({ units: outputSize, activation: 'softmax' }));

// Compile the model
model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });


// Train the model
model.fit(inputData, outputData, { epochs: 5 })
  .then(info => {
    console.log('Training complete:', info);
  })
  .catch(error => {
    console.error('Training failed:', error);
  });

  // Perform inference
const newInputData = tf.randomNormal([1, inputSize]);
console.log(newInputData)
const predictions = model.predict(newInputData);
predictions.print();
