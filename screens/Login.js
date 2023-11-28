import React, { useEffect, useState } from 'react';
import { Button, Input, Image } from 'react-native-elements';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import { Set_user_email, Set_user_name, Set_user_age, Set_user_picture  } from '../Redux/counterSlice';

const Login = ({ navigation, ip, Set_user_email, Set_user_name, Set_user_age, Set_user_picture  }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if the user is already authenticated on component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`http://${ip}/api/check-auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // User is logged in, navigate to Home screen
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const signIn = async () => {
    try {
      if (email !== '' && password !== '') {
        const response = await fetch(`http://${ip}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

              // Check the HTTP status code
      if (!response.ok) {
        console.error('Login failed:', response.statusText);
        return;
      }

        const data = await response.json();
        if (data.success) {
          // Authentication successful
          console.log('Login successful',data);
          Set_user_email(email)
          Set_user_name(data.user.name)
          Set_user_age(data.user.age)
          Set_user_picture(data.user.picture)

          navigation.replace('Main');
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

const mapStateToProps = (state) => ({
    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
    Set_user_email,
Set_user_name,
Set_user_picture,
Set_user_age,
};
  

  export default connect(mapStateToProps, mapDispatchToProps)(Login);