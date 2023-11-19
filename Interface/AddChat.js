import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios'; // Import axios for making HTTP requests

const AddChat = ({ navigation }) => {
  const [input, setInput] = useState("");

  const createChat = async () => {
    try {
      // Make a POST request to your server API endpoint for creating a new chat
      const response = await axios.post('http://13.49.46.202/api/create-chat', {
        chatName: input,
      });

      if (response.data.success) {
        navigation.goBack();
      } else {
        console.error('Error creating chat:', response.data.error);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Input
        placeholder='Enter a chat name'
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={<Icon name='wechat' type="antdesign" size={24} color="black" />}
      />
      <Button disabled={!input} title='Create new chat' onPress={createChat} />
    </View>
  );
};

export default AddChat

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%"
  },
});
