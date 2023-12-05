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
} from 'react-native';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ChatList from './ChatList';
import { connect } from 'react-redux';
import { Set_isAddChatModalVisible, Set_currentRouteName } from '../Redux/counterSlice';
import ListMessages from '../components/ListMessages';
import ImageUploader from '../components/ImageUploader';
import ChatList2 from './ChatList2';

const Home = ({
    navigation, route, ip, Set_currentRouteName,
    user_email, 
    user_name, 
    user_picture,
    isAddChatModalVisible, Set_isAddChatModalVisible,
    }) => {
  const [chats, setChats] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [chatTypes, setChatTypes] = useState([])

  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    Set_currentRouteName('Home')
  }, [navigation]);

  useEffect(() => {
    const fetchChatTypes = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chatTypes`);
        const data = response.data
        setChatTypes(data);
        console.log(data)
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
        console.log(data)
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
      setFilteredChats(filteredChats);
    };

    updateFilteredChats();
  }, [chats, searchInput]);

  const handleSearchIconPress = () => {
    setIsSearchOpen(!isSearchOpen);

    Animated.timing(slideAnim, {
      toValue: isSearchOpen ? 1 : 0,
      duration: isSearchOpen ? 500 : 300, // Adjust the duration based on your preference
      useNativeDriver: false,
    }).start();
  };

  const handleSearchInputChange = (text) => {
    setSearchInput(text);
    const filteredChats = chats.filter((chat) =>
      chat.chat_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredChats(filteredChats);
  };
{/* 
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={toggleDropdown}>
            <Avatar rounded source={{ uri: user_pictureUrl }} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={handleSearchIconPress} style={{ marginLeft: 20 }}>
            <SimpleLineIcons name='magnifier' size={24} color="black" />
          </TouchableOpacity>

          <Animated.View style={{ marginLeft: 10, transform: [{ translateX: slideAnim }] }}>
            <TextInput
              placeholder="Search"
              style={{ fontSize: 16, color: 'black' }}
              onChangeText={(text) => handleSearchInputChange(text)}
              value={searchInput}
            />
          </Animated.View>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} style={{ marginRight: 15 }}>
            <AntDesign name='camerao' size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={openModal}>
            <SimpleLineIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>

          <AddChat visible={isAddChatModalVisible} onClose={closeModal} user_email={user_email} />
        </View>
      )
    });
  }, [navigation, user_picture, isSearchOpen, searchInput, slideAnim]);

*/}

return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={{flex:1}}>
        {chats.length === 0 && <Text style={styles.noChatsText}>No chats available</Text>}
          <View style={styles.chatsContainer}>
<View style={[styles.chatsList, {marginBottom: 150}]}>
  {filteredChats
    .slice(1, 4) // Get only the first four chats
    .map((chat) => (
      <TouchableOpacity
        key={chat.chat_name}
        style={{width: 300, height: 80, marginRight: 10}}
        onPress={() => navigation.navigate('ChatQuestions', { chat_name: chat.chat_name, chat_image: chat.chat_image })}
      >
        <ChatList chat_name={chat.chat_name} chat_image={chat.chat_image} />
      </TouchableOpacity>
    ))}
</View>
<View style={styles.chatsList}>
{chatTypes.map((chatType) => (
    <View style={{paddingRight: 10}}>
  <ChatList2
    key={chatType}
    chatType={chatType}
    chats={chats.filter((chat) => chat.type.includes(chatType.type))}
  />
  </View>
))}

</View>
          </View>
          </ScrollView>
    </SafeAreaView>
  );  
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "center",
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
});

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
    Set_isAddChatModalVisible,
    Set_currentRouteName,
  };

  export default connect(mapStateToProps, mapDispatchToProps)(Home);