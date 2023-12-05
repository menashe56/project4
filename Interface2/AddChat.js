import React, { useState, useEffect } from 'react';
import {
  View,
  Modal as ReactModal,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { connect } from 'react-redux';
import { Set_isAddChatModalVisible } from '../Redux/counterSlice';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const AddChat = ({ isAddChatModalVisible, Set_isAddChatModalVisible, ip }) => {
  const [input, setInput] = useState('');
  const [chatImage, setChatImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [photo, setPhoto] = React.useState(null);
  const [type, setType] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library denied');
      }
    })();
  }, []);

  const close = () => {
    Set_isAddChatModalVisible(false);
    setInput('');
    setChatImage(null);
  };

  


  const handleChoosePhoto = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setPhoto(selectedFile);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (!photo) {
        console.log('No photo selected');
        return;
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
  
      console.log('imagePath:', imagePath);

      // Assuming 'ip' and 'input' are defined somewhere
      const response = await axios.post(`http://${ip}/api/create-chat`, { chat_name: input, chat_image: imagePath.split('uploads/')[1], type: type});
      console.log('Create Chat Response:', response);

      close();
    } catch (error) {
      console.error('Error handling photo upload:', error);
    }
  };


  return (
    <ReactModal transparent visible={isAddChatModalVisible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={close}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Input
          placeholder='Enter a chat name'
          value={input}
          onChangeText={(text) => setInput(text)}
          leftIcon={<Icon name='wechat' type="antdesign" size={20} color="#333" />}
          containerStyle={styles.inputContainer}
        />
                <Input
          placeholder='Enter a chat type'
          value={type}
          onChangeText={(text) => setType(text)}
          leftIcon={<Icon name='group' type="MaterialIcons" size={20} color="#333" />}
          containerStyle={styles.inputContainer}
        />
        <input type="file" accept="image/*" onChange={handleChoosePhoto} />
        {loadingImage && <ActivityIndicator size="large" color="#2196F3" />}
        {photo && (
          <>
          <img src={URL.createObjectURL(photo)} alt="Selected" style={{ width: 30, height: 30 }} />
          <button onClick={handleUploadPhoto}>Upload Photo</button>
          </>
        )}
        <Button
          disabled={!input}
          title='Create New Chat'
          onPress={close}
          buttonStyle={styles.createButton}
        />
      </View>
    </ReactModal>
  );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    width: windowWidth / 1.2,
    alignSelf: 'center',
    marginTop: windowHeight / 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: -10,
  },
  input: {
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#fff',
  },
  previewImage: {
    width: 50,
    height: 50,
    marginTop: 5,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#2196F3',
    marginTop: 5,
    borderRadius: 5,
    width: '80%',
  },
  imageLoadedText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => ({
  ip: state.Other.ip,
  isAddChatModalVisible: state.Modals.isAddChatModalVisible,
});

const mapDispatchToProps = {
  Set_isAddChatModalVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddChat);
