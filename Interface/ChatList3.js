import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import ImageColors from 'react-native-image-colors';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

const ChatList3 = ({chat, ip, }) => {
  const [chatQuestions, setChatQuestions] = useState([]);
  const [dominantColor, setDominantColor] = useState(null);
  const [chatImage, setChatImage] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {

    const fetchChat = async () => {
      try {
        //console.log('chat_image : ',chat_image)
        const response = await axios.get(`http://${ip}/api/getImage/${chat.chat_image}`, {
        });

        const data = response.data;
        setChatImage(`data:image/jpeg;base64,${data.data.base64Image}`);

      } catch (error) {
        console.error('Error fetching chat :', error.message);
      }
    };

    fetchChat();

  }, [chat.chat_image]);

  useEffect(() => {

    const fetchChatQuestions = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats/${chat.chat_name}/questions`, {
        });

        const questions = response.data;
        setChatQuestions(questions);

      } catch (error) {
        console.error('Error fetching chat questions:', error.message);
      }
    };

    fetchChatQuestions();

  }, [chat.chat_name]);

      return (
        <TouchableOpacity style={{flex:1}} onPress={() => navigation.navigate('ChatQuestions', { chat_name: chat.chat_name, chat_image: chatImage })}>
        <View style={{marginVertical: 10, flexDirection: 'row' }}>
            <Avatar rounded source={{ uri: chatImage }} size={65} />
            <View style={{flexDirection: 'column'}}>
            <Text style={{marginLeft: 10, color: 'black', fontWeight: '500', fontSize: 16, marginBottom: 2, }}>{chat.chat_name}</Text>
            <Text style={{marginLeft: 10, color: 'black', fontSize: 14}}>{chatQuestions[0]?.question_content}</Text>
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
        borderRadius: 15, // Add border radius for a rounded appearance
        marginTop: 15,
        marginLeft: 10,
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
        marginTop: 5,
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
    