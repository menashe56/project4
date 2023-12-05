import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { connect } from 'react-redux';
import { Set_currentRouteName } from '../Redux/counterSlice';
import ListMessages from '../components/ListMessages';

const Chat = ({
  navigation, Set_currentRouteName,
  route,
  ip,
  user_picture_url,
  user_email,
  user_name,
  user_age,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [Answered, setAnswered] = useState('');

  useEffect(() => {
    Set_currentRouteName('Chat')
  }, [navigation]);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
          <View style={{ backgroundColor: '#0d0c0c', flex: 1,borderColor: '#0d0c0c' }}>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
            <View>
                <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Avatar rounded source={{ uri: route.params.sender_photo_url }} />
                <Text style={styles.questionTitle}>{route.params.question.question_title}</Text>
                </View>
  <Text style={styles.metaInfo}>Asked {calculateTimePassed(route.params.question.timestamp)} ago   {Answered}   Viewed {} times</Text>
  <View style={styles.divider} />
</View>
<View>
<Text style={{color: 'white', fontSize: 16, marginLeft: 15, marginBottom: 25}}>{route.params.question.question_content}</Text>
</View>
              {filteredMessages.map(( message ) => (
                <View key={message.message_id} style={{marginLeft: 15, marginRight: 15}}>
                   <ListMessages message={message} calculateTimePassed={calculateTimePassed}/>
                </View>
              ))}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput placeholder='Send Message' style={styles.textInput} value={input} onChangeText={(text) => setInput(text)} />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2868E6" />
              </TouchableOpacity>
            </View>
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  receiverText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiver: {
    padding: 15,
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    borderColor: 'gray',
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
    paddingBottom: 10,
  },
  metaInfo: {
    color: 'gray',
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 10,
    marginLeft: 15,
  },
});

const mapStateToProps = (state) => ({
  user_email: state.user_profile.user_email,
  user_name: state.user_profile.user_name,
  user_picture_url: state.user_profile.user_picture_url,
  user_age: state.user_profile.user_age,
  ip: state.Other.ip,
});

const mapDispatchToProps = {
    Set_currentRouteName
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
