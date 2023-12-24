import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Button,
  ImageBackground
} from 'react-native';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ChatList from './ChatList';
import { connect } from 'react-redux';
import {Set_newChatVisible, Set_onSearch, Set_searchInput } from '../Redux/counterSlice';
import ChatList2 from './ChatList2';
import * as ImagePicker from 'expo-image-picker';
import OnSearch from './OnSearch';
import { useNavigationState } from '@react-navigation/native';


const Home = ({
    navigation, ip,
    newChatVisible, Set_newChatVisible,
    Set_onSearch, onSearch,
    Set_searchInput, searchInput,
    }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [chatTypes, setChatTypes] = useState([])
  const [chatName, setChatName] = useState('');
  const [chatImage, setChatImage] = useState(null);
  const [type, setType] = useState('');

  const state = useNavigationState((state) => state);
  console.log('current screen : ', state)

  useEffect(() => {
    const fetchChatTypes = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chatTypes`);
        const data = response.data
        setChatTypes(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    if(ip!= '') { fetchChatTypes();}
  }, [ip]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats`);
        const data = response.data
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    if(ip!= '') { fetchChats();}
  }, [ip]);

  useEffect(() => {
    const updateFilteredChats = () => {
      
      setFilteredChats(chats.filter((chat) =>      //filter the chats and split them into two dimension array by chat type
      chat.chat_name.toLowerCase().includes(searchInput.toLowerCase())
    ).reduce((result, filteredChat) => {
        const existingArray = result.find((arr) => arr[0]?.type === filteredChat.type);
      
        if (existingArray) {
          existingArray.push(filteredChat);
        } else {
          result.push([filteredChat]);
        }
      
        return result;
    }, []));

    };

    updateFilteredChats();

  }, [chats, searchInput]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library denied');
      }
    })();
  }, []);

  const handleChoosePhoto = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        setChatImage(selectedFile);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (!chatImage) {
        console.log('No photo selected');
        return;
      }
  
      const formData = new FormData();
      formData.append('photo', chatImage);
  
      const uploadResponse = await fetch(`http://${ip}/api/upload`, { //upload to server files in directory named uploads 
        method: 'POST',
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
      console.log('Upload Response:', uploadData);
  
      const imagePath = uploadData.imagePath;
  
      console.log('imagePath:', imagePath);

      const response = await axios.post(`http://${ip}/api/create-chat`, { chat_name: chatName, chat_image: imagePath.split('uploads/')[1], type: type});
      console.log('Create Chat Response:', response); // save the name of the file the database

      close(); 
    } catch (error) {
      console.error('Error handling photo upload:', error);
    }
  };

  const close = () => { // restart the inputs
    Set_newChatVisible(false);
    setChatName('');
    setType('');
    setChatImage(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => { if (newChatVisible) { Set_newChatVisible(false); close() } }}>
      <SafeAreaView style={styles.container}>
        {newChatVisible &&
          <View style={{ position: 'absolute', top: 15, left: 15, right: 0, bottom: 0, zIndex: 1, width: 180 }} onClick={(e) => e.stopPropagation()}>
            <View style={{ backgroundColor: 'white', borderColor: 'rgb(230, 232, 230)', borderWidth: 1, }}>
              <View style={{ backgroundColor: 'rgb(230, 232, 230)', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'blue' }}>Create new chat</Text>
              </View>
              <View style={{ padding: 10 }}>
                <Input
                  placeholder='Enter chat name'
                  value={chatName}
                  onChangeText={(text) => setChatName(text)}
                  leftIcon={<Icon name='wechat' type="antdesign" size={16} color="#333" />}
                  style={{ width: 100, fontSize: 12 }}
                />
                <Input
                  placeholder='Enter chat type'
                  value={type}
                  onChangeText={(text) => setType(text)}
                  leftIcon={<Icon name='group' type="MaterialIcons" size={16} color="#333" />}
                  style={{ width: 100, fontSize: 12 }}
                />
                <input type="file" accept="image/*" onChange={handleChoosePhoto} />
                {chatImage && (
                  <img src={URL.createObjectURL(chatImage)} alt="Selected" style={{ width: 30, height: 30 }} />
                )}
                <Button
                  disabled={!(chatName && type)}
                  title='Ask your first question'
                  onPress={() => { handleUploadPhoto(); close(); }}
                  buttonStyle={styles.createButton}
                  style={{}}
                />
              </View>
            </View>
          </View>}
        <ScrollView
          style={{ flex: 1 }}
        >
          {chats.length === 0 && <Text style={styles.noChatsText}>No chats available</Text>}
          {!onSearch ? (
            <View style={styles.chatsContainer}>
              <View style={[styles.chatsList, { marginBottom: 150 }]}>
                {chats
                  .slice(1, 4) // Get only the first three chats
                  .map((chat) => (
                    <TouchableOpacity
                      key={chat.chat_name}
                      style={{ width: 300, height: 80, marginRight: 10 }}
                      onPress={() => navigation.navigate('Chat', { chat })}
                    >
                      <ChatList chat={chat} />
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.chatsList}>
                {chatTypes.map((chatType) => (
                  <View key={chatType.type} style={{ paddingRight: 10 }}>
                    <ChatList2
                      chatType={chatType}
                      chats={chats.filter((chat) => chat.type.includes(chatType.type))}
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, padding: 16 }}>
              {filteredChats.map((filteredChatArray, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {filteredChatArray.map((filteredChat) => (
                      <TouchableOpacity key={filteredChat.chat_name} style={{ width: '48%', margin: '1%', borderRadius: 10, overflow: 'hidden', backgroundColor: 'white', elevation: 3 }} onPress={() => handleChatPress(filteredChat)}>
                        <View style={{ flexDirection: 'row', padding: 8 }}>
                          <OnSearch filteredChat={filteredChat} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
          <View style={{ marginTop: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRightWidth: 2, borderLeftWidth: 2, borderTopWidth: 2, height: 200, width: 900, borderRightColor: 'rgb(230, 232, 230)', borderLeftColor: 'rgb(230, 232, 230)', borderTopColor: 'rgb(230, 232, 230)', marginTop: 'auto' }}>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
  
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f1f2'
      },
      chatsContainer: {
        padding: 5,
        justifyContent: 'center',
      },
      chatsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      noChatsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'grey',
      },
    });
    

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    newChatVisible: state.Modals.newChatVisible,

    ip: state.Other.ip,
    onSearch: state.Other.onSearch,
    searchInput: state.Other.searchInput,
  });
  
  const mapDispatchToProps = {
    Set_newChatVisible,
    Set_onSearch,
    Set_searchInput,
  };

  export default connect(mapStateToProps, mapDispatchToProps)(Home);