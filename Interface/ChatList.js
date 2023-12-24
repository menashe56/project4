import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ChatList = ({ chat, ip }) => {
  const [chatQuestions, setChatQuestions] = useState([]);
  const [chatImage, setChatImage] = useState('');

  const chat_name = chat.chat_name;
  const chat_image = chat.chat_image;

  const navigation = useNavigation();

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

        const fetchChatImge = async () => { // get the image from the server files
          try {
            const response = await axios.get(`http://${ip}/api/getImage/${chat_image}`, {
            });
    
            const data = response.data;
            setChatImage(`data:image/jpeg;base64,${data.data.base64Image}`);
    
          } catch (error) {
            console.error('Error fetching chat :', error.message);
          }
        };
    
        fetchChatImge();
    
      }, [chat_image]);

      return (
        // Touchable container for the chat item
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { chat: { chat_name: chat_name, chat_image: chatImage, type: chat.type, timestamp: chat.timestamp }, question: chatQuestions[0] })}>
          <View style={styles.chatItemInside}>
            {chatImage &&  
              // Image background for the chat item
              <ImageBackground
                source={{ uri:  chatImage}}
                style={styles.chatImage}
              >
                {/* Chat name overlay */}
                <Text style={{fontSize: 16, color: 'white', fontWeight: '500', height: 30, position: 'absolute', left: 0, top: 0, backgroundColor: '#0c439c', padding: 5}}>
                  {chat_name}
                </Text>
                {/* Container for chat text */}
                <View style={styles.chatTextContainer}>
                  {/* Actual chat text */}
                  <Text style={[styles.overlayName, { color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }]} numberOfLines={1} adjustsFontSizeToFit>
                    {chatQuestions[0]?.question_content}
                  </Text>
                </View>
              </ImageBackground>
            }
          </View>
        </TouchableOpacity>
      );
      
    };
    
    const styles = StyleSheet.create({
        chatItemInside: {
            height: 180,
            width: 300,
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
    
    export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
    