import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { connect } from 'react-redux';
import { Set_ip, } from '../Redux/counterSlice';
import Home from './Home';
import AskQuestion from './AskQuestion';
import Chat from './Chat';
import HeaderOut from './HeaderOut';
import HeaderIn from './HeaderIn';
import LeftSection from './LeftSection'
import OnSearch from './OnSearch';

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerShown: false,
};

const MainApp = ({Set_ip, ip, user_email}) => {

    const state = useNavigationState((state) => state);
    console.log(state)

  useEffect(() => {
    Set_ip("16.16.28.132");
    console.log(ip)
  }, [ip]);

  const headerComponent = user_email !== '' ? <HeaderIn /> : <HeaderOut />;

  return (
    <View style={styles.container}>
        <View style={{ flex: 1 }}>
            {state?.routes[state?.routes?.length -1]?.name!=='Chat' &&
          <View style={styles.header}>{headerComponent}</View>}

          <View style={styles.bodySection}>
            {state?.routes[state?.routes?.length -1]?.name!=='Chat' &&
             <View style={styles.leftSection}>
              <LeftSection /> 
            </View>}

            <View style={styles.rightSection}>
              <Stack.Navigator
                screenOptions={globalScreenOptions}
                initialRouteName="Home"
              >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name='OnSearch' component={OnSearch} />
                <Stack.Screen name="AskQuestion" component={AskQuestion} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
              </Stack.Navigator>
            </View>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftSection: {
    flex: 1,
  },
  bodySection: {
    flex: 7.8,
    flexDirection: 'row'
  },
  header: {
    flex: 1,
  },
  rightSection: {
    flex: 4.5
  },
});

const mapStateToProps = (state) => ({
    ip: state.Other.ip, 
    user_email: state.user_profile.user_email,
  });
  
  const mapDispatchToProps = {
    Set_ip
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
  