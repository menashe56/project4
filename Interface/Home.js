import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import CustomListItem from "../components/CustomListItem";
import axios from 'axios';

const Home = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://13.49.46.202/api/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [navigation]);

  const signOutUser = async () => {
    try {
      await axios.post('http://13.49.46.202/api/sign-out');
      navigation.replace("Login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            {/* Include your user avatar logic here */}
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginRight: 20,
        }}>
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name='camerao' size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("AddChat")}>
            <SimpleLineIcons name="pencil" size={24} color="black"/>
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, signOutUser]);

  const enterChat = (id, chatName,user_id) => {
    navigation.navigate('Chat', {
      id,
      chatName,
      user_id,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.length === 0 && <Text>No chats available</Text>}
        {chats.map(chat => (
          <CustomListItem key={chat.id} id={chat.id} chatName={chat.data.chatName} enterChat={enterChat} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
