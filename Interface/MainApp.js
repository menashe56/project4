import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { connect } from 'react-redux';
import { Set_ip, } from '../Redux/counterSlice';
import Home from './Home';
import AskQuestion from './AskQuestion';
import ChatQuestions from './ChatQuestions';
import Chat from './Chat';
import { Drawer } from 'expo-router/drawer';

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerShown: true,
};

const MainApp = ({Set_ip, ip}) => {

  useEffect(() => {
    Set_ip("16.16.28.132");
    console.log(ip)
  }, [ip]);

  return (
    <View style={styles.body}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions} initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AskQuestion" component={AskQuestion} />
            <Stack.Screen name="ChatQuestions" component={ChatQuestions} />
            <Stack.Screen name="Chat" component={Chat} />          
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
    ip: state.Other.ip, 
  });
  
  const mapDispatchToProps = {
    Set_ip
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
  