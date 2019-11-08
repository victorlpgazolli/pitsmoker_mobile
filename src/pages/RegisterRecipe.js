
import React from 'react';
import { View, StyleSheet, Dimensions, Text, TextInput, ToastAndroid, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';
var account = {
    name: '',
    email: '',
    password: '',
    id: ''
}
var recipe = {
    name: '',
    description: '',
    num_carnes: '',
    user_id: '',
}
const { width, height} = Dimensions.get('window').width

export default function RegisterRecipe({ navigation }) {
    async function handleRegister() {
        if (validateInputs()) {
            try {
                const response = await api.post('/cadastrar/receita', {
                    recipe_name: recipe.name,
                    recipe_description: recipe.description,
                    recipe_num_carnes: '1',
                    user_id: account._id
                })
                const { data } = JSON.parse(JSON.stringify(response))
                data.error ?
                    alertErrors(data.error) :
                    accessGranted(data)
            } catch (error) {
                ToastAndroid.show("problema ao criar receita", ToastAndroid.SHORT);
                console.log(error)
            }


        }
        //const response = await api.post('/users', { username: user })

    }
    account = navigation.state.params
    async function accessGranted(user) {
        console.log(user)
        AsyncStorage.setItem('@account_id', user._id);
        navigation.navigate("Principal", { usuario: user, receita: recipe })
    }
    function alertErrors(erros) {
        ToastAndroid.show(`${erros}`, ToastAndroid.SHORT);
        console.log(erros)
    }
    function validateInputs() {
        // if (recipe.name.trim().length != 0 && recipe.description.trim().length != 0 && recipe.num_carnes.trim().length != 0) {
        return true;
        // } else {
        // ToastAndroid.show('Digite os campos', ToastAndroid.SHORT);
        // return false;
        // }
    }
    return (
        <View style={styles.body}>
            <View style={styles.form}>
                <View style={[{ flexDirection: 'row', marginHorizontal: 10 }]}>
                    <Text style={[styles.buttontext, { marginVertical: 20, marginHorizontal: 10, }]}>Nome: </Text>
                    <TextInput
                        onChangeText={val => recipe.name = val}
                        placeholder="Digite o nome"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { flex: 1 }]}
                        maxLength={15}
                    />
                </View>
                <View style={[{ marginHorizontal: 10, }]}>
                    <Text style={[styles.buttontext, { marginTop: 20, marginHorizontal: 10, }]}>Descrição: </Text>
                    <TextInput
                        onChangeText={val => recipe.description = val}
                        placeholder="Digite o nome"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        multiline={true}
                        numberOfLines={4}
                        autoCorrect={false}
                        style={[styles.input, { height: 100 }]}
                        maxLength={197}
                    />
                </View>
                <View style={[{ flexDirection: 'row', marginHorizontal: 10, }]}>
                    <Text style={[styles.buttontext, { marginVertical: 20, marginHorizontal: 10, }]}>Peças de carnes: </Text>
                    <TextInput
                        onChangeText={val => recipe.num_carnes = val}
                        placeholder="Carnes"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='numeric'
                        value="1"
                        style={[styles.input, { flex: 1 }]}
                        maxLength={1}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={handleRegister} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Criar receita</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#2B2B2B'
    }, form: {
        marginTop: 30
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
    },
    buttontext: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 16
    },
})