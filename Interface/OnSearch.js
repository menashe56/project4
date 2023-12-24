import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, {useState,useEffect} from 'react'
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const OnSearch = ({filteredChat, ip, }) => {

    const [chatImage, setChatImage] = useState('');

    const navigation = useNavigation();

  useEffect(() => {

    const fetchChatImge = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/getImage/${filteredChat.chat_image}`, {
        }); // get the image from the server files

        const data = response.data;
        setChatImage(`data:image/jpeg;base64,${data.data.base64Image}`);

      } catch (error) {
        console.error('Error fetching chat :', error.message);
      }
    };

    fetchChatImge();

  }, [filteredChat.chat_image]);

  return (
    // Main container for the component
    <View style={{ flex: 1 }}>
      {/* Container for the row layout */}
      <View style={{ flexDirection: 'row' }}>
        {/* Check if chatImage is available, and if true, display it */}
        {console.log(chatImage)}
        {chatImage && (
          <ImageBackground
            source={{ uri: chatImage }}
            style={{ width: 150, height: 150 }}
          >
            {/* This is the content of the ImageBackground, you can customize it further if needed */}
          </ImageBackground>
        )}
        {/* Display the chat name */}
        <Text>{filteredChat.chat_name}</Text>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    newChatVisible: state.Modals.newChatVisible,

    searchInput: state.Other.searchInput,
    ip: state.Other.ip,
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(OnSearch);