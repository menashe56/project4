import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const Chat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessage] = useState([]);

  const sendMessage = async () => {
    Keyboard.dismiss();

    try {
      // Make an HTTP POST request to your server to store the message in the MySQL database
      await axios.post('http://13.49.46.202/api/send-message', {
        chatId: route.params.id,
        message: input,
        userId: route.params.userId, // Assuming you have user information in route.params
      });

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useLayoutEffect(() => {
    const unSubscribe = axios.get(`http://13.49.46.202/api/chats/${route.params.id}/messages`)
      .then((response) => setMessage(response.data))
      .catch((error) => console.error('Error fetching messages:', error));

    return unSubscribe;
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Avatar rounded source={{ uri: messages[0]?.data.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{route.params.chatName}</Text>
          </View>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={navigation.goBack}>
          <AntDesign name='arrowleft' size={24} color='white' />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20, }}>
          <TouchableOpacity>
            <FontAwesome name='video-camera' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color='white' />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style='light' />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) => (
                data.userId === route.params.userId ? (
                  <View key={id} style={styles.reciver}>
                    <Avatar position="absolute" rounded bottom={-15} right={-5} size={30} source={{ uri: data.photoURL }} />
                    <Text style={styles.reciverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar position="absolute" rounded bottom={-15} right={-5} size={30} source={{ uri: data.photoURL }} />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              ))}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput placeholder='Signal Message' style={styles.textInput} value={input} onChangeText={(text) => setInput(text)} onSubmitEditing={sendMessage} />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2868E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  reciverText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  reciver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white"
  }
});