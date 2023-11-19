import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');

  const register = async () => {
    try {
      const requestData = {
        name,
        email,
        password,
        age,
        picture_url: pictureUrl,
      };


      await axios.post('http://13.49.46.202/api/register', requestData);

      console.log('User Data:', requestData); // Log the request data
        // Registration successful
        console.log('User account created!');
        navigation.replace('Home'); // or navigate to the appropriate screen
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', `An unexpected error occurred: ${error.message || 'Unknown error'}`);
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
