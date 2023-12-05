import React from 'react'
const SERVER_URL ='http://16.16.28.132'

const AddChat1 = () => {
    const [photo, setPhoto] = React.useState(null);

  const handleChoosePhoto = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setPhoto(selectedFile);
    }
  };

  const handleUploadPhoto = () => {
    if (!photo) {
      console.log('No photo selected');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo); // Use 'photo' as the field name

    fetch(`http://16.16.28.132/api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('Upload Response:', response);

        // Assuming imagePath is a property of uploadResponse.data.data
        const imagePath = response.data.imagePath;

        // Now, send the chat details along with the image path to create the chat
        return fetch(`http://16.16.28.132/api/create-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Add this header
          },
          body: JSON.stringify({ chat_name: 'your_chat_name', chat_image: imagePath }),
        });
      })
      .then((createChatResponse) => {
        console.log('Create Chat Response:', createChatResponse);
      })
      .catch((error) => {
        console.error('Error creating chat:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {photo && (
        <>
          <img src={URL.createObjectURL(photo)} alt="Selected" style={{ width: 300, height: 300 }} />
          <button onClick={handleUploadPhoto}>Upload Photo</button>
        </>
      )}
      <input type="file" accept="image/*" onChange={handleChoosePhoto} />
    </div>
  );
}

export default AddChat1

