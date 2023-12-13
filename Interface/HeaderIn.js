import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Animated,
  TextInput,
} from 'react-native';
import { AntDesign, SimpleLineIcons, } from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { Set_user_email } from '../Redux/counterSlice';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HeaderIn = ({ user_picture, ip, Set_user_email,}) => {

  const navigation = useNavigation();

  const [picture, setPicture] = useState('')
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats`);
        const data = response.data
        setChats(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    if(ip!= '') { fetchChats();}
  }, [ip]);


  const signOutUser = async () => {
    try {
      await axios.post(`http://${ip}/api/sign-out`);
      Set_user_email('');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {

    const fetchUserPicture = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/getImage/${user_picture}`, {
        });// get the user_picture from the server files

        const data = response.data;
        setPicture(`data:image/jpeg;base64,${data.data.base64Image}`);
        console.log(response)

      } catch (error) {
        console.error('Error fetching chat :', error.message);
      }
    };

    fetchUserPicture();

  }, []);

  return (
    <View style={{ backgroundColor: 'white', flex: 1, borderWidth: 1, borderColor: 'rgb(230, 232, 230)', flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity style={{ marginLeft: 5, borderRadius: 10, backgroundColor: 'blue' }}>
        <Text style={{ fontSize: 18, padding: 5, color: 'white' }}>Nolex Logo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 5 }} activeOpacity={0.5} onPress={() => { }}>
        <View style={{}}>
          <Text style={{ fontSize: 14, color: '#2d2e2d' }}>New chat</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_picture: state.user_profile.user_picture,
  
    ip: state.Other.ip,
  });
  
  const mapDispatchToProps = {
    Set_user_email,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(HeaderIn);
  