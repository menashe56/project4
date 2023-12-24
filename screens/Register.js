import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert, TouchableOpacity, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { connect } from 'react-redux';
import { Set_user_email, Set_user_name, Set_user_age, Set_user_picture } from '../Redux/counterSlice';
import * as ImagePicker from 'expo-image-picker';

const Register = ({ navigation, ip, Set_user_email, Set_user_name, Set_user_age, Set_user_picture }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = React.useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library denied');
      }
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log('ImagePicker Result:', result);
  
      if (!result.cancelled && result.assets.length > 0) {
        // Access the URI from the first asset in the array
        const selectedImage = result.assets[0].uri;
        console.log('Setting Image:', selectedImage);
        setPhoto(selectedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (!photo) {
        console.log('No photo selected');
        return register("https://cdn-icons-png.flaticon.com/256/149/149071.png");
      }
  
      const formData = new FormData();
      formData.append('photo', photo);
  
      const uploadResponse = await fetch(`http://16.16.28.132/api/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
      console.log('Upload Response:', uploadData);
  
      const imagePath = uploadData.imagePath;

      register(imagePath.split('uploads/')[1])
    } catch (error) {
      console.error('Error handling photo upload:', error);
    }
  };

  const register = async (picture) => {
    try {
      const requestData = {
        name,
        email,
        password,
        age,
        picture: picture,
      };

      await axios.post(`http://${ip}/api/register`, requestData);

      console.log('User Data:', requestData);
        // Registration successful
        console.log('User account created!');
        Set_user_email(email)
        Set_user_name(name)
        Set_user_age(age)
        Set_user_picture(picture)
        navigation.replace('Home');
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
        <Button title='photo profile' onPress={handleImagePick} />
        {photo && ( 
        <View>
            <Image source={{ uri: photo }} style={{ width: 30, height: 30 }} />
        </View>
        )}
      </View>
      <Button containerStyle={styles.button} raised title='Register' onPress={handleUploadPhoto} />
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
    Set_user_picture,
    Set_user_age,
  };
  

  export default connect(mapStateToProps, mapDispatchToProps)(Register);
