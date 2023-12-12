import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  FlatList,
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
import {Set_newChatVisible, Set_isAddChatModalVisible, Set_currentRouteName, Set_onSearch, Set_searchInput, Set_twoDimensionalFilteredChatsArray } from '../Redux/counterSlice';
import ChatList2 from './ChatList2';
import * as ImagePicker from 'expo-image-picker';
import OnSearch from './OnSearch';
import { useNavigation, useNavigationState } from '@react-navigation/native';


const Home = ({
    navigation, ip,
    newChatVisible, Set_newChatVisible,
    Set_onSearch, onSearch,
    Set_searchInput, searchInput,
    }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
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
      const filteredChats = chats.filter((chat) =>
        chat.chat_name.toLowerCase().includes(searchInput.toLowerCase())
      );
      
      setFilteredChats(chats.filter((chat) =>
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
  
      const uploadResponse = await fetch(`http://${ip}/api/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
      console.log('Upload Response:', uploadData);
  
      const imagePath = uploadData.imagePath;
  
      console.log('imagePath:', imagePath);

      const response = await axios.post(`http://${ip}/api/create-chat`, { chat_name: chatName, chat_image: imagePath.split('uploads/')[1], type: type});
      console.log('Create Chat Response:', response);

      close();
    } catch (error) {
      console.error('Error handling photo upload:', error);
    }
  };

  const close = () => {
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
                  <View style={{ paddingRight: 10 }}>
                    <ChatList2
                      key={chatType}
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
                          <ImageBackground source={{ uri: filteredChat.type_image }} style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <View style={{ height: 30, backgroundColor: 'rgba(15, 15, 15, 0.8)', borderWidth: 2, borderColor: 'white', borderTopLeftRadius: 10, borderBottomRightRadius: 10, padding: 5 }}>
                              <Text style={{ fontSize: 16, color: 'white', fontWeight: '500', paddingLeft: 5 }}>{filteredChat.type}</Text>
                            </View>
                          </ImageBackground>
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
  leftContainer: {
    flex: 1,
    margin: 10,
    marginLeft: 10,
  },
  rightContainer: {
    flex: 3.5,
  },
  drawerContainer: {
    width: 285,
  },
  drawerItem: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 25,
  },
  drawerIcon: {
    marginRight: 5,
  },
  drawerText: {
    color: 'gray',
    fontSize: 20,
  },
  contentContainer: {
    flex: 10,
    backgroundColor: '#0d0c0c',
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: '#0d0c0c',
    borderWidth: 1,
    width: 285,
    marginTop: 10,
  },
  chatsContainer: {
    padding: 5,
    justifyContent: 'center', // Center the items horizontally
  },
  chatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chatItem: {
    height: 280,
    width: 200,
    borderRadius: 15, // Add border radius for a rounded appearance
    overflow: 'hidden', // Hide overflow content
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171716',
  },
  chatItemInside: {
    height: 185,
    width: 170,
    backgroundColor: 'blue',
    borderRadius: 15, // Add border radius for a rounded appearance
    marginBottom: 60,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  noChatsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'grey',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 15,
    // You can add additional styling properties here
  },
  drawerIcon: {
    marginRight: 10,
    // You can add additional styling properties here
  },

  drawerText: {
    color: 'gray',
    fontSize: 20,
    // You can add additional styling properties here
  },
  chatImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10, // Adjust the value based on your preference
    overflow: 'hidden', // This ensures that the borderRadius is applied
    justifyContent: 'flex-end',
  },
});

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,
    newChatVisible: state.Modals.newChatVisible,

    ip: state.Other.ip,
    onSearch: state.Other.onSearch,
    searchInput: state.Other.searchInput,
    twoDimensionalFilteredChatsArray: state.Other.twoDimensionalFilteredChatsArray,
  });
  
  const mapDispatchToProps = {
    Set_isAddChatModalVisible,
    Set_currentRouteName,
    Set_newChatVisible,
    Set_onSearch,
    Set_searchInput,
    Set_twoDimensionalFilteredChatsArray,
  };

  export default connect(mapStateToProps, mapDispatchToProps)(Home);