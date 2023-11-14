import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);
  const [ModalOpen, setModalOpen] = useState(false);

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');

  const handlePrintData = async () => {
    try {
      // Fetch data from your server's API endpoint over HTTP
      const response = await axios.get('http://51.20.127.112/api/fetch');
      const fetchedData = response.data;

      if (fetchedData.length === 0) {
        // Show an alert if no student is found
        Alert.alert('There is no data.');
      } else {
        console.log('Data received:', fetchedData);
        setData(fetchedData); // Store the fetched data in the component's state
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInsertData = async () => {
    try {
      const requestData = { first_name, last_name, age, grade };
      // Send data to your server's API endpoint over HTTP
      await axios.post('http://51.20.127.112/api/insert', requestData);
      Alert.alert('Data inserted successfully');
      console.log('Data inserted successfully');
      setFirstName('');
      setLastName('');
      setAge('');
      setGrade('');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
    <View style={{ marginTop: 80 }}>
      <Button title='Print data' onPress={handlePrintData} />
      <View style={{ marginTop: 40 }}>
        <TextInput placeholder='First Name' style={styles.input} onChangeText={(text) => setFirstName(text)} value={first_name} />
        <TextInput placeholder='Last Name' style={styles.input} onChangeText={(text) => setLastName(text)} value={last_name} />
        <TextInput placeholder='Age' style={styles.input} onChangeText={(text) => setAge(text)} value={age} />
        <TextInput placeholder='Grade' style={styles.input} onChangeText={(text) => setGrade(text)} value={grade} />
        <Button title='Add Student' onPress={handleInsertData} />
      </View>
      <Modal visible={ModalOpen} animationType='slide'>
        <MaterialIcons name='close' size={45} onPress={() => setModalOpen(false)} />
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Text style={{ left: -80, fontSize: 24, fontWeight: 'bold' }}>Data from Database:</Text>
            {data.map((item, index) => (
              <View key={index}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Student Number {index + 1}:</Text>
                <Text>First Name: {item.first_name}</Text>
                <Text>Last Name: {item.last_name}</Text>
                <Text>Age: {item.age}</Text>
                <Text>Grade: {item.grade}</Text>
                <Text style={{ marginBottom: 10 }}>Date of Birth: {item.dob}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

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
