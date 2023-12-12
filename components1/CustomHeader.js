import React, { useState } from 'react';
import { StyleSheet, View, Text, PanResponder } from 'react-native';

const CustomHeader = ({ onResize }) => {
  const [headerWidth, setHeaderWidth] = useState(150);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const newWidth = Math.max(50, headerWidth + gesture.dx);
      setHeaderWidth(newWidth);
    },
    onPanResponderRelease: () => {
      onResize && onResize(headerWidth);
    },
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.headerText}>Your App Name</Text>
      </View>
      <View style={[styles.handle]} {...panResponder.panHandlers} />
      <View style={styles.separatorBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C6BED',
    paddingVertical: 10,
    flex:1,
  },
  headerContent: {
    flex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  separatorBar: {
    width: 60,
    height: '100%',
    backgroundColor: 'black', // Change the color as needed
    position: 'absolute',
    marginLeft: 100,
  },
  handle: {
    width: 20,
    height: '100%',
    backgroundColor: '#fff',
    marginLeft: 100,
    flex:1
  },
});

export default CustomHeader;
