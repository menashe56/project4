import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';
import ListMessages from './ListMessages';

const Chat = ({route, navigation, ip}) => {

const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [Answered, setAnswered] = useState('');

  useEffect(() => {

    const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://${ip}/api/chats/${route.params.question.chat_name}/questions/${route.params.question.question_id}/messages`);
          console.log(response)
          setMessages(response.data);
          if (response.data.length === 0) {
            setAnswered('Still not answered');
          } else {
            setAnswered(`Answered ${calculateTimePassed(response.data[0]?.timestamp)} ago`);
          }        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      if(ip!= '') { fetchMessages(); }
    
  }, [navigation, ip]);

  useEffect(() => {
    const updateFilteredMessages = () => {
    const filteredMessages = messages.filter((message) =>
    message.message_content.toLowerCase().includes(searchQuery.toLowerCase())
  );
      setFilteredMessages(filteredMessages);
    };
    updateFilteredMessages();
  }, [messages, searchQuery]);

  const sendMessage = async () => {
    Keyboard.dismiss();

    try {
      const response = await axios.post(`http://${ip}/api/chats/${route.params.question.chat_name}/questions/${route.params.question.question_id}/send-message`, {
        sender_email: user_email,
        message_content: input,
      });
      console.log(response)
      setInput('');
      console.log('message sent sucessfuly');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

    const calculateTimePassed = (timestamp) => {

        // Convert the timestamp string to a Date object
        const timestampDate = new Date(timestamp);
        
        // Get the current date and time
        const currentDate = new Date();
        
        // Calculate the time difference in milliseconds
        const timeDifference = currentDate - timestampDate;
        
        // Convert the time difference to seconds, minutes, hours, etc.
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if(days!==0){
            return days + ' days';
        } else if(hours!==0){
            return hours + ' hours';
        } else if(minutes!==0){
            return minutes + ' minutes';
        } else if(seconds!==0){
            return seconds + ' seconds';
        }}

    const question = route.params.question

    console.log(question)
  return (
    <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'flex-start'}}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{}} keyboardVerticalOffset={90}>
            <ScrollView>
            <View style={{margin: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar rounded source={{ uri: question.sender_picture }}  size={50}/>
                <Text style={{marginLeft: 5, fontSize: 30, fontWeight: '500', color: 'rgba(35, 36, 35, 0.9)'}}>{question.question_title}</Text>
                </View>
  <Text style={styles.metaInfo}>Asked {calculateTimePassed(question.timestamp)} ago   {Answered}   Viewed {} times</Text>
  <View style={styles.divider} />
  <Text style={{color: 'black', fontSize: 18}}>{question.question_content}</Text>
</View>
{filteredMessages.map(( message ) => (
                <View key={message.message_id} style={{marginLeft: 15, marginRight: 15}}>
                   <ListMessages message={message} calculateTimePassed={calculateTimePassed}/>
                </View>
              ))}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 10,
        marginLeft: 15,
      },
})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(Chat);