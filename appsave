import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MainApp from './Interface/MainApp';
import { Provider } from 'react-redux';
import store from './Redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
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