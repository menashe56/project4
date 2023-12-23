import React from 'react';
import { StyleSheet, } from 'react-native';
import MainApp from './Interface/MainApp';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './Redux/store';
import ErrorBoundary from './components/ErrorBoundary';
import { tokeniser } from 'string-tokeniser'

export default function App() {
  console.log(tokeniser(['hello world', 'how are you?']))
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );

}

const styles = StyleSheet.create({
});