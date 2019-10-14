
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, Text, ToastAndroid, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';
var account = {
    name: '',
    email: '',
    password: '',
    id: ''
}
export default function Login({ navigation }) {
    useEffect(async () => {
        try {
            AsyncStorage.getItem('@account_id').then(stored_id => {
                try {
                    if (stored_id.length > 0) {
                        async function getAccount() {
                            const response = await api.get('/users/' + stored_id)
                            account = {
                                name: response.data.response.name,
                                email: response.data.response.email,
                                password: response.data.response.password,
                                id: response.data.response._id,
                            }
                        }
                        getAccount()
                        navigation.navigate('Principal', account)
                    }
                } catch{

                }

            })

        } catch (err) {

        }

    }, []);
    async function handleLogin() {
        // await AsyncStorage.setItem('username', username);
        // navigation.navigate('Principal')
        if (account.email.trim().length > 0 && account.password.trim().length > 0) {
            async function getAccount() {
                // var registered_account = {};
                // console.log(account)
                try {
                    const { data } = await api.post('/users', { email: account.email, password: account.password })
                    const response = JSON.parse(JSON.stringify(data))
                    response.error ?
                        ToastAndroid.show("Login ou senha invalidos", ToastAndroid.SHORT) :
                        accessGranted(response)
                    // if(response == 'User not found'){
                    //     
                    // }else{
                    //     await AsyncStorage.setItem('@account_id', response.response._id);
                    //     alert(response.response._id)
                    // }

                } catch (err) {
                    console.log(err)

                }


                // navigation.navigate('Principal')//, account)
                // registered_account.id.length != null ? checkCredencials(registered_account.password) : ToastAndroid.show("Login inválido", ToastAndroid.SHORT);;
            }
            getAccount();
        } else {
            ToastAndroid.show("Digite corretamente os campos", ToastAndroid.SHORT)
        }

    }
    function handleRegister() {
        navigation.navigate('CadastrarLogin');
    }

    async function accessGranted(user) {
        AsyncStorage.setItem('@account_id', user._id);
        navigation.navigate('Principal', user);
    }
    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.container}>
            <Image
                style={{ width: 100, height: 175.25, marginBottom: 25 }}
                source={require('../assets/icon.png')}
            />
            <TextInput placeholder="Digite seu e-mail"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={val => account.email = val}
                style={[styles.input]}
            />
            <TextInput placeholder="Digite sua senha"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={val => account.password = val}
                secureTextEntry={true}
                style={[styles.input]}
            />
            <TouchableOpacity style={[styles.button, styles.colorBackground]} onPress={handleLogin} >
                <Text style={styles.buttontext}>Fazer login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.colorBorder]} onPress={handleRegister} >
                <Text style={[styles.buttontext, styles.textColor]}>Não tem uma conta? clique aqui</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        padding: 30,
        backgroundColor: '#2B2B2B'
    },
    input: {
        height: 46,
        alignSelf: "stretch",
        backgroundColor: "#373737",
        borderRadius: 4,
        marginTop: 10,
        color: "#fff",
        borderColor: "#eb4034",
        borderBottomWidth: 1,
        paddingHorizontal: 15,
    },
    button: {
        height: 46,
        alignSelf: "stretch",
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: "center"
    },
    colorBackground: {
        backgroundColor: '#eb4034',
    },
    colorBorder: {
        borderWidth: 1,
        borderColor: "#eb4034",
        marginBottom: 100
    },
    textColor: {
        color: "#eb4034",
    },
    buttontext: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 16
    },
})