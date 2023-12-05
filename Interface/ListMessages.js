import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { Entypo, AntDesign } from "@expo/vector-icons";
import axios from 'axios';
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';

const ListMessages = ({ message, calculateTimePassed, ip, user_email }) => {

    const [islikeAnddislike, setIslikeAnddislike] = useState([message.likes > 0, message.dislikes > 0]);
    const [isLike, isDislike] = islikeAnddislike;
    console.log(message);

  const updateLikes = async () => {
    try {
      const response = await axios.put(`http://${ip}/api/messages/${message.message_id}/user/${user_email}/likes`);
      // Check if the update was successful
      if (response.data.success) {
        console.log('Likes updated successfully');
        console.log(response);
      } else {
        console.error('Failed to update likes');
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const updatedisLikes = async () => {
    try {
      const response = await axios.put(`http://${ip}/api/messages/${message.message_id}/user/${user_email}/dislikes`);
      // Check if the update was successful
      if (response.data.success) {
        console.log('disLikes updated successfully');
        console.log(response);
      } else {
        console.error('Failed to update dislikes');
      }
    } catch (error) {
      console.error('Error updating dislikes:', error);
    }
  };

  useEffect(() => {
    const islike = async () => {
        try {
          const response = await axios.put(`http://${ip}/api/messages/${message.message_id}/user/${user_email}/islike`);
          // Check if the update was successful
          const data = response.data
          if (data.islike) {
            setIslikeAnddislike([true, false])
          }else if (data.isdislike) {
            setIslikeAnddislike([false, true])
          } else {
            setIslikeAnddislike([false, false])
          }
          console.log(response);
        } catch (error) {
          console.error('Error getting islike:', error);
        }
      };
      islike();
  }, [message.likes, message.dislikes]);

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <TouchableOpacity activeOpacity={0.5}>
        <Avatar rounded source={{ uri: message.message_sender_picture }} />
        {/* Arrow pointing to the user's profile picture */}
      </TouchableOpacity>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: 'rgba(230, 232, 230,0.5)',
            flexDirection: 'row',alignItems: 'center',
          }}>
          <Text
            style={{ color: 'black', fontSize: 14, fontWeight: 'bold', marginLeft: 5, }}>
            {message.message_sender_name}{' '}
          </Text>
          <Text style={{ color: 'gray', fontSize: 12 }}>
            {' '}
            commented on {message.timestamp.substring(0, 9)}{' '}
            {message.timestamp.substring(11, 19)}{' '}
            ({`${calculateTimePassed(message.timestamp)} ago)`})
          </Text>
          <TouchableOpacity activeOpacity={0.5} style={{ position: 'absolute', right: 0, marginRight: 5 }}>
            <Entypo name='dots-three-horizontal' size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: 'black', marginLeft: 5 }}>
          {message.message_content}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, backgroundColor: 'rgba(230, 232, 230,0.5)', width: 100, borderRadius: 20, padding: 5 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={updatedisLikes}>
          {isDislike ? <AntDesign name="dislike1" size={24} style={{ marginRight: 5 }} /> : <AntDesign name="dislike2" size={24} style={{ marginRight: 5 }} />}
            <Text>{message.dislikes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={updateLikes}>
          {isLike ? <AntDesign name="like1" size={24} style={{ marginRight: 5 }} /> : <AntDesign name="like2" size={24} style={{ marginRight: 5 }} />}
            <Text>{message.likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    backgroundColor: 'white',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    shadowColor: 'gray',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4, // This is for Android elevation
    flex: 1
  },
});

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(ListMessages);