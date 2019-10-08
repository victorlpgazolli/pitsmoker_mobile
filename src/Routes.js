
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Login from './pages/Login'
import Main from './pages/Main'
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
    CadastrarLogin: {
      screen: Cadastrar,
      navigationOptions: () => ({
        title: 'Criar Conta',
        headerStyle: { backgroundColor: colors.gray },
        headerTitleStyle: { color: '#fff' },
      }),
    },
  },
    {
      tabBarOptions: tabBarOptions,
    })
);
