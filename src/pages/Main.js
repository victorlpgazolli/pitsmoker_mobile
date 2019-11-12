
import React, { useState, useEffect } from 'react';
import { View, BackHandler, ToastAndroid, TouchableHighlight, FlatList, Easing, Dimensions, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import io from "socket.io-client";
import Modal from "react-native-modal";
import customStyles from '../assets/styles';
import SelectBox from '../components/SelectBox';
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNExitApp from 'react-native-exit-app';
var lurl = 'http://pit-smoker-backend.herokuapp.com'
var socket;
var account = {};
var newAlert = {
  temp: '',
  selectedType: '',
  active: true
};
const { width, height } = Dimensions.get('window');
global.recipe = false;
global.confirm = false;
global.alertas = false;
global.alertConfig = false;
socket = io.connect(lurl);
export default function Main({ navigation }) {
  const [alertBreakPoint, setAlertBreakPoint] = useState([])
  const [sonda, setSonda] = useState(80)
  const [fireBox, setFireBox] = useState(80)
  const [isNew, updateisNew] = useState(false);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    socket.on("@app_sonda", msg => {
      setSonda(parseInt(msg));
      updateisNew(!isNew)
    });
    socket.on("@app_firebox", msg => {
      setFireBox(parseInt(msg));
      updateisNew(!isNew)
    });
    global.confirm = false;
    for (var i = 0; i < alertBreakPoint.length; i++) {
      try {
        if (alertBreakPoint[i].selectedType == 'sonda') {
          if (alertBreakPoint[i].temp <= sonda) {
            alert(`Sonda ultrapassou a tempreratura estipulada (${alertBreakPoint[i].temp}°C)`)
            var index = alertBreakPoint.indexOf(alertBreakPoint[i]);
            socket.emit('@esp_sonda', "sonda")
            if (index > -1) {
              alertBreakPoint.splice(index, 1);
            }
            console.log(alertBreakPoint)
          }
        }
        if (alertBreakPoint[i].selectedType == 'firebox') {
          if (alertBreakPoint[i].temp <= fireBox) {
            alert(`Fire box ultrapassou a tempreratura estipulada (${alertBreakPoint[i].temp}°C)`);
            var index = alertBreakPoint.indexOf(alertBreakPoint[i]);
            socket.emit('@esp_firebox', "firebox")
            if (index > -1) {

              alertBreakPoint.splice(index, 1);
              console.log(alertBreakPoint)
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [isNew])

  account = navigation.state.params.account;
  global.recipe = navigation.state.params.recipe;

  var handleBackButton = function () {
    RNExitApp.exitApp()
    return true;
  }
  var checkAlertInputs = function (_val) {
    newAlert.temp = _val
    try {
      if (newAlert.temp && newAlert.selectedType) {
        global.confirm = true;
        updateisNew(!isNew)

        return true
      } else {
        return false
      }
    } catch (error) {
      console.info(error)
    }
  }
  var changeSelectedType = function (_type) {
    newAlert.selectedType = _type;
    checkAlertInputs(newAlert.temp);
  }
  function showPopup(_popup) {
    if (_popup == 'alertas') {
      global.alertas = true;
    }
    updateisNew(!isNew)
  }
  function hidePopup(_popup) {
    if (_popup == 'alertas') {
      global.alertas = false;
    }
    updateisNew(!isNew)
  }
  return (
    // <View style={styles.container}>
    < LinearGradient colors={['#121212', '#171717', '#2B2B2B']} style={styles.linearGradient} >

      <View style={[styles.tempInfo, { alignItems: 'center' }]}>
        <Text style={[styles.buttontext, { marginVertical: 20 }]}>{global.recipe.name}</Text>
        <View style={[{ alignItems: 'center', width: width, padding: 40 }]}>
          <Text style={[styles.itemText]}>Sonda:</Text>
          <View style={[{ flexDirection: 'row', marginTop: 20 }]}>

            <AnimatedCircularProgress
              easing={Easing.quad}
              duration={800}
              size={120}
              width={5}
              fill={sonda}
              ref={(ref) => circularProgress = ref}
              tintColor="#eb4034"
              arcSweepAngle={180}
              rotation={270}
              backgroundColor="#373737">
              {
                () => (
                  <View style={[{ alignItems: 'center' }]}>
                    <Text style={[styles.circleText]}>
                      {sonda}°C
                  </Text>
                    <Text style={[styles.miniCircleText]}>
                      {(sonda * (9 / 5)) + 32}°F
                  </Text>
                  </View>
                )
              }
            </AnimatedCircularProgress>
            <Text style={[styles.itemText, {}]}></Text>
          </View>
        </View>
        <View style={[{ alignItems: 'center', width: width, padding: 40 }]}>
          <Text style={[styles.itemText]}>Fire Box:</Text>
          <View style={[{ flexDirection: 'row', marginTop: 20 }]}>

            <AnimatedCircularProgress
              easing={Easing.quad}
              duration={800}
              size={120}
              width={5}
              fill={fireBox}
              ref={(ref) => circularProgress = ref}
              tintColor="#eb4034"
              arcSweepAngle={180}
              rotation={270}
              backgroundColor="#373737">
              {
                () => (<View style={[{ alignItems: 'center' }]}>
                  <Text style={[styles.circleText]}>
                    {fireBox}°C
                  </Text>
                  <Text style={[styles.miniCircleText]}>
                    {(fireBox * (9 / 5)) + 32}°F
                  </Text>
                </View>
                )
              }
            </AnimatedCircularProgress>
          </View>
        </View>
        {
          !global.alertConfig ?
            <TouchableOpacity style={[customStyles.button, customStyles.shadowButton, customStyles.colorBackground, { marginHorizontal: 25 }]}
              onPress={() => { global.alertConfig = !global.alertConfig; updateisNew(!isNew) }} >
              <Text style={customStyles.buttontext}>Criar um alerta</Text>
            </TouchableOpacity>
            :
            <View>
              <View style={[{ width: width, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={customStyles.buttontext}>Receber alerta em </Text>
                <TextInput
                  onChangeText={val => checkAlertInputs(val)}
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  autoCorrect={false}
                  style={[styles.input]}
                  maxLength={3}
                  keyboardType='numeric'
                />
                <Text style={customStyles.buttontext}>°C na </Text>
                <SelectBox
                  onSelect={changeSelectedType.bind()}
                  typeOfMetric={[{ type: 'sonda' }, { type: 'firebox' }]} />
              </View>
              {
                global.confirm ?
                  <TouchableOpacity style={[styles.confirmButton, customStyles.shadowButton,
                  { marginHorizontal: 25, backgroundColor: '#eb4034' }]}
                    onPress={() => {
                      global.alertConfig = !global.alertConfig;
                      global.confirm = false;
                      setAlertBreakPoint(alertBreakPoint.concat(newAlert));
                      updateisNew(!isNew);
                      newAlert = {
                        temp: '',
                        selectedType: ''
                      };
                    }} >
                    <Text style={customStyles.buttontext}>Confirmar</Text>
                  </TouchableOpacity> :
                  <TouchableOpacity style={[styles.confirmButton, customStyles.shadowButton,
                  { marginHorizontal: 25, backgroundColor: '#eb4034' }]}
                    onPress={() => {
                      global.alertConfig = !global.alertConfig;
                      global.alertConfig = false;
                      updateisNew(!isNew)
                      newAlert = {
                        temp: '',
                        selectedType: ''
                      };
                    }} >
                    <Text style={customStyles.buttontext}>Cancelar</Text>
                  </TouchableOpacity>
              }
            </View>
        }
        {
          !global.alertConfig ?
            <TouchableHighlight onPress={() => { showPopup('alertas'); }} underlayColor="#eb4034"
              style={[customStyles.colorBackground, customStyles.button, customStyles.shadow, { padding: 5, marginHorizontal: 25 }]}>
              <View>
                <Text style={customStyles.buttontext}>Ver alertas</Text>
              </View>
            </TouchableHighlight> : null
        }
      </View>
      <Modal backdropColor={'#00000060'} isVisible={global.alertas}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={600}
        onBackdropPress={() => { hidePopup('alertas') }}>
        <View style={{ top: 0, position: 'absolute', right: 0, left: 0 }}>
          <View style={[customStyles.operation]}>
            <View style={[customStyles.modal_card, customStyles.shadow, { height: 240 }]}>
              <Text style={[customStyles.colorBlack]}>Meus alertas:</Text>
              <View style={[customStyles.actions]}>
                {
                  <FlatList
                    data={alertBreakPoint}
                    renderItem={({ item }) => (
                      // item.temp != '' ?
                      <TouchableHighlight onLongPress={() => { showPopup(item); }} underlayColor="#eb4034" style={[customStyles.shadow, { padding: 5 }]}>
                        <View>
                          <Text style={[{ color: "#000", fontSize: 18 }]}>Alerta em: {item.temp}°C na {item.selectedType}</Text>
                        </View>
                      </TouchableHighlight>
                      // : null
                    )}>
                  </FlatList>
                }
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: "Helvetica Neue",
  },
  miniCircleText: {
    color: '#fff',
    fontSize: 15,
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
    fontSize: 50
  },
  itemText: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 35
  },
  input: {
    height: 30,
    backgroundColor: "#373737",
    borderColor: "#eb4034",
    borderBottomWidth: 1,
    borderRadius: 4,
    color: '#fff',
    paddingHorizontal: 15,
  },
  confirmButton: {
    height: 40,
    alignSelf: "stretch",
    borderRadius: 4,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: "center"
  }
});