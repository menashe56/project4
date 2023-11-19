import React, { useEffect, useState } from 'react';
import { Button, Input, Image } from 'react-native-elements';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 // useEffect(() => {
    // Check if the user is already authenticated on component mount
  //  checkAuthStatus();
  //}, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://13.49.46.202/api/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // User is logged in, navigate to Home screen
        navigation.replace('MainApp');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const signIn = async () => {
    try {
      if (email !== '' && password !== '') {
        const response = await fetch('http://13.49.46.202/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
          // Authentication successful
          console.log('Login successful');
          navigation.replace('MainApp');
        } else {
          // Authentication failed
          console.error('Login failed:', data.error);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../assets/images/signal.png')} style={{ width: 200, height: 200 }} />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button containerStyle={styles.button} onPress={signIn} title="Login" />
      <Button
        containerStyle={styles.button}
        onPress={() => navigation.navigate('Register')}
        type="outline"
        title="Register"
      />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
});
