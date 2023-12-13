import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ChatList3 from './ChatList3';

const ChatList2 = ({ chatType, chats, ip, }) => {
  const [chatImage, setChatImage] = useState('');

  const navigation = useNavigation();

  const fetchChatImage = async (chat_image) => {
    try {
      const response = await axios.get(`http://${ip}/api/getImage/${chat_image}`, {
      });

      const data = response.data;
      return `data:image/jpeg;base64,${data.data.base64Image}`;
    } catch (error) {
      console.error('Error fetching chat :', error.message);
    }
  };

  return (
    // Main container for the component
    <View style={{}}>
      {/* Featured chat type */}
      <TouchableOpacity style={{ width: 300, height: 80 }}>
        <ImageBackground
          source={{ uri:  chatType.image }}
          style={styles.chatImage}
        >
          {/* Overlay with chat type information */}
          <View style={{ height: 30, position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(15, 15, 15, 0.8)', borderWidth: 2, borderColor: 'white', borderTopLeftRadius: 10, borderBottomRightRadius: 10, padding: 5 }}>
            <Text style={{ fontSize: 16, color: 'white', fontWeight: '500', paddingLeft: 5 }}>{chatType.type}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
  
      {/* List of recent chats */}
      <View style={{}}>
        {chats.slice(0, 4).map((chat) => (
          <View key={chat.chat_name} style={{ width: '33.33%', boxSizing: 'border-box' }}>
            {/* Render each chat item using the ChatList3 component */}
            <ChatList3 chat={chat} />
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
    