import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, Feather, SimpleLineIcons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';
import ListMessages from './ListMessages';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import ChatLastTimestamp from './ChatLastTimestamp';
import GetImage from './GetImage';
import WebSocket from 'react-native-websocket';

const Chat = ({route, navigation, ip, user_email, user_picture}) => {

// Use useRef to persist the socket object across renders
const socketRef = useRef(null);

useEffect(() => {
    if (!socketRef.current) {
      const socket = new WebSocket('ws://16.16.28.132');

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        setSocketConnected(true);
      };

      socket.onmessage = (event) => {
        // Handle incoming messages
      const data = JSON.parse(event.data);
      // Update state or perform actions based on the received data
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log('Received WebSocket message:', data);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setSocketConnected(false);
      };

      socketRef.current = socket; // Assign the socket to the ref
    }

    return () => {
      // Clean up the WebSocket connection on component unmount
      if (socketRef.current && typeof socketRef.current.close === 'function') {
        socketRef.current.close();
      }
    };
  }, [setMessages, setAnswered]);



    const [editorValue, setEditorValue] = useState('');

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  const [messages, setMessages] = useState([]);
  const [searchQuestionsQuery, setSearchQuestionsQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [Answered, setAnswered] = useState('');
  const [chatQuestions, setChatQuestions] = useState([]);
  const [filteredChatQuestions, setFilteredChatQuestions] = useState([]);
  const [Question, setQuestion] = useState(route.params.question || '');
  const [questionsSearch, setQuestionsSearch] = useState('')
  const [socketConnected, setSocketConnected] = useState(false);

  const chat_name = route.params.chat.chat_name

  useEffect(() => {
    const fetchChatQuestions = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats/${chat_name}/questions`);
        console.log('chatQuestions',response)
        setChatQuestions(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChatQuestions();
  }, []);

  useEffect(() => {
    const updateFilteredChatQuestions = () => {
      if (questionsSearch.trim() === '') {
        setFilteredChatQuestions(chatQuestions);
      } else {
        const filteredQuestions = chatQuestions.filter((question) =>
          question.question_title.toLowerCase().includes(questionsSearch.toLowerCase())
        );
        setFilteredChatQuestions(filteredQuestions);
      }
    };
  
    updateFilteredChatQuestions();
  }, [chatQuestions, questionsSearch]);
  

  useEffect(() => {
    const isQuestionInChatQuestions = filteredChatQuestions.some((q) => q.question_id === Question.question_id);

    if (!isQuestionInChatQuestions) {
      setChatQuestions((prevChatQuestions) => [Question, ...prevChatQuestions]);
    }

    if (Question !== '') {
      // Fetching messages initially
      const fetchInitialMessages = async () => {
        try {
          const response = await axios.get(`http://${ip}/api/chats/${Question.chat_name}/questions/${Question.question_id}/messages`);
          setMessages(response.data.reverse());
          if (response.data.length === 0) {
            setAnswered('Still not answered');
          } else {
            setAnswered(`Answered ${calculateTimePassed(response.data[0]?.timestamp)} ago`);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchInitialMessages();

      const intervalId = setInterval(fetchInitialMessages, 1000);

      return () => clearInterval(intervalId); // Clean up interval on component unmount

    }
  }, [navigation, Question, setMessages, setAnswered, filteredChatQuestions]);

{/*
  useEffect(() => {
    const updateFilteredMessages = () => {
    const filteredMessages = messages.filter((message) =>
    message.message_content.toLowerCase().includes(searchQuery.toLowerCase())
  );
      setFilteredMessages(filteredMessages);
    };
    updateFilteredMessages();
  }, [messages, searchQuery]);
*/}

  const sendMessage = async () => {
    Keyboard.dismiss();
  
    try {
    
      // Make the API call
      const response = await axios.post(`http://${ip}/api/chats/${chat_name}/questions/${Question.question_id}/send-message`, {
        sender_email: user_email,
        message_content: editorValue,
      });

      setMessages((prevMessages) => [...prevMessages, response.data.message[0]]);

      setEditorValue('');

      console.log('send message response: ',response)
  
      // If the API call is successful, update the UI with the actual response
      //setMessages(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error and possibly revert the optimistic update
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
<View style={{backgroundColor: '#f0f1f2',  flex: 1, justifyContent: 'flex-start', flexDirection: 'row',     overflow: 'hidden', position: 'relative' }}>

      {/* Left Side - Question List */}
      <View style={{ flex: 1, flexDirection: 'column', overflow: 'hidden', position: 'relative'}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', width: '96.1%', backgroundColor: 'rgba(230, 232, 230,1)'}}>
            <View style={{marginLeft: 10}}>
        {user_email? (<GetImage Image={user_picture} size={45} />) : (<Avatar rounded source={{ uri: user_picture }} size={30} />)}
        </View>
        <TouchableOpacity style={{marginLeft: 'auto', marginRight: 10}} >
            <Feather name="menu" size={24} style={{color: '#7a7d80'}}/>
        </TouchableOpacity>
        <View style={{width: 1,height: '100%', backgroundColor: 'rgba(230, 232, 230,1)', marginRight: 10}}/>
        </View>
        <View style={styles.Search}>
            <View style={{ flexDirection: 'row', backgroundColor: "#ECECEC",borderRadius: 10, width: "90%", alignItems: 'center', marginRight: 10 }}>
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage} style={{marginLeft: 10, marginRight: 10}}>
                <SimpleLineIcons name='magnifier' size={16} color="#7a7d80"  />
              </TouchableOpacity>
              <TextInput placeholder='Search' style={styles.textInput} value={questionsSearch} onChangeText={(text) => setQuestionsSearch(text)} />
              </View>
              <TouchableOpacity style={{marginLeft: 'auto', marginRight: 5}}>
                 <MaterialCommunityIcons name='filter-variant' size={20} color="#7a7d80" />
              </TouchableOpacity>
            </View>
        <ScrollView style={{flex: 7.5}}>
         <View  style={{ position: 'absolute'}}>
        {filteredChatQuestions.map((question) => (
          <TouchableOpacity
            key={question.question_id}
            onPress={() => { setQuestion(question);}}
            style={{marginBottom: 1}}
          >
            {/* Question Card */}
            <View style={{ flexDirection: 'row',  backgroundColor: 'white', paddingVertical: 10}}>
              {/* Avatar */}
              <GetImage Image={question.sender_picture} size={40}/>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row'}}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', marginLeft: 10 }} numberOfLines={1} ellipsizeMode="tail"> {question.question_title} </Text>
              <ChatLastTimestamp question_id={question.question_id} chat_name={chat_name}/>
              </View>
              <Text style={{ fontSize: 14, color: 'gray', marginLeft: 10 }} numberOfLines={1} > {question.question_content}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>
      </View>

      {/* Right Side - Selected Question and Messages */}
      <View style={{ overflow: 'hidden', position: 'relative',flex: 2}}>
        <View style={{flex:1, backgroundColor: 'rgba(230, 232, 230,1)',}}>
      <View style={{ flexDirection: 'row', marginBottom: 10, flex: 1,  }}>
        <View style={{marginRight: 5, marginLeft: 10, marginTop: 5}}>
         <GetImage Image={Question.sender_picture} size={45} />
       </View>
      <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 5}}>
        <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: '500', color: 'rgba(35, 36, 35, 0.9)' }}>
          {Question.question_title}
        </Text>
        <Text style={{ color: 'gray', fontSize: 14, marginLeft: 5 }}>
        Asked {calculateTimePassed(Question.timestamp)} ago {Answered} Viewed {} times
      </Text>
      </View>
      <View style={{flexDirection: 'row', position: 'absolute', right: 10, marginTop: 5, alignItems: 'center'}}>
      <SimpleLineIcons name='magnifier' size={22} color="#7a7d80" />
      <MaterialCommunityIcons name='dots-vertical' size={24} color={'#7a7d80'} style={{marginRight: 15, marginLeft: 15}}/>
      <TouchableOpacity
          style={{ backgroundColor: 'blue', borderRadius: 10, }}
          onPress={user_email === '' ? () => navigation.navigate('Login') : () => navigation.navigate('AskQuestion', {chat: route.params.chat, chat_name: route.params.chat.chat_name })}
        >
          <Text style={{ fontSize: 16, color: 'white', padding: 10 }}>Ask Question</Text>
        </TouchableOpacity>
        </View>
      <View style={styles.divider} />
    </View>
    </View>
        <ScrollView style={{flex:8.5}}>
      {Question !== '' && (
  <View style={{ overflow: 'hidden', flex:1, position:'absolute' , left: 0, right: 0, top: 0, bottom: 'auto'}}>
    {/* Header with Question Title */}
    
    <View style={{ flex: 1, }}>
      {/* Question Content */}
      <Text style={{ color: 'black', fontSize: 18, marginBottom: 40, marginTop: 30, marginLeft: 10 }}>{Question.question_content}</Text>

      {/* Messages */}
      {messages.map((message) => (
        <View key={message.message_id} style={{ marginLeft: 15, marginRight: 15 }}>
          <ListMessages message={message} calculateTimePassed={calculateTimePassed} />
        </View>
      ))}

      {/* Editor Section */}
      <View style={{ marginTop: 'auto',  backgroundColor: 'white', marginRight: 20, marginLeft: 20, marginTop: 30, height: 170}}>
        <ReactQuill value={editorValue} onChange={handleEditorChange} placeholder="Type something..." style={{height: 130}}/>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginBottom: 200, marginTop: 15, marginLeft: 15 }}>
    <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 10 }} onPress={() => { sendMessage(); }}>
      <Text style={{ color: 'white', fontSize: 16, padding: 10 }}>Post Your Answer</Text>
    </TouchableOpacity>
  </View>

    </View>
  </View>
)}
</ScrollView>

      </View>
    </View>

  )
}

const styles = StyleSheet.create({
    divider: {
        height: 0,
        backgroundColor: 'rgba(230, 232, 230,1)',
        marginTop: 5,
        width: 500,
      },
      chatImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10, // Adjust the value based on your preference
        overflow: 'hidden', // This ensures that the borderRadius is applied
        justifyContent: 'flex-end',
      },
      Search: {
        alignItems: "center",
        width: "96.1%",
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingVertical: 5,
        marginBottom: 1,
      },
      textInput: {
        bottom: 0,
        height: 35,
        flex: 1,
        padding: 10,
        color: "grey",
        borderRadius: 10,
        width: "100%",
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