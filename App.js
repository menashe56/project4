import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MainApp from './Interface/MainApp';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './Redux/store';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
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
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingVertical: 10,
  },
});