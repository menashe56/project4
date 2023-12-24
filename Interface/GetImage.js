import { StyleSheet, Text, View,  } from 'react-native'
import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';
import { Avatar } from 'react-native-elements';

const GetImage = ({ Image, ip, size }) => {

    const [image, setImage] = useState('')

    useEffect(() => {

        const fetchImage = async () => {
          try {
            const response = await axios.get(`http://${ip}/api/getImage/${Image}`, {
            });
    
            const data = response.data;
            setImage(`data:image/jpeg;base64,${data.data.base64Image}`);
    
          } catch (error) {
            console.error('Error fetching chat :', error.message);
          }
        };

            fetchImage();

      }, [Image]);

  return (
    <View>
              <Avatar rounded source={{ uri: image }} size={size} />
    </View>
  )
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(GetImage);