
import React, { Component } from 'react';
import { View, BackHandler, ToastAndroid, Easing, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import io from "socket.io-client";
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNExitApp from 'react-native-exit-app';

var lurl = 'http://pit-smoker-backend.herokuapp.com'

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fill: 10
    };
  }
  componentDidMount() {
    this.socket = io.connect(lurl);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({ fill: 80 })
    this.socket.on("user alive", msg => {
      setInterval(() => io.emit('user alive', "user alive"), 5000);
    })

    this.socket.on("data", msg => {
      ToastAndroid.show(`Dados recebidos: ${parseInt(msg)}`, ToastAndroid.SHORT)
      this.setState({ fill: parseInt(msg) });
    });
  }
  // REMOVE BACK BUTTON

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    RNExitApp.exitApp()
    return true;
  }

  render() {
    return (
      // <View style={styles.container}>
      <LinearGradient colors={['#121212', '#171717', '#2B2B2B']} style={styles.linearGradient}>
        <View style={[styles.tempInfo]}>
          <AnimatedCircularProgress
            easing={Easing.quad}
            duration={800}
            size={150}
            width={5}
            fill={this.state.fill}
            ref={(ref) => this.circularProgress = ref}
            tintColor="#eb4034"
            arcSweepAngle={180}
            rotation={270}
            backgroundColor="#373737">
            {
              (fill) => (
                <Text style={[styles.circleText]}>
                  {this.state.fill}
                </Text>
              )
            }
          </AnimatedCircularProgress>
        </View>

      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  circle: {
    width: 20
  },
  circleText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: "Helvetica Neue",
  },
  tempInfo: {
    alignItems: 'center',
    marginTop: 50
  },
});