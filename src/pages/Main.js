
import React, { useState, useEffect } from 'react';
import { View, BackHandler, ScrollView, TouchableHighlight, FlatList, Easing, Dimensions, Platform, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import io from "socket.io-client";
import Modal from "react-native-modal";
import customStyles from '../assets/styles';
import SelectBox from '../components/SelectBox';
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// 'http://192.168.0.104:3333'
var lurl = 'http://pit-smoker-backend.herokuapp.com'
var socket;
var account = {};
var newAlert = {
  temp: '',
  selectedType: '',
  active: true
};
const { OS: plataforma } = Platform;
const { width, height } = Dimensions.get('screen');
global.recipe = false;
global.confirm = false;
global.alertas = false;
global.alertConfig = false;
socket = io.connect(lurl);
export default function Main({ navigation }) {
  const [alertBreakPoint, setAlertBreakPoint] = useState([])
  const [sonda, setSonda] = useState(0)
  const [fireBox, setFireBox] = useState(0)
  const [isNew, updateisNew] = useState(false);
  useEffect(() => {

    socket.on("@app_sonda", msg => {
      setSonda(parseInt(msg));
      checkIfAlert()
    });
    socket.on("@app_firebox", msg => {
      setFireBox(parseInt(msg));
      checkIfAlert()
    });
    global.confirm = false;
  }, [isNew])
  var checkIfAlert = function () {
    for (var i = 0; i < alertBreakPoint.length; i++) {
      try {
        if (alertBreakPoint[i].selectedType == 'sonda') {
          if (alertBreakPoint[i].temp <= convertToFahrenheit(sonda)) {
            alert(`Sonda ultrapassou a tempreratura estipulada (${alertBreakPoint[i].temp}°F)`)
            var index = alertBreakPoint.indexOf(alertBreakPoint[i]);
            socket.emit('@esp_sonda', "sonda")
            if (index > -1) {
              alertBreakPoint.splice(index, 1);
            }
          }
        }
        if (alertBreakPoint[i].selectedType == 'firebox') {
          if (alertBreakPoint[i].temp <= convertToFahrenheit(fireBox)) {
            alert(`Fire box ultrapassou a tempreratura estipulada (${alertBreakPoint[i].temp}°F)`);
            var index = alertBreakPoint.indexOf(alertBreakPoint[i]);
            socket.emit('@esp_firebox', "firebox")
            if (index > -1) {
              alertBreakPoint.splice(index, 1);
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  account = navigation.state.params.account;
  global.recipe = navigation.state.params.recipe;

  var convertToFahrenheit = function (celcius) {
    return ((celcius * (9 / 5) + 32)).toFixed(0)
  }
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
    <ScrollView contentContainerStyle={[{ height: height }]}>
      < LinearGradient colors={['#121212', '#171717', '#2B2B2B']} style={[{ flex: 1 }]}>

        <View style={[styles.tempInfo, { alignItems: 'center' }]}>
          <Text style={[styles.buttontext, { marginVertical: 0 }]}>{global.recipe.name}</Text>
          <View style={[{ alignItems: 'center', width: width, padding: plataforma == 'ios' ? 35 : 0 }]}>
            <Text style={[styles.itemText]}>Sonda:</Text>
            <View style={[{ flexDirection: 'row', marginTop: plataforma == 'ios' ? 20 : 10 }]}>

              <AnimatedCircularProgress
                easing={Easing.quad}
                duration={800}
                size={110}
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
                        {convertToFahrenheit(sonda)}°F
                  </Text>
                      <Text style={[styles.miniCircleText]}>
                        {sonda}°C
                  </Text>
                    </View>
                  )
                }
              </AnimatedCircularProgress>
              <Text style={[styles.itemText, {}]}></Text>
            </View>
          </View>
          <View style={[{ alignItems: 'center', width: width, padding: plataforma == 'ios' ? 40 : 5 }]}>
            <Text style={[styles.itemText]}>Fire Box:</Text>
            <View style={[{ flexDirection: 'row', marginTop: plataforma == 'ios' ? 20 : 10 }]}>

              <AnimatedCircularProgress
                easing={Easing.quad}
                duration={800}
                size={110}
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
                      {convertToFahrenheit(fireBox)}°F
                  </Text>
                    <Text style={[styles.miniCircleText]}>
                      {fireBox}°C
                  </Text>
                  </View>
                  )
                }
              </AnimatedCircularProgress>
            </View>
          </View>
          {
            !global.alertConfig ?
              <TouchableOpacity style={[styles.button, customStyles.shadowButton, customStyles.colorBackground, { marginHorizontal: 25 }]}
                onPress={() => { global.alertConfig = !global.alertConfig; updateisNew(!isNew) }} >
                <Text style={[customStyles.buttontext, { fontSize: 18 }]}>Criar um alerta</Text>
              </TouchableOpacity>
              :
              <View>
                <View style={[{ width: width, padding: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={[customStyles.buttontext, { fontSize: 14 }]}>Receber alerta em </Text>
                  <TextInput
                    onChangeText={val => checkAlertInputs(val)}
                    autoCapitalize="none"
                    multiline={true}
                    numberOfLines={4}
                    autoCorrect={false}
                    style={[styles.input, { textAlignVertical: 'center' }]}
                    maxLength={3}
                    keyboardType='numeric'
                  />
                  <Text style={[customStyles.buttontext, { fontSize: 18 }]}>°F na </Text>
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
                      <Text style={[customStyles.buttontext, { fontSize: 18 }]}>Confirmar</Text>
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
                      <Text style={[customStyles.buttontext, { fontSize: 18 }]}>Cancelar</Text>
                    </TouchableOpacity>
                }
              </View>
          }
          {
            !global.alertConfig ?
              <TouchableHighlight onPress={() => { showPopup('alertas'); }} underlayColor="#eb4034"
                style={[customStyles.colorBackground, styles.button, customStyles.shadow, { padding: plataforma == 'ios' ? 5 : 0, marginHorizontal: 25 }]}>
                <View>
                  <Text style={[customStyles.buttontext, { fontSize: 18 }]}>Ver alertas</Text>
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
                    alertBreakPoint.length != 0 ?
                      <FlatList
                        data={alertBreakPoint}
                        renderItem={({ item }) => (
                          // item.temp != '' ?
                          <TouchableHighlight onLongPress={() => { showPopup(item); }} underlayColor="#eb4034" style={[customStyles.shadow, { padding: plataforma == 'ios' ? 5 : 0 }]}>
                            <View>
                              <Text style={[{ color: "#000", fontSize: 18 }]}>Alerta em: {item.temp}°F na {item.selectedType}</Text>
                            </View>
                          </TouchableHighlight>
                          // : null
                        )}>
                      </FlatList> :
                      <View>
                        <Text>Crie um alerta para ele aparecer aqui</Text>
                      </View>
                  }
                </View>
              </View>
            </View>
          </View>
        </Modal>

      </LinearGradient >
    </ScrollView>
  )

};

const styles = StyleSheet.create({
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
    marginTop: plataforma == 'ios' ? 30 : 5
  },
  buttontext: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 50
  },
  itemText: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: plataforma == 'ios' ? 45 : 35
  },
  input: {
    height: 40,
    backgroundColor: "#373737",
    borderColor: "#eb4034",
    borderBottomWidth: 1,
    borderRadius: 4,
    width: 40,
    color: '#fff',
    paddingHorizontal: 5,
  },
  confirmButton: {
    height: 40,
    alignSelf: "stretch",
    borderRadius: 4,
    marginVertical: plataforma == 'ios' ? 10 : 0,
    justifyContent: 'center',
    alignItems: "center"
  },
  button: {
    height: plataforma == 'ios' ? 60 : 40,
    alignSelf: "stretch",
    borderRadius: 4,
    marginVertical: plataforma == 'ios' ? 10 : 3,
    justifyContent: 'center',
    alignItems: "center"
  },
});