// RightDrawerContent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RightDrawerContent = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToScreen('Home')}>
        <Text style={styles.drawerItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('AddChat')}>
        <Text style={styles.drawerItem}>Add Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Chat')}>
        <Text style={styles.drawerItem}>Chat</Text>
      </TouchableOpacity>
      {/* Add more items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  drawerItem: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default RightDrawerContent;
