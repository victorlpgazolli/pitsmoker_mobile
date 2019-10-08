
import React from 'react';
import { View, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';
var account = {
  name: '',
  email: '',
  password: '',
  id: ''
}

export default function Main({ navigation }) {
  async function handleRegister() {
    if (validateInputs()) {
      try {
        const response = await api.post('/cadastrar', {
          name: account.name,
          email: account.email,
          password: account.password
        })
        const { _id: id } = JSON.parse(JSON.stringify(response.data))
        account.id = id;
        await AsyncStorage.setItem('@account_id', account.id);
        navigation.navigate("Principal", account)
      } catch (error) {
        ToastAndroid.show("problema ao criar conta", ToastAndroid.SHORT);
        console.log(error)
      }


    }
    //const response = await api.post('/users', { username: user })

  }
  function validateInputs() {
    if (account.name.trim().length != 0 && account.email.trim().length != 0 && account.password.trim().length != 0) {
      return true;
    } else {
      ToastAndroid.show('Digite os campos', ToastAndroid.SHORT);
      return false;
    }
  }
  return (
    <View style={styles.body}>
      <View style={styles.form}>
        <TextInput
          onChangeText={val => account.name = val}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          maxLength={15}
        />
        <TextInput
          onChangeText={val => account.email = val}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          onChangeText={val => account.password = val}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={handleRegister} style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>Criar conta e Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#2B2B2B'
  }, form: {

  },
  input: {
    height: 46,
    backgroundColor: "#373737",
    borderColor: "#eb4034",
    borderBottomWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    marginHorizontal: 10,
    color: '#fff',
    paddingHorizontal: 15,
  },
  submitBtn: {
    borderRadius: 10,
    backgroundColor: "#eb4034",
    width: 310,
    margin: 25,
    alignSelf: 'center',
    bottom: 0,
    position: 'absolute'
  },
  submitBtnText: {
    fontSize: 20,
    color: "#fff",
    padding: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  label: {
    color: '#999',
    marginTop: 2,
    marginLeft: 10,
  }
})