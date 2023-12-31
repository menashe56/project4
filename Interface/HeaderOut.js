import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, {useState,useEffect} from 'react'
import { AntDesign, SimpleLineIcons, Feather } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { Set_newChatVisible, Set_searchInput, Set_onSearch } from '../Redux/counterSlice';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Input } from 'react-native-elements';

const HeaderOut = ({newChatVisible, Set_newChatVisible, Set_searchInput, searchInput, Set_onSearch}) => {

  const navigation = useNavigation();

  const state = useNavigationState((state) => state);
  console.log('current screen : ', state)

  const close = () => {
    Set_newChatVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => { if (newChatVisible) { Set_newChatVisible(false); close(); } }}>
      <View style={{ backgroundColor: 'white', flex: 1, borderWidth: 1, borderColor: 'rgb(230, 232, 230)', flexDirection: 'row', alignItems: 'center', shadowColor: 'black', shadowRadius: 10, shadowOpacity: 0.26, shadowOffset: { width: 1, height: 2 } }}>
        <TouchableOpacity style={{ marginLeft: 5, borderRadius: 10, backgroundColor: 'blue' }}>
          <Text style={{ fontSize: 30, padding: 5, color: 'white' }}>Nolex Logo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingRight: 7, paddingLeft: 20 }} activeOpacity={0.5} onPress={() => { }}>
          <View style={styles.circularIcon}>
            <AntDesign name="left" size={24} style={{ color: '#2d2e2d' }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{}} activeOpacity={0.5} onPress={() => { }}>
          <View style={[styles.circularIcon, {}]}>
            <AntDesign name="right" size={24} style={{ color: '#2d2e2d' }} />
          </View>
        </TouchableOpacity>
        <Input placeholder='Search...' value={searchInput} onChangeText={(text) => { Set_searchInput(text); if (text.length !== 0) { Set_onSearch(true); } else { Set_onSearch(false); } }} leftIcon={<Icon name='magnifier' type="SimpleLineIcons" size={20} color="black" />} containerStyle={{ width: 700 }} style={{}} />
        <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 10, backgroundColor: 'white', borderRadius: 10, borderColor: 'blue', borderWidth: 1, }} activeOpacity={0.5} onPress={() => navigation.navigate('Register')}>
          <Text style={{ fontSize: 16, color: 'blue', padding: 10 }}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 10, backgroundColor: 'blue', marginRight: 10 }} activeOpacity={0.5} onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: 'white', padding: 10, fontSize: 16 }}>Log in</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
  
}

const styles = StyleSheet.create({});
  

const mapStateToProps = (state) => ({
    searchInput: state.Other.searchInput,
    newChatVisible: state.Modals.newChatVisible,
    onSearch: state.Other.onSearch
  });
  
  const mapDispatchToProps = {
    Set_newChatVisible,
    Set_searchInput,
    Set_onSearch,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(HeaderOut);