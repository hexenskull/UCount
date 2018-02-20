import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';


class SwitchGroup extends Component {
    render() {
        return (
            <View style={styles.container}>
                 <ModalDropdown options={this.props.groupsList} style={styles.dropdown} dropdownStyle={styles.dropdown}/>
                 <TouchableOpacity style={styles.addIconWrpper}>
                    <Icon name="md-add" size={30} />
                 </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // padding: 5,
        flex: 1,
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'center',
        alignContent: 'center',
    },
    addIconWrpper: {
        // flex: 5,
        width: "20%",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    dropdown: {
        // flex: 1,
        width: "80%"
    }
});

export default SwitchGroup;