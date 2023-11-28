import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View, Image} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import ImageColors from 'react-native-image-colors';

const CustomListItem = ({ chat_name, chat_image, ip }) => {
  const [chatQuestions, setChatQuestions] = useState([]);
  const [dominantColor, setDominantColor] = useState(null);

  useEffect(() => {

    const fetchChatQuestions = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats/${chat_name}/questions`, {
        });

        const questions = response.data;
        setChatQuestions(questions);

      } catch (error) {
        console.error('Error fetching chat questions:', error.message);
      }
    };

    fetchChatQuestions();

  }, [chat_name]);

useEffect(() => {
    const getColorFromImage = async () => {
      try {
        const result = await ImageColors.getColors(chat_image, {
          fallback: '#000000', // Default color if extraction fails
          quality: 'high',
          numberOfColors: 3,
        });
        console.log(chat_name,' : ' ,result)
        setDominantColor(result.lightVibrant);
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };

    getColorFromImage();
  }, [chat_image]);

  return (
    <View style={styles.chatItem}>
      <View style={styles.chatItemInside}>
        <ImageBackground source={{ uri: chat_image }} style={styles.chatImage}>
          <View style={styles.chatTextContainer}>
            <View style={[styles.rectangleTop, dominantColor && { backgroundColor: dominantColor }]}></View>
            <Text style={styles.overlayName}>{chat_name}</Text>
          </View>
          <View style={[styles.rectangleBottom, dominantColor && { backgroundColor: dominantColor }]}></View>
        </ImageBackground>
      </View>
      <Text style={styles.chat_name}>{chat_name}</Text>
      <Text style={styles.chat_question}>{chatQuestions[0]?.question_content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    height: 260,
    width: 190,
    borderRadius: 15, // Add border radius for a rounded appearance
    overflow: 'hidden', // Hide overflow content
    backgroundColor: '#171716',
  },
  chatItemInside: {
    height: 160,
    width: 160,
    backgroundColor: 'blue',
    borderRadius: 15, // Add border radius for a rounded appearance
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 10,
  },
  chatImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10, // Adjust the value based on your preference
    overflow: 'hidden', // This ensures that the borderRadius is applied
    justifyContent: 'flex-end',
  },
  chat_name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
  },
  chat_question: {
    color: 'grey',
    fontSize: 14,
    marginLeft: 15,
    marginTop: 10
  },
  rectangleBottom: {
    height: 7,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  rectangleTop: {
    height: 25,
    width: 7,
    right: 'auto',
    position: 'absolute',
    left: 0,
  },
  chatTextContainer: {
    marginBottom: 20,
  },
  overlayName: {
    marginLeft: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => ({
  ip: state.Other.ip,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomListItem);
