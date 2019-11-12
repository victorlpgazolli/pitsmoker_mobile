import React, { Component } from 'react';
import { View, StyleSheet, Text, BackHandler, TextInput, ToastAndroid, TouchableOpacity } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';

var typeOfMetric = []
export default class SelectBox extends Component {
    state = { typeOfMetric: [], selectedTypeOfMetric: '' }
    updateUser = (selected_estatistic_metric) => {
        this.setState({ selectedTypeOfMetric: selected_estatistic_metric })
        this.props.onSelect(selected_estatistic_metric)
    }
    UNSAFE_componentWillMount() {

        // var temp = Object.keys(this.props.typeOfMetric).map(i => JSON.parse(this.props.typeOfMetric[Number(i)])) 
        // this.setState({ typeOfMetric: this.props.typeOfMetric })
        // console.log(`${(this.props.typeOfMetric)}`);
        for (let i = 0; i < this.props.typeOfMetric.length; i++) {
            typeOfMetric.pop()
        }
        for (let i = 0; i < this.props.typeOfMetric.length; i++) {
            var key = this.props.typeOfMetric[i].type;
            var label = this.props.typeOfMetric[i].type;
            // var color = '#000'
            // if (typeOfMetric.includes(`${label}`)) {
            //     console.info(typeOfMetric[i])
            // }
            typeOfMetric.push({ label: label, value: key, color: '#000' })
            // this.setState({ typeOfMetric: typeOfMetric })

        }
        // this.props.typeOfMetric.foreach((item) => { 
        //   this.setState({typeOfMetric: typeOfMetric.push(item)})
        // })
    }
    render() {
        return (
            <RNPickerSelect itemKey={this.state.selectedTypeOfMetric}
                style={pickerSelectStyles}
                placeholder={{ label: 'Escolha...' }}
                onValueChange={this.updateUser}
                items={typeOfMetric}>
            </RNPickerSelect>
        )
    }
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: '#fff',
        //paddingRight: 25, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: '#fff',
        //paddingRight: 30, // to ensure the text is never behind the icon
    },
});