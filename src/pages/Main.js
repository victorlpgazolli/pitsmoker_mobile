
import React, { Component } from 'react';
import { View, BackHandler, ToastAndroid, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import io from "socket.io-client";


var lurl = 'http://pit-smoker-backend.herokuapp.com'

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      chatMessages: []
    };
  }
  componentDidMount() {
    this.socket = io.connect(lurl);

    this.socket.on("user alive", msg => {
        setInterval(() => io.emit('user alive', "user alive"), 5000);
      })

this.socket.on("data", msg => {

    this.setState({ chatMessages: [...this.state.chatMessages, msg] });

});
  }

render() {
  const chatMessages = this.state.chatMessages.map(chatMessage => (
    <Text key={chatMessage}>{chatMessage}</Text>
  ));

  return (
    <View style={styles.container}>
      {chatMessages}
    </View>
  );
}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});