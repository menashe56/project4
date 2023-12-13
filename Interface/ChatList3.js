import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

const ChatList3 = ({chat, ip, }) => {
  const [chatQuestions, setChatQuestions] = useState([]);
  const [chatImage, setChatImage] = useState('');

  const chat_name = chat.chat_name;
  const chat_image = chat.chat_image;

  const navigation = useNavigation();

  useEffect(() => {

    const fetchChat = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/getImage/${chat_image}`, { // get the image from the server files
        });

        const data = response.data;
        setChatImage(`data:image/jpeg;base64,${data.data.base64Image}`);

      } catch (error) {
        console.error('Error fetching chat :', error.message);
      }
    };

    fetchChat();

  }, [chat_image]);

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

  return (
    // Touchable container for the chat item
    <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('Chat', { chat: { chat_name: chat_name, chat_image: chatImage, type: chat.type, timestamp: chat.timestamp } })}>
      {/* Container for the chat item */}
      <View style={{ marginVertical: 10, flexDirection: 'row' }}>
        {/* Display avatar if there is an image */}
        {chatImage && <Avatar rounded source={{ uri: chatImage }} size={65} />}
        
        {/* Container for text information */}
        <View style={{ flexDirection: 'column' }}>
          {/* Chat name */}
          <Text style={{ marginLeft: 10, color: 'black', fontWeight: '500', fontSize: 16, marginBottom: 2 }}>{chat_name}</Text>
          
          {/* Display the first question or a default message */}
          <Text style={{ marginLeft: 10, color: 'black', fontSize: 14 }}> {chatQuestions.length > 0 ? chatQuestions[0].question_content : 'No questions yet'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
    };
    
    const styles = StyleSheet.create({
        chatItemInside: {
          height: 180,
          width: 300,
          backgroundColor: 'gray',
          borderRadius: 15,
          marginTop: 15,
          marginLeft: 10,
          marginBottom: 10,
        },
        chatImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          borderRadius: 10,
          overflow: 'hidden',
          justifyContent: 'flex-end',
        },
        chat_name: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 18,
          marginLeft: 15,
        },
        chatTextContainer: {
          marginBottom: 20,
        },
        overlayName: {
          marginLeft: 5,
          color: 'white',
          fontSize: 17,
        },
      });
      
    const mapStateToProps = (state) => ({
      ip: state.Other.ip,
    });
    
    const mapDispatchToProps = {};
    
    export default connect(mapStateToProps, mapDispatchToProps)(ChatList3);
    