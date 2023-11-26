import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { connect } from 'react-redux';
import { Set_user_email, Set_user_name, Set_user_age, Set_user_picture_url } from '../Redux/counterSlice';

const Register = ({ navigation, ip, Set_user_email, Set_user_name, Set_user_age, Set_user_picture_url }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [picture_url, setpicture_url] = useState('');

  const register = async () => {
    try {
      const requestData = {
        name,
        email,
        password,
        age,
        picture_url: picture_url || "https://cdn-icons-png.flaticon.com/256/149/149071.png",
      };


      await axios.post(`http://${ip}/api/register`, requestData);

      console.log('User Data:', requestData);
        // Registration successful
        console.log('User account created!');
        Set_user_email(email)
        Set_user_name(name)
        Set_user_age(age)
        Set_user_picture_url(picture_url || "https://cdn-icons-png.flaticon.com/256/149/149071.png")
        navigation.replace('Main');
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
        <Input placeholder='Profile Picture URL (optional)' type="text" value={picture_url} onChangeText={text => setpicture_url(text)} onSubmitEditing={register} />
      </View>
      <Button containerStyle={styles.button} raised title='Register' onPress={register} />
    </KeyboardAvoidingView>
  );
};

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

const mapStateToProps = (state) => ({

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
      Set_user_email,
  Set_user_name,
  Set_user_picture_url,
  Set_user_age,
  };
  

  export default connect(mapStateToProps, mapDispatchToProps)(Register);
