import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ChatList from './ChatList';
import { connect } from 'react-redux';
import {Set_newChatVisible, Set_isAddChatModalVisible, Set_currentRouteName } from '../Redux/counterSlice';
import {
    AntDesign,
    SimpleLineIcons,
    MaterialCommunityIcons,
    FontAwesome
  } from "@expo/vector-icons";
  import { useNavigation } from '@react-navigation/native';
import LeftSectionChats from './LeftSectionChats';

const LeftSection = ({ newChatVisible, Set_newChatVisible, user_email, ip}) => {

    const [type, setType] = useState('')
    const [savedQuestions, setSavedQuestions] = useState([])
    const [myQuestions, setMyQuestions] = useState([])
    const [myQuestionsChats , setMyQuestionsChats] = useState([])
    const [twoDimensionalQuestionsArray , setTwoDimensionalQuestionsArray] = useState([])

    const navigation = useNavigation();

    useEffect(() => {
        const fetchMyQuestions = async () => {
          try {
            const response = await axios.get(`http://${ip}/api/users/${user_email}/questions`);
            const data = response.data
            setMyQuestions(data);
            setMyQuestionsChats([...new Set(data.map(question => question.chat_name))]) // Remove duplicates using Set

            setTwoDimensionalQuestionsArray(response.data.reduce((result, question) => {
                const existingArray = result.find((arr) => arr[0]?.chat_image === question.chat_image);
              
                if (existingArray) {
                  existingArray.push(question);
                } else {
                  result.push([question]);
                }
              
                return result;
            }, []))

            console.log(data)
          } catch (error) {
            console.error('Error fetching my Questions:', error);
          }
        };

        if(user_email!= '') {
             fetchMyQuestions();
        }
      }, [user_email]);

    const close = () => {
        Set_newChatVisible(false);
      };

  return (
    <TouchableWithoutFeedback onPress={() => {if(newChatVisible){Set_newChatVisible(false); close()}}}>
    <View style={{backgroundColor: 'white', flex:1, borderWidth: 1, borderColor: 'rgb(230, 232, 230)', flexDirection: 'column' }}>
       <TouchableOpacity style={{flexDirection: 'row', marginTop: 15, marginBottom: 15, marginLeft:10}} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home" size={22} color="#2d2e2d" style={{}} />
          <Text style={{marginLeft: 5, fontSize: 16, color: '#2d2e2d', }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', marginLeft:10}}>
          <MaterialCommunityIcons name="message-question" size={22} color="#2d2e2d" style={{}} />
          <Text style={{marginLeft: 5, fontSize: 16, color: '#2d2e2d',}}>Questions</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 20, }}>
          <TouchableOpacity style={{flexDirection: 'row',marginLeft: 10}}>
            <FontAwesome name="question-circle" size={22} color="#2d2e2d" style={{}} />
            <Text style={{fontSize: 16, marginLeft: 5, color: '#2d2e2d'}}>My Library</Text>
          </TouchableOpacity>
        <TouchableOpacity style={[{ marginLeft: 'auto', marginRight: 5 }]}>
          <AntDesign name="plus" size={22} color="#2d2e2d" style={{}} />
        </TouchableOpacity>
        <TouchableOpacity style={[{ marginRight: 5 }]}>
          <MaterialCommunityIcons name="arrow-right" size={22} color="#2d2e2d" style={{}} />
        </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10, flexDirection: 'row', marginLeft: 5, justifyContent: 'center', marginRight: 5}}>
        <TouchableOpacity style={{backgroundColor: type =='My questions'? '#2d2e2d' : 'rgb(230, 232, 230)', borderRadius: 40, width: 85}}  onPress={() => setType('My questions')}>
            <Text style={{color: type =='My questions'? 'white' : 'black', padding: 7, fontSize: 12}}>My questions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: type =='Saved questions'? '#2d2e2d' : 'rgb(230, 232, 230)', borderRadius: 40, width: 100, marginLeft: 5, marginRight: 3}} onPress={() => setType('Saved questions')}>
            <Text style={{color: type =='Saved questions'? 'white' : 'black', padding: 7, fontSize: 12}}>Saved questions</Text>
        </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 15, }}>
        <TouchableOpacity style={{}}>
        <SimpleLineIcons name='magnifier' size={20} color="#2d2e2d" />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 'auto', marginRight: 5}}>
        <MaterialCommunityIcons name='filter-variant' size={20} color="#2d2e2d" />
        </TouchableOpacity>
        </View>
  { (type == '' || type == 'My questions') && 
  (<View style={{marginTop: 20, marginLeft: 10}}>
    {twoDimensionalQuestionsArray?.map((questionArray) => (
    <View style={{ marginBottom: 10 }} key={questionArray[0].question_id}>
      <LeftSectionChats questionArray={questionArray}/>
    </View>
  ))}
  </View>)}
    </View>
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,
    newChatVisible: state.Modals.newChatVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
    Set_newChatVisible,
  };

  export default connect(mapStateToProps, mapDispatchToProps)(LeftSection);