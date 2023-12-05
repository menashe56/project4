import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ImageBackground, Button } from 'react-native';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import axios from 'axios';
import ImageColors from 'react-native-image-colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Set_currentRouteName, Set_lighterColor } from '../Redux/counterSlice';

const ChatQuestions = ({ navigation, route, ip, Set_currentRouteName, Set_lighterColor }) => {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollOffset, setScrollOffset] = useState(0);

  const color = `rgb(${255 - scrollOffset}, ${255 - scrollOffset}, ${255 - scrollOffset})`;

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    setScrollOffset(offset);
  };


  const dominantColor = route.params.dominantColor;
  const chat_name = route.params.chat_name;
  const chat_image = route.params.chat_image;

  const originalColor = dominantColor;
  const lighterColor = lightenColor(originalColor, 0.7);
  Set_lighterColor(lighterColor)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats/${chat_name}/questions`);
        console.log(response)
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    if (ip !== '') { fetchChats(); }
  }, [ip]);

  useEffect(() => {
    Set_currentRouteName('ChatQuestions')
  }, [navigation]);

  // Filtered questions based on the search query
  const filteredQuestions = questions.filter((question) =>
    question.question_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function lightenColor(color, factor) {
    // Ensure the factor is within the valid range (0 to 1)
    factor = Math.min(1, Math.max(0, factor));
  
    // Convert the color to HSL
    let [h, s, l] = colorToHSL(color);
  
    // Increase the lightness
    l += (1 - l) * factor;
  
    // Convert back to RGB
    return hslToColor(h, s, l);
  }
  
  function colorToHSL(color) {
    // Extract RGB values
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
  
    // Find the min and max values to determine the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
  
    // Calculate the lightness
    const l = (max + min) / 2;
  
    // Calculate the saturation
    const delta = max - min;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
    // Calculate the hue
    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / delta + 2) / 6;
      else h = ((r - g) / delta + 4) / 6;
    }
  
    return [h, s, l];
  }
  
  function hslToColor(h, s, l) {
    // Calculate RGB values from HSL
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
  
    const r = hueToRGB(p, q, h + 1 / 3);
    const g = hueToRGB(p, q, h);
    const b = hueToRGB(p, q, h - 1 / 3);
  
    // Convert RGB values to hexadecimal
    const toHex = (value) => Math.round(value * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  function hueToRGB(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

    const fetchSenderQuestionPicture = async (picture) => {
      try {
        const response = await axios.get(`http://${ip}/api/getImage/${picture}`, {
        });

        const data = response.data;
        return `data:image/jpeg;base64,${data.data.base64Image}`;

      } catch (error) {
        console.error('Error fetching Sender Question Picture :', error.message);
      }
    };

  return (
    <ScrollView onScroll={handleScroll} scrollEventThrottle={10} style={{ flex: 1 }}>
        <View style={styles.chat_image}>
          <ImageBackground source={{ uri: chat_image }} style={styles.chatImageBackground}>
            <View style={styles.chatTextContainer}>
              <View style={[styles.rectangleTop, dominantColor && { backgroundColor: dominantColor }]}></View>
              <Text style={[styles.overlayName, dominantColor && { color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }]} numberOfLines={1} adjustsFontSizeToFit>{chat_name}</Text>
            </View>
            <View style={[styles.rectangleBottom, dominantColor && { backgroundColor: dominantColor }]}></View>
          </ImageBackground>
          <Text style={{ fontSize: 75, fontWeight: 'bold', color: 'white', marginTop: 120, marginLeft: 20 }}>{chat_name}</Text>
        </View>
        <View style={styles.QuestionContainer}>
          <View style={{flexDirection: 'row'}}>
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
          <View style={{ position: 'absolute', right:0 }}>
  <TouchableOpacity 
    style={{backgroundColor: 'lightblue'}}
    onPress={() => navigation.navigate('AskQuestion', chat_name)}
  >
    <Text style={{ color: 'white', fontWeight: 'bold', paddingHorizontal: 5, paddingVertical: 5, fontSize: 20, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }} numberOfLines={1} adjustsFontSizeToFit >Ask Question</Text>
  </TouchableOpacity>
</View>
          </View>
          {/* Render filtered questions */}
          {filteredQuestions.map((question) => (
            <TouchableOpacity
              key={question.question_id}
              onPress={() =>
                navigation.navigate('Chat', {question})
              }
              style={{ marginVertical: 5 }}
            >
              <View style={styles.question}>
                {question.sender_picture &&<Avatar rounded source={{ uri: fetchSenderQuestionPicture(question.sender_picture) }} />}
                <MaterialCommunityIcons name="comment-question" size={24} color="black" style={{ marginLeft: 10 }} />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Question </Text>
                <Text style={{ fontSize: 14, color: 'white' }}>| {question.question_title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#030303',
  },
  QuestionContainer: {
    flex: 1,
    flexDirection: 'column',  // Add this line to make sure flexDirection is column
    padding: 10,
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    left: 0,
    justifyContent: 'space-between',  // Change this line
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
    flex: 1,backgroundColor: 'black'
  },
  chat_image: {
    justifyContent: 'flex-start',
    height: 300,
    flexDirection: 'row',    backgroundColor: 'transparent',

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
    backgroundColor: '#1d1e1f',
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'flex-start',  // Change this line
    alignItems: 'center',  // Add this line
    width: 700,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    color: 'white',
    fontSize: 16,
    width: 700,
  },
});

const mapStateToProps = (state) => ({

  ip: state.Other.ip
});

const mapDispatchToProps = {
    Set_currentRouteName,
    Set_lighterColor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatQuestions);
