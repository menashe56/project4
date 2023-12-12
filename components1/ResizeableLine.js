import React, { useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

const ResizableSidebar = () => {
  const [sidebarWidth, setSidebarWidth] = useState(150);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      setSidebarWidth((prevWidth) => {
        const newWidth = prevWidth + gesture.dx;
        // Add any constraints here if needed
        return newWidth;
      });
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, { width: sidebarWidth }]} {...panResponder.panHandlers}>
        {/* Sidebar Content */}
      </View>
      <View style={styles.content}>
        {/* Main Content */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#1DB954', // Spotify green color
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: '#282828', // Spotify dark background color
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResizableSidebar;
