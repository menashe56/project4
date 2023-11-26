# project4

<View>
      {chat_image ? (
        <ImageBackground source={{ uri: chat_image }} style={styles.chatImage}>
          <View style={styles.chatTextContainer}>
            <Text style={styles.chatNameText}>{chatName}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.chatItem}>
          <Text style={styles.chatNameText}>{chatName}</Text>
        </View>
      )}
</View>
