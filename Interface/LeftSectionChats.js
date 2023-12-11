import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React,{ useState, useEffect,} from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { } from '../Redux/counterSlice';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { AntDesign, SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";

const LeftSectionChats = ({questionArray, ip}) => {

    const [chatImage, setChatImage] = useState('');
    const [chatQuestionsDropDown, setChatQuestionsDropDown] = useState(false)

    useEffect(() => {

        const fetchChatImge = async () => {
          try {
            const response = await axios.get(`http://${ip}/api/getImage/${questionArray[0].chat_image}`, {
            });
    
            const data = response.data;
            setChatImage(`data:image/jpeg;base64,${data.data.base64Image}`);
    
          } catch (error) {
            console.error('Error fetching chat :', error.message);
          }
        };
    
        fetchChatImge();
    
      }, [questionArray[0].chat_image]);

      return (
        chatImage && (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden' }}>
              <BackgroundImage source={{ uri: chatImage }} style={{ flex: 1 }} />
            </TouchableOpacity>
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity>
                <Text style={{ color: 'black', marginBottom: 10 }}>{questionArray[0].chat_name}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setChatQuestionsDropDown(!chatQuestionsDropDown)}>
                  <MaterialIcons color='black' size={18} name={ chatQuestionsDropDown ? 'arrow-drop-up' : 'arrow-drop-down' } />
                </TouchableOpacity>
                <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity>
                  <Text style={{ color: '#2d2e2d' }}>{questionArray[0].question_title}</Text>
                </TouchableOpacity>
                {chatQuestionsDropDown &&
                  questionArray.slice(1, questionArray.length - 1).map((question) => (
                    <TouchableOpacity key={question.question_id} style={{ marginTop: 5 }}>
                      <Text style={{ color: '#2d2e2d' }}>{question.question_title}</Text>
                    </TouchableOpacity>
                  ))}
                  </View>
              </View>
            </View>
          </View>
        )
      );           
};

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    user_email: state.user_profile.user_email,
    user_name:  state.user_profile.user_name,
    user_picture:  state.user_profile.user_picture,

    isAddChatModalVisible: state.Modals.isAddChatModalVisible,
    newChatVisible: state.Modals.newChatVisible,

    ip: state.Other.ip
  });
  
  const mapDispatchToProps = {

  };

  export default connect(mapStateToProps, mapDispatchToProps)(LeftSectionChats);