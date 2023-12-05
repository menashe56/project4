import React, { useState, useEffect } from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Home from './Home';
import Chat from './Chat';
import LeftSection from './leftSection';
import HeaderOut from './HeaderOut';
import AddChat from './AddChat';
import { connect } from 'react-redux';
import HeaderIn from './HeaderIn';
import ChatQuestions from './ChatQuestions';
import AddChat1 from './AddChat1';
import { LinearGradient } from 'expo-linear-gradient';
import AskQuestion from './AskQuestion';

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerShown: false,
};

const Main = ({ user_email, currentRouteName, lighterColor }) => {

  useEffect(() => {
    console.log(currentRouteName);
  }, []);  

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    },
  };

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <LeftSection />
      </View>
      {/* Right Section */}
      <View style={styles.rightSection}>
        <LinearGradient  colors={[lighterColor, '#0d0c0c']} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            {user_email === '' ? (
              <HeaderOut />
            ) : (
              <>
                <HeaderIn />
                <AddChat />
              </>
            )}
          </View>
          {/* Body */}
          <View style={styles.body}>
          <NavigationContainer theme={MyTheme} independent={true}>
          <Stack.Navigator
                screenOptions={{ headerShown: false,}}
                initialRouteName="Home" 
              >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="ChatQuestions" component={ChatQuestions} />
                <Stack.Screen name="AskQuestion" component={AskQuestion} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="HeaderIn" component={HeaderIn} />
              </Stack.Navigator>
              </NavigationContainer>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingVertical: 10,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  rightSection: {
    flex: 3.3,
    paddingRight: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 10,

  },
  header: {
    flex: 1,

  },
  body: {
    flex: 7,

  },
});

const mapStateToProps = (state) => ({
  user_email: state.user_profile.user_email,
  currentRouteName: state.Other.currentRouteName,
  lighterColor: state.Other.lighterColor,
});

export default connect(mapStateToProps)(Main);
