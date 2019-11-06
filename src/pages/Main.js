
import React, { useState, useEffect } from 'react';
import { View, BackHandler, ToastAndroid, Easing, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import io from "socket.io-client";
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNExitApp from 'react-native-exit-app';
// var lurl = 'http://pit-smoker-backend.herokuapp.com'
var lurl = 'http://192.168.0.104:3333'
var socket;
socket = io.connect(lurl);
export default function Main({ navigation }) {
  const [temperature, setTemp] = useState(80)
  const [recipe, setRecipe] = useState([])
  const [account, setAccount] = useState([])
  useEffect(() => {
    setAccount(JSON.stringify(navigation.state.params.usuario))
    setRecipe(JSON.stringify(navigation.state.params.receita))
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    socket.on("user alive", msg => {
      setInterval(() => io.emit('user alive', "user alive"), 5000);
    })
    socket.on("data", msg => {
      setTemp(parseInt(msg));
    });
  }, [])

  console.log(`USER: ${account} - RECEITA: ${recipe}`)
  var handleBackButton = function () {
    RNExitApp.exitApp()
    return true;
  }

  return (
    // <View style={styles.container}>
    < LinearGradient colors={['#121212', '#171717', '#2B2B2B']} style={styles.linearGradient} >
      <View style={[styles.tempInfo]}>
        <Text style={[styles.buttontext, { marginVertical: 20 }]}>{recipe.name}</Text>
        <AnimatedCircularProgress
          easing={Easing.quad}
          duration={800}
          size={150}
          width={5}
          fill={temperature}
          ref={(ref) => circularProgress = ref}
          tintColor="#eb4034"
          arcSweepAngle={180}
          rotation={270}
          backgroundColor="#373737">
          {
            () => (
              <Text style={[styles.circleText]}>
                {temperature}
              </Text>
            )
          }
        </AnimatedCircularProgress>
      </View>

    </LinearGradient >
  )

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
  buttontext: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 16
  },
});