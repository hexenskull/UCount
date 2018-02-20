
import React, { Component } from "react";
import {
  AppState,
  StyleSheet,
  Text,
  View,
  Platform,
  ListView,
  Keyboard,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import ModalDropdown from 'react-native-modal-dropdown';

// const DropDown = require('react-native-dropdown');
// const {
//   Select,
//   Option,
//   OptionList,
//   updatePosition
// } = DropDown;

import AppStateListener from "react-native-appstate-listener";
// import Row from "./row";
import Button from "../../components/Button/Button";
import SwitchGroup from "../../components/SwitchGroup/SwitchGroup"
import Icon from "react-native-vector-icons/Entypo";

class MainClickScreen extends React.Component {
  backIcon = <Icon name="back" size={40} color="#900" />;

  static navigatorStyle = {
    // drawUnderNavBar: true,
    // navBarTranslucent: true
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      loading: true,
      allComplete: false,
      value: "",
      items: [],
      dataSource: ds.cloneWithRows([]),
      counter: 0,
      flexValOfButtonView: 1,
      isUndoButtonActive: false,
      groupsList: ['option 1', 'option 2'],
    };

    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.setSource = this.setSource.bind(this);

    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <AppStateListener onActive={() => Keyboard.dismiss()}>
          {" "}
        </AppStateListener>

        <View style={styles.switchGroupWrapper}>
        <SwitchGroup groupsList={this.state.groupsList}/>
        </View>

        <View style={styles.totalCount}>
          <Text style={styles.totalCountText}>
            {this.state.items.length} times
          </Text>
        </View>
        <View style={this.buttonViewStyle()}>
          <Button onIncrement={this.handleIncrement} />
        </View>
        <View style={styles.content} onScroll={() => Keyboard.dismiss()}>
        <View style={styles.backButtonView}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleRemoveItem}>
            {this.backIcon}
          </TouchableOpacity>
        </View>
          
        </View>
        <View style={styles.clearAllButton}>
          <TouchableOpacity onPress={this.handleClearAll}>
            <Text style={styles.clearAllButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {this.state.loading && (
          <View style={styles.loading}>
            <ActivityIndicator animating size="large" />
          </View>
        )}
      </View>
    );
  }

  buttonViewStyle() {
    return {
      flex: this.state.flexValOfButtonView
    };
  }

  componentWillMount() {

    AsyncStorage.getItem("items").then(json => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, { loading: false });
        // Keyboard.dismiss();
      } catch (e) {
        this.setState({
          loading: false
        });
      }
    });
  }

  setSource(items, itemsDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    });
    AsyncStorage.setItem("items", JSON.stringify(items));
  }
  handleIncrement() {
    console.log(`incrementing`);
    var counterNewVal = this.state.counter + 1;
    this.setState({
      counter: counterNewVal
    });
    this.handleAddItem();
  }
  handleClearAll() {
    const newItems = [];
    this.setSource(newItems, newItems);
  }
  handleRemoveItem() {
    const splicedItem = this.state.items.splice(-1,1);
    const newItems = this.state.items.filter(item => {
      return item.key !== splicedItem.key;
    });
    this.setSource(newItems, newItems);
    var counterNewVal = this.state.counter > 1 ? this.state.counter - 1 : 0;
    this.setState({
      counter: counterNewVal
    });
  }
  handleAddItem() {
    this.state.flexValOfButtonView = 1;
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    const newItems = [
      {
        key: Date.now(),
        text: n + " " + time,
        complete: false
      },
      ...this.state.items
    ];
    this.setSource(newItems, newItems, { value: "" });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFECB3",
    ...Platform.select({
      ios: { paddingTop: 20 }
    })
  },
  switchGroupWrapper: {
    flex: 0.1,
    padding: 5,
  },
  content: {
    flex: 1,
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.2)"
  },
  totalCount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  totalCountText: {
    flex: 1,
    fontSize: 35,
    textAlign: "center"
  },
  clearAllButton: {
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "#BBDEFB",
    borderTopRightRadius: 50,
    width: 75
  },
  clearAllButtonText: {
    fontSize: 25,
    color: "#000"
  },
  backButtonView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    borderRadius: 25,
    backgroundColor: "#FFFF",
    padding: 5,
    borderWidth: 2,
    borderColor: "#333"
  },
  backIcon: {
    flex: 1
  }
});

export default MainClickScreen;
