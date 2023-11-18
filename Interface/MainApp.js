import React, { useContext, useState, useEffect } from 'react';
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const MainApp = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState('');

  const handlePrintData = async () => {
    try {
      const response = await axios.get('http://13.49.46.202/api/fetch');
      const fetchedData = response.data;

      if (fetchedData.length === 0) {
        Alert.alert('There is no data.');
      } else {
        console.log('Data received:', fetchedData);
        setData(fetchedData);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInsertData = async () => {
    try {
      const requestData = { content };
      await axios.post('http://13.49.46.202/api/insert', requestData);
      Alert.alert('Data inserted successfully');
      console.log('Data inserted successfully');
      setContent('');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
    <View style={{ marginTop: 80 }}>
      <Button title='Print data' onPress={handlePrintData} />
      <View style={{ marginTop: 40 }}>
        <TextInput
          placeholder='Content'
          style={styles.input}
          onChangeText={(text) => setContent(text)}
          value={content}
        />
        <Button title='Add Message' onPress={handleInsertData} />
      </View>
      <Modal visible={modalOpen} animationType='slide'>
        <MaterialIcons name='close' size={45} onPress={() => setModalOpen(false)} />
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Text style={{ left: -80, fontSize: 24, fontWeight: 'bold' }}>Data from Database:</Text>
            {data.map((item, index) => (
              <View key={index}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Message Number {index + 1}:</Text>
                <Text>Content: {item.content}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

export default MainApp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  scroll: {
    height: '100%',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
    textAlign: 'center',
    marginHorizontal: '20',
    marginLeft: '20%',
    marginBottom: 10,
  },
});
