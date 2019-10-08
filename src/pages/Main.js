
import React, { Component } from 'react';
import { View, BackHandler, ToastAndroid } from 'react-native'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  // REMOVE BACK BUTTON
  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  // }
  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // }

  handleBackButton() {
    return true;
  }
  render() {
    return (
      <View></View>
    );
  }
};
