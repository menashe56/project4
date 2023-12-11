import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Animated,
  TextInput,
} from 'react-native';
import {
  AntDesign,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { Set_user_email, Set_isAddChatModalVisible, Set_isToggleDropdownModalVisible, Set_currentRouteName, } from '../Redux/counterSlice';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HeaderIn = ({
  user_picture, ip, currentRouteName,
  Set_user_email,
  Set_isAddChatModalVisible,
  isToggleDropdownModalVisible,
  Set_isToggleDropdownModalVisible,
}) => {
  const navigation = useNavigation();

  const [picture, setPicture] = useState('')
  const [chats, setChats] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

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


  const signOutUser = async () => {
    try {
      await axios.post(`http://${ip}/api/sign-out`);
      Set_user_email('');
      navigation.replace('Home');//fix
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {

    const fetchUserPicture = async () => {
      try {
        const response = await axios.get(`http://${ip}/api/getImage/${user_picture}`, {
        });

        const data = response.data;
        setPicture(`data:image/jpeg;base64,${data.data.base64Image}`);
        console.log(response)

      } catch (error) {
        console.error('Error fetching chat :', error.message);
      }
    };

    fetchUserPicture();

  }, []);

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

  const slideAnim = useRef(new Animated.Value(0)).current;

  return (
    <View style={{backgroundColor: 'white', flex:1, borderWidth: 1, borderColor: 'rgb(230, 232, 230)', flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{marginLeft: 5, borderRadius: 10, backgroundColor: 'blue', }}>
      <Text style={{fontSize: 18, padding: 5, color: 'white'}}>Nolex Logo</Text>
    </TouchableOpacity>

        <TouchableOpacity
          style={{ paddingRight: 7, paddingLeft: 20}}
          activeOpacity={0.5}
          onPress={() => {
            // Handle previous button press
          }}
        >
          <View style={styles.circularIcon}>
            <AntDesign name="left" size={24} style={{color: '#aeb8b3'}}/>
          </View>
        </TouchableOpacity>

        {/* Next Icon */}
        <TouchableOpacity
          style={{}}
          activeOpacity={0.5}
          onPress={() => {
            // Handle next button press
          }}
        >
          <View style={[styles.circularIcon, {}]}>
            <AntDesign name="right" size={24} style={{color: '#aeb8b3'}} />
          </View>
        </TouchableOpacity>

        {/* Pencil Icon */}
        <TouchableOpacity style={[styles.pencil, {}]} activeOpacity={0.5} onPress={() => Set_isAddChatModalVisible(true)}>
          <SimpleLineIcons name="pencil" size={24} color="white" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row'}}>
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

        <View style={{ marginLeft: 'auto', marginRight: 15}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => Set_isToggleDropdownModalVisible(true)}
            
          >
            <Avatar rounded source={{ uri: picture }} />
          </TouchableOpacity>
        </View>


        <TouchableWithoutFeedback onPress={() => Set_isToggleDropdownModalVisible(false)}>
          {/* Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isToggleDropdownModalVisible}
            onRequestClose={() => Set_isToggleDropdownModalVisible(false)}
          >
            {/* Modal Content */}
            <View style={{ justifyContent: 'flex-end', width: Dimensions.get('window').width / 9, alignSelf: 'center', marginRight: Dimensions.get('window').width / 2.5, marginTop: Dimensions.get('window').height / 2.4, height: Dimensions.get('window').height / 10 }}>
              <View style={{ backgroundColor: '#302d2d', padding: 10, borderRadius: 10, borderWidth: 1 }}>
                <FlatList
                  data={[
                    { key: 'Profile', onPress: () => console.log('Profile clicked') },
                    { key: 'Support', onPress: () => console.log('Support clicked') },
                    { key: 'Settings', onPress: () => console.log('Settings clicked') },
                    { key: 'Log Out', onPress: signOutUser },
                  ]}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={{ paddingVertical: 8, marginBottom: 10, width: '70%' }} onPress={item.onPress}>
                      <Text style={{ fontSize: 18, }}>{item.key}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
    
})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_picture: state.user_profile.user_picture,
    isToggleDropdownModalVisible: state.Modals.isToggleDropdownModalVisible,
  
    ip: state.Other.ip,
    currentRouteName: state.Other.currentRouteName,
  });
  
  const mapDispatchToProps = {
    Set_user_email,
    Set_isAddChatModalVisible,
    Set_isToggleDropdownModalVisible,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(HeaderIn);
  