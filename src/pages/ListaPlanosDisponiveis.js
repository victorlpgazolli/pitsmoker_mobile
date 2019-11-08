
import React, { useEffect, useState, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, FlatList, Image, TextInput, View, Dimensions, Text, TouchableHighlight, ToastAndroid, TouchableOpacity } from 'react-native'
import customStyles from '../assets/styles';
import api from '../services/api';
import Modal from "react-native-modal";
var account, refresh = false;
global.newAccount = {}
const { width, height } = Dimensions.get('window').width
global.modal_recipe_actions = false;
global.temp_recipe = {};
export default function ListaPlanosDisponiveis({ navigation }) {
    const [isNew, updateisNew] = useState(false);
    const [load, setLoad] = useState({ refreshing: false });
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    useEffect(() => {
        try {


        } catch (err) {

        }

    }, [account]);

    account = refresh ? global.newAccount : navigation.state.params.account
    user_type = refresh ? global.newAccount : navigation.state.params.user_type

    function showPopup(_recipe) {
        global.modal_recipe_actions = true;
        global.temp_recipe = _recipe;
        updateisNew(!isNew)
    }
    function hidePopup() {
        global.modal_recipe_actions = false;
        updateisNew(!isNew)
    }
    function handleRefresh() {
        //simulate refresh
        getAccount();
        setLoad({ refreshing: true })
    }
    async function deleteRecipe(_recipe) {
        try {
            const response = await api.post('/apagar/receita', {
                recipe_id: _recipe._id,
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
    async function getAccount() {
        // var registered_account = {};
        // console.log(account)
        try {
            const { data } = await api.get('/users/' + account._id)
            data.error ?
                ToastAndroid.show("Login ou senha invalidos", ToastAndroid.SHORT) :
                accessGranted(data.response)

        } catch (err) {
            console.log(err)
        }
    }

    function accessGranted(user) {
        global.newAccount = user;
        console.log(user)
        refresh = true;
        setLoad({ refreshing: false })
        setTimeout(() => { forceUpdate() }, 1000)
    }
    function alertErrors(erros) {
        ToastAndroid.show(`${erros}`, ToastAndroid.SHORT);
        console.log(erros)
    }
    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={customStyles.container}>
            {/* <Image
            style={{ width: 100, height: 175.25, marginBottom: 25 }}
            source={require('../assets/icon.png')}
        /> */}
            <FlatList
                data={account.recipes}
                refreshing={load.refreshing}
                onRefresh={() => { handleRefresh() }}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (

                    user_type ?
                        item.active && !item.default ?
                            <TouchableHighlight onPress={() => { console.info(item); navigation.navigate('Principal', { account: account, user_type: user_type, recipe: item }) }}
                                onLongPress={() => { showPopup(item); }} underlayColor="#eb4034"
                                style={[customStyles.recipe, customStyles.shadow]}>
                                <View>
                                    <Text style={[{ color: "#FFF", fontSize: 18 }]}>Nome: {item.name}</Text>
                                    <Text style={[{ color: "#FFF", fontSize: 18 }]}>Descrição: {item.description}</Text>
                                    <Text style={[{ color: "#FFF", fontSize: 18 }]}>Carnes: {item.num_carnes}</Text>
                                </View>
                            </TouchableHighlight> : null
                        :
                        item.active && item.default ?
                            <TouchableHighlight onPress={() => { navigation.navigate('Principal', { account: account, user_type: user_type, recipe: item }) }} underlayColor="#eb4034" style={[customStyles.recipe, customStyles.shadow]}>
                                <View>
                                    <Text style={[{ color: "#FFF", fontSize: 18 }]}>Nome: {item.name}</Text>
                                    <Text style={[{ color: "#FFF", fontSize: 18 }]}>Descrição: {item.description}</Text>
                                    <Text style={[{ color: "#FFF", fontSize: 18 }]}>Carnes: {item.num_carnes}</Text>
                                </View>
                            </TouchableHighlight> : null
                )}>
            </FlatList>
            <Modal backdropColor={'#00000060'} isVisible={global.modal_recipe_actions}
                animationIn="slideInDown"
                animationOut="slideOutDown"
                animationInTiming={600}
                animationOutTiming={600}
                onBackdropPress={() => { hidePopup() }}>
                <View style={{ top: 0, position: 'absolute', right: 0, left: 0 }}>
                    <View style={[customStyles.operation]}>
                        <View style={[customStyles.modal_card, customStyles.shadow, { height: 140 }]}>
                            {/* <TextInput
                          onChangeText={val => qnt_atual = val}
                          placeholder={global.transaction ? 'Adicionar' : 'Remover'}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={customStyles.input}
                          //
                        /> */}
                            <Text style={[customStyles.colorBlack]}>Operação que deseja fazer:</Text>
                            <View style={[customStyles.actions]}>
                                <TouchableOpacity onPress={() => { navigation.navigate("CadastrarProduto", { usuario: account, receita: global.temp_recipe, edit: true }); hidePopup(); }} style={[customStyles.indivAction, customStyles.floatRight]}>
                                    <Text style={[customStyles.colorBlack]}>Editar receita</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { deleteRecipe(global.temp_recipe); hidePopup(); }} style={[customStyles.indivAction, customStyles.floatLeft,]}>
                                    <Text style={[customStyles.colorBlack]}>Apagar receita</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

