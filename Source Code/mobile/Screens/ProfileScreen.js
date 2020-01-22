import React, { Component } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  FlatList
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import Modal from "react-native-modal";
import ProfileModal from "./ProfileModal";
import EditProfileModal from "./EditProfileModal";

export default class Profile extends Component {
  state = {
    user_id: null,
    name: null,
    email: null,
    phone_number: null,

    posts: [],

    selectedPost: null,
    isVisible: false,

    refreshing: false,

    editModalIsVisible: false
  };

  async componentDidMount() {
    await this.getUserInfo();
    this.fetchUsersPosts();
  }

  fetchUsersPosts = async () => {
    let seller_id = this.state.user_id;
    axios
      .get(
        "https://ard-w-talab-version-2.herokuapp.com/posts/API/getUserProducts",
        {
          params: {
            seller_id
          }
        }
      )
      .then(res => {
        this.setState({ posts: res.data });
      })
      .catch(err => console.log(err));
  };

  getUserInfo = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    let phone_number = await AsyncStorage.getItem("phone_number");
    let name = await AsyncStorage.getItem("name");
    let email = await AsyncStorage.getItem("email");

    await this.setState({ user_id, phone_number, name, email });
  };

  postInfoHandler = (selectedPost, isVisible) => {
    this.setState({ selectedPost, isVisible });
  };

  deletePost = id => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deletePost/${id}`
      )
      .then()
      .catch(err => alert(err.message))
      .then(() => {
        this.fetchUsersPosts();
        this.setState({ isVisible: false });
      });
  };

  logOut = async () => {
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem("phone_number");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("email");

    this.props.navigation.navigate("landingStack");
  };

  deactivateAccountHandler = async () => {
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteUserPosts/${this.state.user_id}`
      )
      .then()
      .catch(err => console.log(err))
      .then(
        axios
          .delete(
            `https://ard-w-talab-version-2.herokuapp.com/users/API/delete/${this.state.user_id}`
          )
          .then()
          .catch(err => console.log(err))
      )
      .then(() => this.logOut());
  };

  editModalIsVisible = (editModalIsVisible, info) =>
    this.setState({ editModalIsVisible, ...info });

  isVisible = isVisible => this.setState({ isVisible });

  render() {
    let { user_id, name, email, phone_number } = this.state;
    let info = {
      user_id,
      name,
      email,
      phone_number
    };
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Modal isVisible={this.state.isVisible}>
          <ProfileModal
            selectedPost={this.state.selectedPost}
            deletePost={this.deletePost}
            isVisible={this.isVisible}
          ></ProfileModal>
        </Modal>

        <Modal isVisible={this.state.editModalIsVisible}>
          <EditProfileModal
            info={info}
            isVisible={this.editModalIsVisible}
          ></EditProfileModal>
        </Modal>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.setState({ editModalIsVisible: true })}
          >
            <Text style={styles.name}>{`${this.state.name}`}</Text>
            <Text style={styles.name}>{`${this.state.phone_number}`}</Text>
            <Text style={styles.name}>{`${this.state.email}`}</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10
            }}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.logOut}
            >
              <Text style={{ color: "white" }}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButtonContainer}
              onPress={this.deactivateAccountHandler}
            >
              <Text style={{ color: "white" }}>DEACTIVATE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          keyExtractor={post => post._id}
          data={this.state.posts}
          renderItem={post => {
            return (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.postInfoHandler(post.item, true);
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start"
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: post.item.image_path }}
                          style={{
                            width: vw(20),
                            height: vh(8),
                            borderRadius: 8,
                            margin: vw(1)
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: vw(70),
                          borderRadius: 8,
                          backgroundColor: "#2096F3",
                          fontWeight: "400",
                          padding: 10
                        }}
                      >
                        <Text style={{ fontSize: 20, color: "white" }}>
                          {`Title: ${post.item.title}`}
                        </Text>
                        <Text style={{ fontSize: 15, color: "lightgray" }}>
                          {`Category: ${post.item.product_category}`}
                        </Text>
                        <Text style={{ fontSize: 15, color: "lightgray" }}>
                          {`Location: ${post.item.location}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          refreshing={this.state.refreshing}
          onRefresh={this.fetchUsersPosts}
        />
      </View>
    );
  }
}

Profile.navigationOptions = {
  title: "Profile"
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    paddingTop: 30,
    backgroundColor: "black",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130
  },
  name: {
    fontSize: 22,
    fontWeight: "600"
  },

  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30
  },
  name: {
    fontSize: 28,
    color: "white",
    fontWeight: "600",
    textAlign: "center"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },

  buttonContainer: {
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    borderRadius: 10,
    backgroundColor: "#2096F3"
  },
  deleteButtonContainer: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    borderRadius: 10,
    backgroundColor: "red"
  }
});
