import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Chat from './Chat';
import LeftSection from './leftSection';
import HeaderOut from './HeaderOut';
import AddChat from './AddChat';
import { connect } from 'react-redux';
import { user_email} from '../Redux/counterSlice';
import HeaderIn from './HeaderIn';

const Stack = createStackNavigator();

const globalScreenOptions = {
    headerShown: false,
  };

const Main = ({user_email}) => {
  return (
    <View style={styles.container}>
    {/* Left Section */}
    <View style={styles.leftSection}>
      <LeftSection />
    </View>
    <View style={{ flex: 3.3 }}>
      {/* Right Section */}
      <View style={[styles.rightSection, {}]}>
        {/* Header */}
        <View style={styles.header}>
            {console.log({user_email})}
            {user_email=='' ? <HeaderOut /> : <>
    <HeaderIn />
    <AddChat />
  </>}
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Stack.Navigator screenOptions={globalScreenOptions} initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="HeaderOut" component={HeaderOut} />
            <Stack.Screen name="HeaderIn" component={HeaderIn} />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Navigator>
        </View>
      </View>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'black',
        paddingVertical: 10,
      },
      leftSection: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 10,
      },
      rightSection: {
        flex: 1,
        paddingRight: 10,
      },
      header: {
        flex: 1,
      },
      headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      body: {
        flex: 7,
      },
})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
  });

  export default connect( mapStateToProps)(Main);