import React, { useState, useEffect }  from 'react';
import { StyleSheet, View,Image,Text } from 'react-native';
import '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import {bundleResourceIO} from '@tensorflow/tfjs-react-native'

export default function App() {
  const [model, setModel] = useState(null);

  // Function to pad sequences with zeros
  function padSequences(sequences, maxLen, padding = 'post') {
    return sequences.map(seq => {
      const pad = Array.from({ length: Math.max(0, maxLen - seq.length) }, () => 0);
      return padding === 'post' ? [...seq, ...pad] : [...pad, ...seq];
    });
  }

  const loadModel = async () => {
    try {
      // Use direct paths to the model files within the assets directory
      const modelJson = require('./assets/model/model_weights/model.json');
      const modelWeight = require('./assets/model/model_weights/weights.bin');
  
      // Load the model using bundleResourceIO
      const model = await tf.loadLayersModel(
        bundleResourceIO({
          modelJson: JSON.stringify(modelJson),
          modelWeightsID: [modelWeight.default],
        })
      );
  
      console.log('Model loaded successfully:', model);
      return model;
    } catch (error) {
      console.error('Error loading model:', error);
      return null;
    }
  };
  


  useEffect(() => {
    // Load the pre-trained model
    loadModel()
      .then(async (loadedModel) => {
        console.log('Model loaded successfully:', loadedModel);
        setModel(loadedModel); // Set the loaded model in the state

        const vocabulary = ['the', 'movie', 'is', 'bad']
        // Perform inference on new data
        const newReview = "the movie is bad";
        const tokenizedNewReview = vocabulary;
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
      });
  }, []); // Empty dependency array to run the effect only once on component mount

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{model ? 'Model Loaded Successfully!' : 'Loading Model...'}</Text>
    </View>
  );
}
