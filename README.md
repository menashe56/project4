# project4

useLayoutEffect(() => {
navigation.setOptions({
title: "Chat",
headerBackTitleVisible: false,
headerTitleAlign: "left",
headerTitle: () => (
<View style={{ flexDirection: "row", alignItems: "center" }}>
<Avatar rounded source={{ uri: messages[0]?.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }} />
<View style={{ marginLeft: 10 }}>
<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{route.params.chatName}</Text>
</View>
</View>
),
headerLeft: () => (
<TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate("Home", { user_email, user_name, user_pictureUrl })}>
<AntDesign name='arrowleft' size={24} color='white' />
</TouchableOpacity>
),
headerRight: () => (
<View style={{ flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20 }}>
<TouchableOpacity>
<FontAwesome name='video-camera' size={24} color='white' />
</TouchableOpacity>
<TouchableOpacity>
<Ionicons name="call" size={24} color='white' />
</TouchableOpacity>
</View>
),
});
}, [navigation, messages]);

message?.sender_email === user_email ? (
<View key={message?.message_id} style={styles.receiver}>
<Avatar position="absolute" rounded bottom={-15} right={-5} size={30} source={{ uri: message?.sender_photo_url }} />
<Text style={styles.receiverText}>{message?.message_content}</Text>
</View>
) : (
<View key={message?.message_id} style={styles.sender}>
<Avatar position="absolute" rounded bottom={-15} right={-5} size={30} source={{ uri: message?.sender_photo_url }} />
<Text style={styles.senderText}>{message?.message_content}</Text>
<Text style={styles.senderName}>{message.sender_name}</Text>
<Text style={{color: 'white'}}>hi</Text>
</View>
)

{/_
<ReactModal transparent visible={isAddChatModalVisible} animationType="slide">
<View style={styles.container}>
<TouchableOpacity style={styles.closeButton} onPress={close}>
<MaterialIcons name="close" size={24} color="#333" />
</TouchableOpacity>
<Input
placeholder='Enter a chat name'
value={input}
onChangeText={(text) => setInput(text)}
leftIcon={<Icon name='wechat' type="antdesign" size={20} color="#333" />}
containerStyle={styles.inputContainer}
/>
<input type="file" accept="image/_" onChange={handleChoosePhoto} />

        {loadingImage && <ActivityIndicator size="large" color="#2196F3" />}
        {chatImage && !loadingImage && (
          <>
          <img src={URL.createObjectURL(photo)} alt="Selected" style={{ width: 300, height: 300 }} />
            <Text style={styles.imageLoadedText}>Image Loaded!</Text>
          </>
        )}
        <Button
          disabled={!input}
          title='Create New Chat'
          onPress={handleUploadPhoto}
          buttonStyle={styles.createButton}
        />
      </View>
    </ReactModal>
        */}

        {/* data:image/jpeg;base64,/9j/ */}




headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={toggleDropdown}>
            <Avatar rounded source={{ uri: user_picture }} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={handleSearchIconPress} style={{ marginLeft: 20 }}>
            <SimpleLineIcons name='magnifier' size={24} color="black" />
          </TouchableOpacity>

          <Animated.View style={{ marginLeft: 10, transform: [{ translateX: slideAnim }] }}>
            <TextInput
              placeholder="Search"
              style={{ fontSize: 16, color: 'black' }}
              onChangeText={(text) => handleSearchInputChange(text)}
              value={searchInput}
            />
          </Animated.View>
        </View>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: 'row', marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} style={{ marginLeft: 10}}>
            <Text> Nolex Logo</Text>
          </TouchableOpacity>
        </View>
      )