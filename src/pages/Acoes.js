
import React, { useEffect, useState, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView, Image, TextInput, View, Dimensions, Text, TouchableHighlight, ToastAndroid, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';
import Modal from "react-native-modal";
var account, refresh = false;
global.newAccount = {}
const _width = Dimensions.get('window').width
const _height = Dimensions.get('window').height
global.modal_recipe_actions = false;
global.temp_recipe = {};
export default function Acoes({ navigation }) {
    const [isNew, updateisNew] = useState(false);
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    useEffect(() => {
        try {


        } catch (err) {

        }

    }, [account]);

    account = refresh ? global.newAccount : JSON.parse(navigation.state.params)
    refresh = false;
    console.log(account)
    // console.log(`ACOES: ${JSON.stringify(account.recipes)}`)
    var chooseType = function (type) {
        if (type == 0) {
            navigation.navigate('Acoes', account)
        }
        if (type == 1) {
            console.log(account)
            navigation.navigate('Acoes', account)
        }
    }
    function showPopup(_recipe) {
        global.modal_recipe_actions = true;
        global.temp_recipe = _recipe;
        updateisNew(!isNew)
    }
    function hidePopup() {
        global.modal_recipe_actions = false;
        updateisNew(!isNew)
    }
    async function deleteRecipe(_recipe) {
        try {
            const response = await api.post('/apagar/receita', {
                recipe_name: _recipe.name,
                user_id: account._id
            })
            const { data } = JSON.parse(JSON.stringify(response))
            console.log(data)
            data.error ?
                alertErrors(data.error) :
                accessGranted(data)
        } catch (error) {
            ToastAndroid.show("problema ao criar receita", ToastAndroid.SHORT);
            console.log(error)
        }
    }
    function accessGranted(user) {
        global.newAccount = user;
        refresh = true;
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
            style={styles.container}>
            {/* <Text style={[ { marginVertical: 20, color: "#FFF", fontWeight: 'bold', fontSize: 18 }]}>Escolha uma das opções para proceguir:</Text> */}
            <TouchableOpacity style={[styles.button, styles.shadowButton, styles.colorBackground]} onPress={() => { chooseType(0) }} >
                <Text style={styles.buttontext}>Entrar no Plano de Assado</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.shadowButton, styles.colorBackground]} onPress={() => { navigation.navigate('CadastrarReceita', account) }} >
                <Text style={styles.buttontext}>Criar Plano de Assado</Text>
            </TouchableOpacity>
            <View style={[styles.card, styles.colorBackground]}>
                <Text style={[styles.buttontext, { padding: 5 }]}>Histórico</Text>
                <ScrollView>
                    {
                        account.recipes.map(recipe => {
                            return (
                                recipe.active ?
                                    <TouchableHighlight onLongPress={() => { showPopup(recipe); }} underlayColor="#eb4034" style={[styles.recipe, styles.shadow]}>
                                        <View>
                                            <Text style={[{ color: "#FFF", fontSize: 18 }]}>Nome: {recipe.name}</Text>
                                            <Text style={[{ color: "#FFF", fontSize: 18 }]}>Descrição: {recipe.description}</Text>
                                            <Text style={[{ color: "#FFF", fontSize: 18 }]}>Carnes: {recipe.num_carnes}</Text>
                                        </View>
                                    </TouchableHighlight> : null
                            )
                        })
                    }
                </ScrollView>
            </View>
            <Modal backdropColor={'#00000060'} isVisible={global.modal_recipe_actions}
                animationIn="slideInDown"
                animationOut="slideOutDown"
                animationInTiming={600}
                animationOutTiming={600}
                onBackdropPress={() => { hidePopup() }}>
                <View style={{ top: 0, position: 'absolute', right: 0, left: 0 }}>
                    <View style={[styles.operation]}>
                        <View style={[styles.modal_card, styles.shadow, { height: 140 }]}>
                            {/* <TextInput
                              onChangeText={val => qnt_atual = val}
                              placeholder={global.transaction ? 'Adicionar' : 'Remover'}
                              autoCapitalize="none"
                              autoCorrect={false}
                              style={styles.input}
                              //
                            /> */}
                            <Text style={[styles.colorBlack]}>Operação que deseja fazer:</Text>
                            <View style={[styles.actions]}>
                                <TouchableOpacity onPress={() => { navigation.navigate("CadastrarProduto", { usuario: account, receita: global.temp_recipe, edit: true }); hidePopup(); }} style={[styles.indivAction, styles.floatRight]}>
                                    <Text style={[styles.colorBlack]}>Editar receita</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { deleteRecipe(global.temp_recipe); hidePopup(); }} style={[styles.indivAction, styles.floatLeft,]}>
                                    <Text style={[styles.colorBlack]}>Apagar receita</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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
        height: 70,
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
        fontSize: 22
    },
    card: {
        height: 250,
        alignSelf: "stretch",
        borderRadius: 4,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: "center"
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    shadowButton: {
        shadowColor: "#eb403470",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    recipe: {
        backgroundColor: '#f54336',
        width: 300,
        padding: 10,
        marginBottom: 5
    },
    modal_card: {
        padding: 10,
        backgroundColor: '#ffffff',
        height: 200,
        margin: 0,
        minWidth: 330,
        alignSelf: "center"
    },
    operation: {
        paddingHorizontal: 10,
        top: 150,
        position: 'absolute',
        height: 140,
        paddingTop: 10,
        right: 0,
        left: 0
    },
    actions: {
        margin: 10,
    },
    indivAction: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: '#00000060',
        borderWidth: 1,
    },
    colorBlack: {
        color: '#000',
        fontSize: 16
    },
    floatRight: {
        right: 0
    },
    floatLeft: {
        left: 0
    },
})