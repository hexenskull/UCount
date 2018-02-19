import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class Row extends Component {
    render() {
        const { complete } = this.props;
        const textComponent = (
            // to trigger the edit, need to change View to TouchableOpacity
            <TouchableOpacity style={styles.textWrap} onLongPress={() => this.props.onToggleEdit(true)}>
              <View style={styles.idleTextContainer}>
                <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
              </View>
            </TouchableOpacity>
        )
        const removeButton = (
            <TouchableOpacity onPress={this.props.onRemove}>
              {/* <Text style={styles.destroy}>X</Text> */}
              <Icon size={30} name='close-circle' color="red" />
            </TouchableOpacity>
        )

        const editingComponent = (
            <View style={styles.textWrap}>
              <TextInput
                onChangeText={this.props.onUpdate}
                autoFocus
                value={this.props.text}
                style={styles.input}
                multiline
                keyboardShouldPersistTaps
                onEndEditing={() => this.props.onToggleEdit(false)}
              />
            </View>
        )

        const nothing = (
            <TouchableOpacity/>
            // <TouchableOpacity 
            //   style={styles.done}
            //   onPress={() => this.props.onToggleEdit(false)}
            // >
            //   <Text style={styles.doneText}>Save</Text>
            // </TouchableOpacity>
        )

        return (
            <View style={styles.container}>
                {this.props.editing ? editingComponent : textComponent}
                {this.props.editing ? nothing : removeButton}
            </View>
        );
    }
}

const styles = StyleSheet.create({
  input: {
    height: 100,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: "#4d4d4d"
  },
  container: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems:  "center", // start with content at the top
    justifyContent: "center", // spacing between items in a list view
    backgroundColor: "#fda"
  },
  textWrap: {
    flex: 1,
    marginHorizontal: 10
  },
  complete: {
      textDecorationLine: "line-through"
  },
  text: {
      fontSize: 15,
      color: "#4d4d4d"
  },
  destroy: {
      fontSize: 35,
      color: "#cc9a9a",
      fontWeight: "900",
      paddingRight: 10
  },
  switch: {
      marginTop: 2,
      marginBottom: 2
  },
  idleTextContainer: {
    //   flex: 1,
  }
//   done: {
//       borderRadius: 5,
//       borderWidth: 1,
//       borderColor: "#7be290",
//       padding: 7
//   },
//   doneText: {
//       color: "#4d4d4d",
//       fontSize: 20
//   }
})

export default Row;