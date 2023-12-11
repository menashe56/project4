import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import ImageColors from 'react-native-image-colors';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import ChatList3 from './ChatList3';

const ChatList2 = ({ chatType, chats, ip, }) => {
  const [chatQuestions, setChatQuestions] = useState([]);
  const [dominantColor, setDominantColor] = useState(null);
  const [chatImage, setChatImage] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  const navigation = useNavigation();

  const fetchChatImage = async (chat_image) => {
    try {
      console.log('chat_image : ',chat_image)
      const response = await axios.get(`http://${ip}/api/getImage/${chat_image}`, {
      });

      const data = response.data;
      return `data:image/jpeg;base64,${data.data.base64Image}`;
    } catch (error) {
      console.error('Error fetching chat :', error.message);
    }
  };

      return (
        <View style={{ }}>
        <TouchableOpacity style={{width: 300, height: 80}}>
        <ImageBackground
        source={{ uri:  chatType.image}}
        style={styles.chatImage}
      >         <View  style={{height: 30, position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(15, 15, 15, 0.8)', borderWidth: 2, borderColor: 'white', borderTopLeftRadius: 10, borderBottomRightRadius: 10, padding: 5}}>
                    <Text style={{fontSize: 16, color: 'white', fontWeight: '500', paddingLeft: 5 }}>{chatType.type}</Text>
                    </View>
              </ImageBackground>
        </TouchableOpacity>
        <View style={{}}>
        {chats.slice(0, 4).map((chat) => (
    <View key={chat.chat_name}  style={{ width: '33.33%', boxSizing: 'border-box' }}>
        <ChatList3 chat={chat}/>
  </View>
))}
        </View>
        </View>
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
    
    export default connect(mapStateToProps, mapDispatchToProps)(ChatList2);
    