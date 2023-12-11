import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';

const ChatLastTimestamp = ({question_id, chat_name, ip}) => {

    const [chatLastTimestamp, setChatLastTimestamp] = useState('')

    useEffect(() => {

        const fetchChatLastTimestamp = async () => {
            try {
              const response = await axios.get(`http://${ip}/api/chats/${chat_name}/questions/${question_id}/messages`);
              setChatLastTimestamp(response.data[response.data -1]?.timestamp);
              } catch (error) {
              console.error('Error fetching messages:', error);
            }
          };

          fetchChatLastTimestamp();
        
      }, [question_id, chat_name]);

  return (
    <View>
              <Text style={{marginLeft: 'auto', marginRight: 10, alignItems: 'flex-end', fontSize: 12, color: 'gray'}}>{chatLastTimestamp}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(ChatLastTimestamp);