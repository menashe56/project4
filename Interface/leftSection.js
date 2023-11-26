import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome is used, replace it with the correct icon library
import { connect } from 'react-redux';
import { } from '../Redux/counterSlice';

const LeftSection = ({ user_email }) => {
    return (
    <View style={{flex: 1, flexDirection: 'row'}}>
    <View style={styles.drawerContainer}>
      <View style={{  backgroundColor: '#0d0c0c', flex: 1, paddingBottom: 15, borderRadius: 10, borderWidth: 1, }}>
        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="home" size={26} color="gray" style={styles.drawerIcon} />
          <Text style={styles.drawerText}>Home: {user_email}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="search" size={26} color="gray" style={styles.drawerIcon} />
          <Text style={styles.drawerText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="question-circle" size={26} color="gray" style={styles.drawerIcon} />
            <Text style={styles.drawerText}>Your Questions</Text>
          </TouchableOpacity>
        <TouchableOpacity style={[styles.drawerItem, { paddingLeft: 70 }]}>
          <Icon name="plus" size={26} color="gray" style={styles.drawerIcon} />
        </TouchableOpacity>
        </View>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    borderRadius: 10,
    borderColor: '#0d0c0c',
    borderWidth: 1,
    flex:1,
  },

  drawerIcon: {
    marginRight: 5,
  },
  drawerText: {
    color: 'gray',
    fontSize: 20,
  },
  contentContainer: {
    flex: 5,
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
    borderRadius: 10,
    borderColor: '#0d0c0c',
    borderWidth: 1,
  },
  chatItem: {
    height: 180,
    width: 180,
    backgroundColor: 'green',
    marginRight: 30,
    marginBottom: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align the avatar to the right
    padding: 10,
    backgroundColor: '#0d0c0c',
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: '#0d0c0c',
    borderWidth: 1,
    maxWidth: 1000, // Set a maximum width for the avatar container
    marginTop:7
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
  });
  
  const mapDispatchToProps = {
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(LeftSection);