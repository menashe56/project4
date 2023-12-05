import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
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
  const [backgroundColor, setBackgroundColor] = useState('')

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
    if(currentRouteName=='ChatQuestions'){
      setBackgroundColor('transparent')
    } else {
      setBackgroundColor('#0d0c0c')
    }
  }, [navigation, currentRouteName]);

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

  return (
    <View style={[styles.drawerContainer, {backgroundColor: backgroundColor,}]}>
      <View style={{ marginRight: 20, flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ paddingVertical: 12, paddingRight: 7, paddingLeft: 20}}
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
          style={{ paddingVertical: 12}}
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

        <View style={{ paddingVertical: 12,}}>
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
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  drawerContainer: {
    borderColor: '#0d0c0c',
    //borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  pencil: {
    borderRadius: 20,
    paddingVertical: 12,
    fontWeight: 'bold', // Adjust font weight as needed
    marginRight: 25,
    marginLeft: 'auto',
  },
  circularIcon: {
    backgroundColor: '#101211', // Spotify green color
    borderRadius: 80,
    padding: 5,
  },
  avatar: {
    paddingLeft: '20', // Adjust the margin left as needed
  },
});

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
