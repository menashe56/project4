import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';
import { useNavigation } from '@react-navigation/native';

const HeaderOut = ({}) => {
  
  const navigation = useNavigation();

  return (
    <View style={styles.drawerContainer}>
      <View style={{marginRight: 20, flexDirection: 'row', }}>

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

          <TouchableOpacity style={styles.signup} activeOpacity={0.5}  onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.Text, {color: '#5e5c57'}]}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.login} activeOpacity={0.5}  onPress={() => navigation.navigate('Login')}>
            <Text style={styles.Text}>Log in</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    drawerContainer : {
      borderRadius: 10,
      borderColor: '#0d0c0c',
      borderWidth: 1,
      flex: 1,
      backgroundColor: '#0d0c0c',
      justifyContent: 'center',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    login : {
      backgroundColor: 'white', // Spotify green color
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 30,
      fontWeight: 'bold', // Adjust font weight as needed
      fontSize: 16,
    },
    signup: {
      borderRadius: 20,
      paddingVertical: 12,
      marginLeft: 'auto', // Align to the right
      fontWeight: 'bold', // Adjust font weight as needed
      fontSize: 16,
      marginRight: 25
    },
    Text: {
      textAlign: 'center', 
      fontWeight: 'bold',
      fontSize: 16
    },
    circularIcon: {
    backgroundColor: '#101211',
    borderRadius: 80,
    //padding: 5 //do not remove
  },
})

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderOut);