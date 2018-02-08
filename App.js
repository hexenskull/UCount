import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Platform, ListView, Keyboard, AsyncStorage, ActivityIndicator, TouchableOpacity
} from 'react-native';
import Row from "./row"
import Button from "./button"

class App extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      loading: true,
      allComplete: false,
      value: "",
      items: [],
      dataSource: ds.cloneWithRows([]),
      counter: 0
    }
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.setSource = this.setSource.bind(this);

    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.totalCount}>
          <Text style={styles.totalCountText}>{this.state.items.length} times</Text>
        </View>
        <View style={styles.buttonView}>
          <Button
            onIncrement={this.handleIncrement}
          />
        </View>
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={()=>Keyboard.dismiss()} /*whenever someone scrolls the list the keybord dissapears*/
            renderRow={({key, ... value}) => {
              return (
                <Row 
                  key={key}
                  onUpdate={(text) => this.handleUpdateText(key, text)}
                  onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
                  onRemove={() => this.handleRemoveItem(key)}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  { ... value}
                />
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator}/>
            }}
          />
        </View>
        <View style={styles.clearAllButton}>
          <TouchableOpacity onPress={this.handleClearAll}>
            <Text style={styles.clearAllButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        {this.state.loading && <View style={styles.loading}> 
          <ActivityIndicator
            animating
            size="large"
          />
        </View>}
      </View>
    );
  }

  componentWillMount() {
    AsyncStorage.getItem("items").then((json) => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, { loading: false});
      } catch(e) {
        this.setState({
          loading: false
        })
      }
    })
  }

  setSource(items, itemsDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ... otherState
    })
    AsyncStorage.setItem("items", JSON.stringify(items));
  }
  handleIncrement() {
    var counterNewVal = this.state.counter + 1;
    this.setState({
       counter: counterNewVal
    });
    this.handleAddItem();
  }
  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), { filter })
  }
  handleUpdateText(key, text) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ... item,
        text
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleToggleEditing(key, editing) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ... item,
        editing
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleClearAll() {
    // make sure new items are only with active state
    // const newItems = filterItems("ACTIVE", this.state.items);
    const newItems = [];
    this.setSource(newItems, newItems);
    // this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
      return item.key !== key
    })
    this.setSource(newItems, newItems);
    var counterNewVal = (this.state.counter > 1) ? this.state.counter - 1 : 0;
    this.setState({
       counter: counterNewVal
    });
  }
  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ... item,
        complete
      }
    })
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }
  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ... item,
      complete
    }))
    console.table(newItems);
    this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete})
    // this.setState({
    //   items: newItems,
    //   allComplete: complete
    // })
  }
  handleAddItem() {
    // if(!this.state.value) return;
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
      ... this.state.items
    ]
    // setting what items in todo list should be displayed accourding to chosen filter
    this.setSource(newItems, newItems, { value: "" })
    console.log("item added!");
    // this.setState({
    //   items: newItems,
    //   value: ""
    // })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE'
    // ... Platform.select({
    //   ios: { paddingTop: 30 },
    //   android: { paddingTop: 30 }
    // })
  },
  content: {
    flex: 1
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
  buttonView: {
    flex: 1, 
  },
  totalCount: {
    alignItems: "center",
    justifyContent: "center",
  },
  totalCountText: {
    fontSize: 35,
  },
  clearAllButton: {
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "#BBDEFB",
    borderTopRightRadius: 50,
    width: 75,
  },
  clearAllButtonText: {
    fontSize: 25,
    color: "#000",
  }
})

export default App;
