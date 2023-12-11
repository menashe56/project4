import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import React, {useState,useEffect} from 'react'
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { Set_twoDimensionalFilteredChatsArray } from '../Redux/counterSlice';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { Input } from 'react-native-elements';
import axios from 'axios';


const OnSearch = ({filteredChat, ip, Set_twoDimensionalFilteredChatsArray, twoDimensionalFilteredChatsArray}) => {

    const [chatImage, setChatImage] = useState('');

  const navigation = useNavigation();

  useEffect(() => {

    const fetchChatImge = async () => {
      try {
        //console.log('chat_image : ',chat_image)
        const response = await axios.get(`http://${ip}/api/getImage/${filteredChat.chat_image}`, {
        });

        const data = response.data;
        setChatImage(`data:image/jpeg;base64,${data.data.base64Image}`);

      } catch (error) {
        console.error('Error fetching chat :', error.message);
      }
    };

    fetchChatImge();

  }, [filteredChat.chat_image]);

  return (
    <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
            {    console.log(chatImage)
}
{chatImage &&  <ImageBackground
        source={{ uri:  chatImage}}
        style={{width: 150, height: 150}}>
              </ImageBackground>}
              <Text>{filteredChat.chat_name}</Text>
              </View>
              </View>
  )
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,
    newChatVisible: state.Modals.newChatVisible,

    searchInput: state.Other.searchInput,
    ip: state.Other.ip,
    twoDimensionalFilteredChatsArray: state.Other.twoDimensionalFilteredChatsArray,
  });
  
  const mapDispatchToProps = {
    Set_twoDimensionalFilteredChatsArray
  };

  export default connect(mapStateToProps, mapDispatchToProps)(OnSearch);