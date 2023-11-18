import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');

  const register = async () => {
    try {
      const response = await fetch('https://13.49.46.202/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, age, picture_url: pictureUrl }),
      });

      const data = await response.json();

      if (data.success) {
        // Registration successful
        console.log('User account created!');
        navigation.replace('Home'); // or navigate to the appropriate screen
      } else {
        // Registration failed
        Alert.alert('Error', data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <StatusBar style="light" />
      <Text style={{ marginBottom: 50, fontSize: 28 }}>Create a Signal account</Text>
      <View style={styles.inputContainer}>
        <Input placeholder='Full Name' autoFocus type="text" value={name} onChangeText={text => setName(text)} />
        <Input placeholder='Email' autoFocus type="email" value={email} onChangeText={text => setEmail(text)} />
        <Input placeholder='Password' secureTextEntry type="password" value={password} onChangeText={text => setPassword(text)} />
        <Input placeholder='Age' type="number" value={age} onChangeText={text => setAge(text)} />
        <Input placeholder='Profile Picture URL (optional)' type="text" value={pictureUrl} onChangeText={text => setPictureUrl(text)} onSubmitEditing={register} />
      </View>
      <Button containerStyle={styles.button} raised title='Register' onPress={register} />
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
});
