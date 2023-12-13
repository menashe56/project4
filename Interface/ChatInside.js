import { View, Text } from 'react-native'
import React from 'react'

const ChatInside = () => {
  return (
<View style={{ overflow: 'hidden', position: 'relative', flex: 2 }}>
<View style={{ flex: 1, backgroundColor: 'rgba(230, 232, 230,1)', }}>

  {/* Selected Question Header */}
  <View style={{ flexDirection: 'row', marginBottom: 10, flex: 1,  }}>
    <View style={{ marginRight: 5, marginLeft: 10, marginTop: 5 }}>
      <GetImage Image={Question.sender_picture} size={45} />
    </View>
    <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 5 }}>
      <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: '500', color: 'rgba(35, 36, 35, 0.9)' }}>
        {Question.question_title}
      </Text>
      <Text style={{ color: 'gray', fontSize: 14, marginLeft: 5 }}>
        Asked {calculateTimePassed(Question.timestamp)} ago {Answered} Viewed {} times
      </Text>
    </View>

    {/* Header Icons and Actions */}
    <View style={{ flexDirection: 'row', position: 'absolute', right: 10, marginTop: 5, alignItems: 'center' }}>
      <SimpleLineIcons name='magnifier' size={22} color="#7a7d80" />
      <MaterialCommunityIcons name='dots-vertical' size={24} color={'#7a7d80'} style={{ marginRight: 15, marginLeft: 15 }} />
      <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 10, }} onPress={user_email === '' ? () => navigation.navigate('Login') : () => navigation.navigate('AskQuestion', { chat: route.params.chat, chat_name: route.params.chat.chat_name })}>
        <Text style={{ fontSize: 16, color: 'white', padding: 10 }}>Ask Question</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.divider} />
  </View>
</View>

{/* Displaying Messages */}
<ScrollView style={{ flex: 8.5 }}>
  {Question !== '' && (
    <View style={{ overflow: 'hidden', flex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 'auto' }}>
      {/* Question Content */}
      <View style={{ flex: 1, }}>
        <Text style={{ color: 'black', fontSize: 18, marginBottom: 40, marginTop: 30, marginLeft: 10 }}>{Question.question_content}</Text>
        
        {/* Displaying Messages */}
        {messages.map((message, index) => (
          <View key={index} style={{ marginLeft: 15, marginRight: 15 }}>
            <ListMessages message={message} calculateTimePassed={calculateTimePassed} />
          </View>
        ))}

        {/* input Section */}
        <View style={{ marginTop: 'auto',  backgroundColor: 'white', marginRight: 20, marginLeft: 20, marginTop: 30}}>
            <TextInput value={editorValue} onChangeText={handleEditorChange} placeholder="Type something..." placeholderTextColor={'gray'} />
        </View>
     
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', marginBottom: 200, marginTop: 15, marginLeft: 15 }}>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 10 }} onPress={() => { sendMessage(); }}>
            <Text style={{ color: 'white', fontSize: 16, padding: 10 }}>Post Your Answer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )}
</ScrollView>
</View>
  )
}

export default ChatInside