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
import AppStateListener from "react-native-appstate-listener";
import Row from "./row";
import Button from "./button";
import SoundPlayer from "react-native-sound-player";
import Icon from "react-native-vector-icons/Entypo";

//var Sound = require('react-native-sound');
//var clickSound = null;

class App extends Component {
  backIcon = <Icon name="back" size={40} color="#900" />;
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
      isUndoButtonActive: false
    };
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.setSource = this.setSource.bind(this);

    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Icon name="rocket" size={30} color="#900" /> */}
        <AppStateListener onActive={() => Keyboard.dismiss()}>
          {" "}
        </AppStateListener>
        <View style={styles.totalCount}>
          <Text style={styles.totalCountText}>
            {this.state.items.length} times
          </Text>
        </View>
        <View style={this.buttonViewStyle()}>
          <Button onIncrement={this.handleIncrement} />
        </View>
        <View style={styles.content} onScroll={() => Keyboard.dismiss()}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            //onScroll={()=>Keyboard.dismiss()} /*whenever someone scrolls the list the keybord dissapears*/
            renderRow={({ key, ...value }) => {
              return (
                <Row
                  key={key}
                  onUpdate={text => this.handleUpdateText(key, text)}
                  onToggleEdit={editing =>
                    this.handleToggleEditing(key, editing)
                  }
                  onRemove={() => this.handleRemoveItem(key)}
                  onComplete={complete =>
                    this.handleToggleComplete(key, complete)
                  }
                  {...value}
                />
              );
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator} />;
            }}
          />
        </View>
        <View style={styles.clearAllButton}>
          <TouchableOpacity onPress={this.handleClearAll}>
            <Text style={styles.clearAllButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.backButtonView}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleUndo}>
            {this.backIcon}
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

  componentDidMount() {
    SoundPlayer.onFinishedPlaying((success: boolean) => {
      // success is true when the sound is played
      console.log("finished playing", success);
    });
  }

  componentWillMount() {
    // unsubscribe when unmount
    SoundPlayer.unmount();

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
  handleUndo() {
    console.log("undo pressed");
  }
  handleIncrement() {
    console.log(`incrementing`);
    var counterNewVal = this.state.counter + 1;
    this.setState({
      counter: counterNewVal
    });
    this.handleAddItem();
    try {
      SoundPlayer.playSoundFile("clickgood", "wav");
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
    // clickSound.play((success) => {
    //   if (!success) {
    //     console.log('Sound did not play')
    //   }
    // });
  }
  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), {
      filter
    });
  }
  handleUpdateText(key, text) {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) return item;
      return {
        ...item,
        text
      };
    });

    this.setSource(newItems, newItems);
  }
  handleToggleEditing(key, editing) {
    const newItems = this.state.items.map(item => {
      if (editing) this.state.flexValOfButtonView = 0.5;
      else this.state.flexValOfButtonView = 1;
      if (item.key !== key) return item;
      return {
        ...item,
        editing
      };
    });
    this.setSource(newItems, newItems);
  }
  handleClearAll() {
    // make sure new items are only with active state
    // const newItems = filterItems("ACTIVE", this.state.items);
    const newItems = [];
    this.setSource(newItems, newItems);
    // this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleRemoveItem(key) {
    const newItems = this.state.items.filter(item => {
      return item.key !== key;
    });
    this.setSource(newItems, newItems);
    var counterNewVal = this.state.counter > 1 ? this.state.counter - 1 : 0;
    this.setState({
      counter: counterNewVal
    });
  }
  handleAddItem() {
    // if(!this.state.value) return;
    this.state.flexValOfButtonView = 1;
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    const newItems = [
      {
        key: Date.now(),
        // text: this.state.value,
        // text: Date.now().stringify,
        text: n + " " + time,
        complete: false
      },
      ...this.state.items
    ];
    // setting what items in todo list should be displayed accourding to chosen filter
    this.setSource(newItems, newItems, { value: "" });
    // this.setState({
    //   items: newItems,
    //   value: ""
    // })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEBEE",
    ...Platform.select({
      ios: { paddingTop: 20 }
      //android: { paddingTop: 30 }
    })
  },
  content: {
    flex: 1,
  },
  list: {
    // backgroundColor: '#fdfdfd'
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
  },
  loading: {
    // tell the view to cover everything
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.2)"
  },
  // buttonView: {
  //   flex: {this.state.flexValOfButtonView},
  // },
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
    position: "absolute",
    top: 1,
    left: 1
    // borderRadius: 10,
    // flex: 1,
    // bottom: 0,
    // left: 0
  },
  backButton: {
    // position: "absolute",
    // left: 0,
    // top: 0,
    borderTopRightRadius: 50
  },
  backIcon: {
    flex: 1
  }
});

export default App;
