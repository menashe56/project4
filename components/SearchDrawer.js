import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const SearchDrawer = ({ onClose }) => {
  return (
    <View style={styles.drawerContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        // Add any necessary props or state for search functionality
      />
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <AntDesign name='close' size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  closeButton: {
    padding: 8,
  },
});

export default SearchDrawer;
