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
import CustomListItem from "../components/CustomListItem";
import AddChat from './AddChat';
import axios from 'axios';
import { connect } from 'react-redux';
import { Set_isAddChatModalVisible } from '../Redux/counterSlice';

const Home = ({
    navigation, route, ip,
    user_email, 
    user_name, 
    user_picture_url,
    isAddChatModalVisible, Set_isAddChatModalVisible,
    }) => {
  const [chats, setChats] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/chats`);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();

  }, [navigation, ip]);

  useEffect(() => {
    const updateFilteredChats = () => {
      const filteredChats = chats.filter((chat) =>
        chat.data.chatName.toLowerCase().includes(searchInput.toLowerCase())
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
      chat.data.chatName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredChats(filteredChats);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          {/* Profile Picture */}
          <TouchableOpacity activeOpacity={0.5} onPress={toggleDropdown}>
            <Avatar rounded source={{ uri: user_pictureUrl }} />
          </TouchableOpacity>

          {/* Search Icon */}
          <TouchableOpacity activeOpacity={0.5} onPress={handleSearchIconPress} style={{ marginLeft: 20 }}>
            <SimpleLineIcons name='magnifier' size={24} color="black" />
          </TouchableOpacity>

          {/* Animated Search Input */}
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
          {/* Camera Icon */}
          <TouchableOpacity activeOpacity={0.5} style={{ marginRight: 15 }}>
            <AntDesign name='camerao' size={24} color="white" />
          </TouchableOpacity>

          {/* Pencil Icon */}
          <TouchableOpacity activeOpacity={0.5} onPress={openModal}>
            <SimpleLineIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>

          {/* AddChat Modal */}
          <AddChat visible={isAddChatModalVisible} onClose={closeModal} user_email={user_email} />
        </View>
      )
    });
  }, [navigation, user_picture_url, isSearchOpen, searchInput, slideAnim]);

  return (
    <SafeAreaView style={styles.container}>
        {chats.length === 0 && <Text style={styles.noChatsText}>No chats available</Text>}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.chatsContainer}>
            {filteredChats.map((chat) => (
                    <TouchableOpacity key={chat.chat_name} onPress={() => navigation.navigate('Chat')} style={{marginVertical:20, marginRight: 25}}>
                        {console.log(chat)}
                  <CustomListItem chat_name={chat.chat_name} chat_image={chat.chat_image} />
              </TouchableOpacity>
            ))}
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
    backgroundColor: '#030303',
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
    backgroundColor: '#0d0c0c',
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: '#0d0c0c',
    borderWidth: 1,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#0d0c0c',
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: '#0d0c0c',
    borderWidth: 1,
    justifyContent: 'center', // Center the items horizontally
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
    user_pictureUrl:  state.user_profile.user_pictureUrl,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(Home);