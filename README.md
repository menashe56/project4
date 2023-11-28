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
