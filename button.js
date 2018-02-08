import React, { Component } from 'react';
import { Text, StyleSheet, View, Switch, TouchableOpacity, TextInput, Keyboard } from 'react-native';

class Button extends Component {
    render() {
        // const bigButton = (
        //     // to trigger the edit, need to change View to TouchableOpacity
        // )
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.bigButtonOpacity} onPress={() => this.props.onIncrement()} >
                    {/* <View style={styles.bigButton} 
                    /> */}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,  
    },
    bigButton: {
        flex: 1,
        // position: "absolute",
        // left: 0,
        // top: 0,
        // bottom: 0,
        // right: 0,
        // backgroundColor: "#E53935",
        // margin: 10,  
        // borderRadius: 100,
        // borderColor: "#909090",
        // borderWidth: 20,
    },
    bigButtonOpacity: {
        flex: 1,
        borderRadius: 100,
        backgroundColor: "#E53935",
        margin: 10,  
        borderColor: "#404040",
        borderWidth: 20,
    }
})

export default Button;