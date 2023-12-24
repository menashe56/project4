import React, { useEffect, useState ,useRef} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Set_currentRouteName } from '../Redux/counterSlice';
import axios from 'axios';
import { Input } from 'react-native-elements';

const AskQuestion = ({ route, navigation, ip, user_email }) => {

  const chat_name = route.params.chat_name;

  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const inputImageRef = useRef(null);
  const inputVideoRef = useRef(null);

  const sendMessage = async () => {
    try {
      const response = await axios.post(`http://${ip}/api/chats/${chat_name}/send-question`, {
        sender_email: user_email,
        question_content: questionContent,
        question_title: questionTitle,
      });
      setQuestionTitle('');
      setQuestionContent('');
      navigation.replace('Chat', { chat: route.params.chat, question: response.data.insertedRowInfo[0]})
      console.log('question sent sucessfuly');
    } catch (error) {
      console.error('Error sending question:', error);
    }
  };

  const onFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);

    // Separate files into images and videos based on file type
    const newImages = fileArray.filter(file => file.type.startsWith('image/'));
    const newVideos = fileArray.filter(file => file.type.startsWith('video/'));

    setImages([...images, ...newImages]);
    setVideos([...videos, ...newVideos]);
  };

  const close = () => {
    setQuestionTitle('');
    setQuestionContent('');
    navigation.goBack()
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Ask a Public Question</Text>
  
      {/* Question Title */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.description}>
          Be specific and imagine you’re asking a question to another person.
        </Text>
        <TextInput
          placeholder="e.g. Python Looping"
          placeholderTextColor={'gray'}
          style={styles.textInput}
          value={questionTitle}
          onChangeText={(text) => setQuestionTitle(text)}
        />
      </View>
  
      {/* Question Content */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Question content</Text>
        <Text style={styles.description}>
          Introduce the problem and expand on what you put in the title.
        </Text>
        <TextInput
          value={questionContent}
          onChangeText={(text) => setQuestionContent(text)}
          placeholder="e.g. How do I use loops in Python?"
          placeholderTextColor={'gray'}
          style={styles.textInput}
        />
  
        {/* Post and Discard Buttons */}
        <View style={{ flexDirection: 'row' }}>
          {/* Post Button */}
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 10, marginRight: 10 }} onPress={() => sendMessage()}>
            <Text style={{ color: 'white', fontSize: 16, padding: 10 }}>Post your question</Text>
          </TouchableOpacity>
  
          {/* Discard Button */}
          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, borderColor: 'red', borderWidth: 1 }} onPress={() => close()}>
            <Text style={{ fontSize: 16, color: 'red', padding: 10 }}>discard draft</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  fileInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  uploadButtonContainer: {
    flex: 1,
    marginRight: 10,
  },
  hiddenInput: {
    display: 'none',
  },
  uploadedFilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  uploadedFile: {
    width: 100,
    height: 100,
    margin: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
    Set_currentRouteName
  };

  export default connect(mapStateToProps, mapDispatchToProps)(AskQuestion);