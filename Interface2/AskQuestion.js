import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import { Set_currentRouteName } from '../Redux/counterSlice';

const AskQuestion = ({ Set_currentRouteName }) => {
  const [input, setInput] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    Set_currentRouteName('AskQuestion');
  }, []);

  const onFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);

    // Separate files into images and videos based on file type
    const newImages = fileArray.filter(file => file.type.startsWith('image/'));
    const newVideos = fileArray.filter(file => file.type.startsWith('video/'));

    setImages([...images, ...newImages]);
    setVideos([...videos, ...newVideos]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ask a Public Question</Text>
      <View style={[styles.inputContainer, { marginBottom: 20 }]}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.description}>
          Be specific and imagine you’re asking a question to another person.
        </Text>
        <TextInput
          placeholder="e.g. Python Looping"
          placeholderTextColor={'gray'}
          style={styles.textInput}
          value={input}
          onChangeText={(text) => setInput(text)}
        />
      </View>
      <View style={[styles.inputContainer]}>
        <Text style={styles.label}>Question content</Text>
        <Text style={styles.description}>
          Introduce the problem and expand on what you put in the title. Minimum 20 characters.
        </Text>
        <TextInput
          placeholder="e.g. How do I use loops in Python?"
          placeholderTextColor={'gray'}
          style={styles.textInput}
          value={questionContent}
          onChangeText={(text) => setQuestionContent(text)}
        />
        <View style={styles.fileInputContainer}>
          <label>
            Upload Images
            <input type="file" accept="image/*" onChange={onFileChange} multiple />
          </label>
          <label>
            Upload Videos
            <input type="file" accept="video/*" onChange={onFileChange} multiple />
          </label>
        </View>
        <View style={styles.uploadedFilesContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: URL.createObjectURL(image) }} style={styles.uploadedFile} />
          ))}
          {videos.map((video, index) => (
            <video key={index} controls style={styles.uploadedFile}>
              <source src={URL.createObjectURL(video)} type={video.type} />
            </video>
          ))}
        </View>
        {/*/ fix */}
        <View style={{marginTop: 20, position: 'absolute', left: 0}}>
        <Button title='Post your question' />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0d0c0c',
  },
  title: {
    color: '#4f4d4d',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#8a8787',
    borderRadius: 10,
    shadowColor: '#8a8787',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f4d4d',
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
  },
  fileInputContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  uploadedFilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  uploadedFile: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

const mapStateToProps = (state) => ({
  // ... (your mapStateToProps)
});

const mapDispatchToProps = {
  Set_currentRouteName,
};

export default connect(mapStateToProps, mapDispatchToProps)(AskQuestion);
