import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  AsyncStorage
} from "react-native";
import axios from "axios";
import { vh } from "react-native-expo-viewport-units";

export default class AddPost extends Component {
  state = {
    seller_id: null,
    product_category: null,
    location: null,
    title: null,
    info: null,
    bid: null,
    image_path: null
  };

  async componentDidMount() {
    let seller_id = await AsyncStorage.getItem("user_id");
    let { image_path } = this.props;
    this.setState({ seller_id, image_path });
  }

  postData = (event, name) => {
    this.setState({ [name]: event });
  };

  removeSpace = () => {
    for (let key in this.state) {
      if (typeof this.state[key] === "string") {
        while (this.state[key][this.state[key].length - 1] === " ") {
          this.state[key] = this.state[key].slice(0, -1);
        }
      }
    }
  };

  submitPost = async () => {
    await this.removeSpace();
    axios
      .post(
        "https://ard-w-talab-version-2.herokuapp.com/posts/API/newProduct",
        this.state
      )
      .then()
      .catch(err => console.log(err));
    this.props.isVisible(false, "submitted");
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5 }}>
              Add Post
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.isVisible(false, "cancel")}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <TextInput
              style={styles.input}
              placeholder="  Post Title"
              placeholderTextColor="darkgrey"
              onChangeText={event => this.postData(event, "title")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Category"
              placeholderTextColor="darkgrey"
              onChangeText={event => this.postData(event, "product_category")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Location"
              placeholderTextColor="darkgrey"
              onChangeText={event => this.postData(event, "location")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Info"
              placeholderTextColor="darkgrey"
              onChangeText={event => this.postData(event, "info")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Starting Price"
              placeholderTextColor="darkgrey"
              keyboardType="number-pad"
              onChangeText={event => this.postData(event, "bid")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.submitPost}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Add Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 20,
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30
  },
  backButton: {
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    width: 50,
    borderRadius: 10,
    backgroundColor: "#cbdcf0"
  },
  input: {
    lineHeight: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    width: "90%",
    height: 50,
    borderRadius: 15,
    marginTop: vh(3)
  },
  buttonContainer: {
    marginTop: vh(8),
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#00BFFF"
  }
});
