import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import axios from 'axios';

const CustomListItem = ({ id, chatName, entarChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get(`https://13.49.46.202/api/chats/${id}/messages`);
        const messages = response.data;
        setChatMessages(messages);
      } catch (error) {
        console.error('Error fetching chat messages:', error.message || 'Unknown error');
      }
    };

    fetchChatMessages();

    // Clean up the subscription or other resources if needed

  }, [id]);

  return (
    <ListItem onPress={() => entarChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri: chatMessages?.[0]?.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
