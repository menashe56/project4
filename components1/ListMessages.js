import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import React, {useEffect} from 'react'

const ListMessages = ({message, calculateTimePassed}) => {

  return (
    <View style={styles.container}>
        <View style={{marginBottom: 5, marginLeft: 5}}>
            <Text style={{color: 'white', fontSize: 12, }}>{message.timestamp.substring(0, 9)} {message.timestamp.substring(11, 19)} {` (${calculateTimePassed(message.timestamp)} ago)`}</Text>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 10, marginLeft: 5}}>
        <TouchableOpacity activeOpacity={0.5}>
        <Avatar  rounded source={{ uri: message.sender_picture }} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 18, marginLeft: 5, marginTop: 5}}>{message.sender_name}</Text>
        </View>
      <Text style={{color:'white', marginLeft: 5}}>{message.message_content}</Text>
  </View>
);
}

export default ListMessages

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0d0c0c',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10, // Add padding to create some space between the content and the border
        shadowColor: 'gray',
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 4, // This is for Android elevation
      }
})