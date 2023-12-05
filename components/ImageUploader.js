import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library denied');
      }
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log('ImagePicker Result:', result);
  
      if (!result.cancelled && result.assets.length > 0) {
        // Access the URI from the first asset in the array
        const selectedImage = result.assets[0];
        console.log('Setting Image:', selectedImage);
        setImage(selectedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      console.log('No image selected for upload');
      return;
    }
  
    try {
      // Assuming you have a server endpoint to handle image uploads
      const serverEndpoint = 'https://16.16.28.132/api/upload';
  
      // Prepare the image data
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg', // Specify the image type
        name: image.fileName || `image_${Date.now()}.jpg`, // Specify the image name
      });
  
      // Send the image data to the server using Fetch API
      const response = await fetch(serverEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
  
      // Handle the server response
      if (response.ok) {
        console.log('Image uploaded successfully');
        // You may want to update the UI or take further actions on success
      } else {
        console.error('Failed to upload image');
        // Handle the error condition
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle other errors, such as network issues
    }
  };
  

  return (
    <View>
      <Button title="Pick Image" onPress={handleImagePick} />
      {console.log('Image State:', image)}
      {image && (
        <>
<Image source={{ uri: image.uri }} style={styles.image} />
          <Button title="Upload Image" onPress={handleImageUpload} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default ImageUploader;
