import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import ImageColors from 'react-native-image-colors';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import {  } from '../Redux/counterSlice';
import { Avatar } from 'react-native-elements';

const ChatQuestions = ({route, ip, navigation}) => {
    const [chatQuestions, setChatQuestions] = useState([]);
    const [dominantColor, setDominantColor] = useState(null);

    const chat_name = route.params.chat_name
    const chat_image = 'https://www.netscribes.com/wp-content/uploads/2019/06/Technology-Watch.jpg'//route.params.chat_image

    useEffect(() => {
        const fetchChatQuestions = async () => {
          try {
            const response = await axios.get(`http://${ip}/api/chats/${chat_name}/questions`);
            console.log(response)
            setChatQuestions(response.data);
          } catch (error) {
            console.error('Error fetching chats:', error);
          }
        };
        if (ip !== '') { fetchChatQuestions(); }
      }, [ip]);
    

    useEffect(() => {
        const getColorFromImage = async () => {
          try {
            const result = await ImageColors.getColors(chat_image, {
              fallback: '#000000', // Default color if extraction fails
              quality: 'high',
              numberOfColors: 3,
            });
            console.log(chat_name,' : ' ,result)
            setDominantColor(result.darkVibrant);
          } catch (error) {
            console.error('Error extracting colors:', error);
          }
        };
        getColorFromImage();
     }, [chat_image]);

     const fetchSenderQuestionPicture = async (picture) => {
        try {
          const response = await axios.get(`http://${ip}/api/getImage/${picture}`, {
          });
  
          const data = response.data;
          return `data:image/jpeg;base64,${data.data.base64Image}`;
  
        } catch (error) {
          console.error('Error fetching Sender Question Picture :', error.message);
        }
      };
  
  return (
    <View style={{alignItems: 'center' , backgroundColor: 'white'}}>
    <View style={{width: 900, flex:1,marginTop: 20}}>
        <ImageBackground source={{ uri: 'https://www.netscribes.com/wp-content/uploads/2019/06/Technology-Watch.jpg'}} style={{width: 900, height: 100,  flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <Text style={{fontWeight: 'bold', fontSize: 35, marginLeft: 5, color: dominantColor, textShadowColor: 'rgba(232, 235, 232, 0)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2, borderColor: 'white' }}>{chat_name}</Text>
        </ImageBackground>
        <View>
        {chatQuestions.map((question) => (
            <TouchableOpacity
              key={question.question_id}
              onPress={() =>
                navigation.navigate('Chat', {question})
              }
              style={{marginVertical: 5}}
            >
              <View style={{flexDirection: 'row', backgroundColor: 'rgba(230, 232, 230,0.5)',shadowColor: 'rgba(230, 232, 230,0.5)', shadowOffset: { width: 2, height: 2 }, shadowRadius: 2, borderColor: 'rgba(230, 232, 230,0.5)', borderWidth: 1, borderRadius: 5, alignItems: 'center', paddingLeft: 3, paddingVertical: 3,  }} numberOfLines={1} adjustsFontSizeToFit>
                {console.log(question.sender_picture)}
                <Avatar rounded source={{ uri: fetchSenderQuestionPicture(question.sender_picture) }} />
                <MaterialCommunityIcons name="comment-question" size={24} color="gray" style={{ marginLeft: 10 }} />
                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Question </Text>
                <Text style={{ fontSize: 14, color: 'black' }}>| {question.question_title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    chatImage: {
        width: '100%',
        height: 80,
        resizeMode: 'cover',
        borderRadius: 10, // Adjust the value based on your preference
        overflow: 'hidden', // This ensures that the borderRadius is applied
        justifyContent: 'flex-end',
      },
})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {
  };

  export default connect(mapStateToProps, mapDispatchToProps)(ChatQuestions);