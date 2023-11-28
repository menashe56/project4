import { StyleSheet, View, Modal as ReactModal, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { connect } from 'react-redux';
import { Set_isAddChatModalVisible } from '../Redux/counterSlice';

const AddChat = ({isAddChatModalVisible,Set_isAddChatModalVisible, ip}) => {
  const [input, setInput] = useState("");
  const [chat_image, setChat_image] = useState("");

  const createChat = async () => {
    try {
      await axios.post(`http://${ip}/api/create-chat`, { chat_name: input, chat_image: chat_image });
      close()
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const close = () => {
      Set_isAddChatModalVisible(false)
      setInput('')
      setChat_image('')
  }

  return (
    <ReactModal transparent visible={isAddChatModalVisible} animationType="slide" >
    <View style={styles.container}>
    <MaterialIcons name='close' size={45} onPress={close} style={{paddingLeft: 750, paddingBottom: 40}}/>
      <Input
        placeholder='Enter a chat name'
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={<Icon name='wechat' type="antdesign" size={24} color="black" />}
      />
      <Input
        placeholder='Enter a chat image (optional)'
        value={chat_image}
        onChangeText={(text) => setChat_image(text)}
        onSubmitEditing={createChat}
        leftIcon={<Icon name='camera' type="antdesign" size={24} color="black" />}
      />
      <Button disabled={!input} title='Create new chat' onPress={createChat} />
    </View>
    </ReactModal>
  );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    width: windowWidth / 1.5, // Adjust the width as needed
    alignSelf: 'center', // Center the modal horizontally
    marginTop: windowHeight / 4, // Adjust the marginTop to position the modal vertically
    borderRadius: 10,
  },
});

const mapStateToProps = (state) => ({
    ip: state.Other.ip,
  
    isAddChatModalVisible: state.Modals.isAddChatModalVisible,
  });
  
  const mapDispatchToProps = {
    Set_isAddChatModalVisible
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(AddChat);
