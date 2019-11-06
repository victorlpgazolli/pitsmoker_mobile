
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
export default function Escolher({ navigation }) {
    // useEffect(async () => {
    //     try {


    //     } catch (err) {

    //     }

    // }, []);

    account = navigation.state.params
    var chooseType = function (type) {
        if (type == 0) {
            navigation.navigate('Acoes', account)
        }
        if (type == 1) {
            navigation.navigate('Acoes', account)
        }
    }
    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.container}>
            {/* <Image
                style={{ width: 100, height: 175.25, marginBottom: 25 }}
                source={require('../assets/icon.png')}
            /> */}
            <Text style={[styles.buttontext, { marginVertical: 20 }]}>Escolha uma das opções para proceguir:</Text>
            <TouchableOpacity style={[styles.button, styles.colorBackground]} onPress={() => { chooseType(0) }} >
                <Text style={styles.buttontext}>TIME</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.colorBackground]} onPress={() => { chooseType(1) }} >
                <Text style={styles.buttontext}>INDIVIDUAL</Text>
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
        backgroundColor: '#151515'
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
        marginVertical: 10,
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