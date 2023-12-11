import React, { useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const App2 = () => {
  const scrollY = new Animated.Value(0);
  const translateY = Animated.diffClamp(scrollY, 0, 50).interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const panGestureHandler = useRef(
    <PanGestureHandler
      onGestureEvent={Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: false }
      )}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      }}
    >
      <Animated.View>
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar />}
          tabBarUnderlineStyle={{ backgroundColor: 'blue' }} // Customize the underline color
        >
          <ScrollView tabLabel="Tab 1" style={{ flex: 1 }}>
            <Text style={{ fontSize: 30, textAlign: 'center', margin: 10 }}>
              Scroll me!
            </Text>
            <Text style={{ fontSize: 20, textAlign: 'center', margin: 10 }}>
              Animated ScrollView
            </Text>
            {/* Add more content here */}
            {Array.from({ length: 50 }).map((_, index) => (
              <Text key={index} style={{ fontSize: 16, textAlign: 'center', margin: 5 }}>
                Content {index + 1}
              </Text>
            ))}
          </ScrollView>
          <View tabLabel="Tab 2" style={{ flex: 1 }}>
            {/* Content for Tab 2 */}
          </View>
        </ScrollableTabView>
      </Animated.View>
    </PanGestureHandler>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {panGestureHandler.current}
    </SafeAreaView>
  );
};

export default App2;
