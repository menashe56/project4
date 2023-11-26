import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, View } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';

const CustomListItem = ({ chat_name, chat_image, ip }) => {

  const [chatQuestions, setchatQuestions] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const fetchChatQuestions = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats/${chat_name}/questions`, {
          cancelToken: cancelTokenSource.token,
        });

        const questions = response.data;
        setchatQuestions(questions);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching chat messages:', error.message || 'Unknown error');
        }
      }
    };

    fetchChatQuestions();

    return () => {
      cancelTokenSource.cancel('Component unmounted');
    };
  }, [chat_name]);

  return (

    <View style={styles.chatItem}>
        <Text></Text>
    <View style={styles.chatItemInside}>
    <ImageBackground source={{ uri: chat_image }} style={styles.chatImage}>
      <View style={styles.chatTextContainer}>
      </View>
    </ImageBackground>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    height: 180,
    width: 180,
  },
  chatItem: {
    height: 280,
    width: 200,
    borderRadius: 15, // Add border radius for a rounded appearance
    overflow: 'hidden', // Hide overflow content
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171716',
  },
  chatItemInside: {
    height: 185,
    width: 170,
    backgroundColor: 'blue',
    borderRadius: 15, // Add border radius for a rounded appearance
    marginBottom: 60,
  },
  chatNameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatImage: {
    flex: 1,
    resizeMode: 'cover', // Ensure the image covers the entire container
    justifyContent: 'flex-end',
  },
  chatTextContainer: {
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});

const mapStateToProps = (state) => ({
    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(CustomListItem);