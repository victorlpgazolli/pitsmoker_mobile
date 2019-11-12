
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Login from './pages/Login'
import Main from './pages/Main'
import Escolher from './pages/Escolher'
import Acoes from './pages/Acoes'
import ListaPlanosDisponiveis from './pages/ListaPlanosDisponiveis'
import RegisterRecipe from './pages/RegisterRecipe'
import Cadastrar from './pages/Register'
import colors from './assets/colors'
const tabBarOptions = {
  activeTintColor: 'tomato',
  inactiveTintColor: 'gray',
  style: {
    padding: 15,
    fontSize: 20,
  },
}
export default createAppContainer(
  createStackNavigator({
    Login: {
      screen: Login,
      navigationOptions: () => ({
        title: 'Login',
        header: null,
      })
    },
    Principal: {
      screen: Main,
      navigationOptions: () => ({
        title: 'Principal',
        header: null,
      }),
    },
    Escolher: {
      screen: Escolher,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Acoes: {
      screen: Acoes,
      navigationOptions: () => ({
        headerStyle: { backgroundColor: colors.black },
        header: null,
      }),
    },
    ListaPlanosDisponiveis: {
      screen: ListaPlanosDisponiveis,
      navigationOptions: () => ({
        headerStyle: { backgroundColor: colors.black },
      }),
    },
    CadastrarLogin: {
      screen: Cadastrar,
      navigationOptions: () => ({
        title: 'Criar Conta',
        headerStyle: { backgroundColor: colors.gray },
        headerTitleStyle: { color: '#fff' },
      }),
    },
    CadastrarReceita: {
      screen: RegisterRecipe,
      navigationOptions: () => ({
        title: 'Criar Receita',
        headerStyle: { backgroundColor: colors.gray },
        headerTitleStyle: { color: '#fff' },
      }),
    },
  },
    {
      tabBarOptions: tabBarOptions,
    })
);
