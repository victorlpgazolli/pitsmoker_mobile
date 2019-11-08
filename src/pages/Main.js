
import React, { useState, useEffect } from 'react';
import { View, BackHandler, ToastAndroid, FlatList, Easing, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import io from "socket.io-client";
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNExitApp from 'react-native-exit-app';
var lurl = 'http://pit-smoker-backend.herokuapp.com'
var socket;
var account = {};
global.recipe = false;
socket = io.connect(lurl);
export default function Main({ navigation }) {
  const [temperature, setTemp] = useState(80)
  const [isNew, updateisNew] = useState(false);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    socket.on("user alive", msg => {
      setInterval(() => io.emit('user alive', "user alive"), 5000);
    })
    socket.on("data", msg => {
      setTemp(parseInt(msg));
      updateisNew(!isNew)
    });
  }, [isNew])

  account = navigation.state.params.account;
  global.recipe = navigation.state.params.recipe;
  console.info(global.recipe)

  var handleBackButton = function () {
    RNExitApp.exitApp()
    return true;
  }

  return (
    // <View style={styles.container}>
    < LinearGradient colors={['#121212', '#171717', '#2B2B2B']} style={styles.linearGradient} >
      <FlatList
        data={global.recipe}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (

          <View style={[styles.tempInfo]}>
            <Text style={[styles.buttontext, { marginVertical: 20 }]}>{item.name}</Text>
            {
              console.log(item)
            }
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
        )} ></FlatList>

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