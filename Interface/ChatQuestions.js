import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ImageBackground } from 'react-native';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import axios from 'axios';
import ImageColors from 'react-native-image-colors';

const ChatQuestions = ({ navigation, route, ip }) => {
  const [dominantColor, setDominantColor] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats/${route.params.chat_name}/questions`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    if (ip !== '') { fetchChats(); }
  }, [ip]);

  useEffect(() => {
    const getColorFromImage = async () => {
      try {
        const result = await ImageColors.getColors(route.params.chat_image, {
          fallback: '#000000',
          quality: 'high',
          numberOfColors: 3,
        });
        setDominantColor(result.lightVibrant);
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };

    getColorFromImage();
  }, [route.params.chat_image]);

  // Filtered questions based on the search query
  const filteredQuestions = questions.filter((question) =>
    question.question_content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.chat_image}>
          <ImageBackground source={{ uri: route.params.chat_image }} style={styles.chatImageBackground}>
            <View style={styles.chatTextContainer}>
              <View style={[styles.rectangleTop, dominantColor && { backgroundColor: dominantColor }]}></View>
              <Text style={styles.overlayName}>{route.params.chat_name}</Text>
            </View>
            <View style={[styles.rectangleBottom, dominantColor && { backgroundColor: dominantColor }]}></View>
          </ImageBackground>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', marginTop: 120, marginLeft: 20 }}>{route.params.chat_name}</Text>
        </View>
        <View style={styles.QuestionContainer}>
          {/* Search input with icon */}
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search questions"
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>

          {/* Render filtered questions */}
          {filteredQuestions.map((question) => (
            <TouchableOpacity
              key={question.question_id}
              onPress={() =>
                navigation.navigate('Chat', { question : question, chat_name: route.params.chat_name })
              }
              style={{ marginVertical: 5 }}
            >
              <View style={styles.question}>
                <Avatar rounded source={{ uri: question.sender_picture }} />
                <MaterialCommunityIcons name="comment-question" size={24} color="black" style={{ marginLeft: 10 }} />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Question </Text>
                <Text style={{ fontSize: 14, color: 'white' }}>| {question.question_title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  QuestionContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0d0c0c',
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: '#0d0c0c',
    borderWidth: 1,
    left: 0,
    justifyContent: 'flex-start'
  },
  question: {
    width: "100%",
    backgroundColor: '#5e5c57',
    borderRadius: 5,
    borderColor: 'gray',
    marginBottom: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5
  },
  scrollViewContent: {
    flex: 1,
  },
  chat_image: {
    justifyContent: 'flex-start',
    backgroundColor: '#1d1e1f',
    height: 300,
    flexDirection: 'row'
  },
  chatImageBackground: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 25,
    marginTop: 25,
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
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  overlayName: {
    marginLeft: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d1e1f',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({
  ip: state.Other.ip
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatQuestions);
