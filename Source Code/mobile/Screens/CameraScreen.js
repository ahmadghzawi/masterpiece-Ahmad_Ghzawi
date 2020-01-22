import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { storage } from "../config/firebaseConfig";
import Modal from "react-native-modal";
import AddPost from "./AddPostScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class CameraScreen extends Component {
  state = {
    image_path: null,
    progress: 0,
    isVisible: false
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  uploadToFirebase = async blob => {
    let date = Date.now().toString();
    let name = (await AsyncStorage.getItem("user_id")) + "_" + date;

    let status = await storage
      .ref(`uploads/${name}`)
      .put(blob, {
        contentType: "image/jpeg"
      })
      .on(
        "state_changed",
        snapshot => {
          let progressValue = Math.ceil(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          let progress = progressValue == 0 ? 1 : progressValue;
          this.setState({ progress });
        },
        error => {
          console.log(error);
        },
        () => {
          storage
            .ref("uploads")
            .child(name)
            .getDownloadURL()
            .then(image_path => {
              this.setState({ image_path, progress: 0, isVisible: true });
            });
        }
      );
    return status;
  };

  handleChoose = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );

    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        quality: 0.1
      })
        .then(result => {
          if (!result.cancelled) {
            const { uri } = result;
            this.setState({ progress: 1 });
            return this.uriToBlob(uri);
          }
        })
        .then(blob => {
          return this.uploadToFirebase(blob);
        })
        .then(snapshot => {
          console.log("File uploaded");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  handleTake = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraRollPerm === "granted") {
      ImagePicker.launchCameraAsync({
        mediaTypes: "Images",
        quality: 0.1
      })
        .then(result => {
          if (!result.cancelled) {
            const { uri } = result;
            this.setState({ progress: 1 });
            return this.uriToBlob(uri);
          }
        })
        .then(blob => {
          return this.uploadToFirebase(blob);
        })
        .then(snapshot => {
          console.log("File uploaded");
        })
        .then()
        .catch(error => {
          console.log(error);
        });
    }
  };

  isVisible = async (isVisible, from) => {
    await this.setState({ isVisible, progress: 0 });
    if (from !== "cancel") {
      this.props.navigation.navigate("landingStack");
    }
  };

  render() {
    if (this.state.progress > 0)
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#2196f3" />
          <Text>Uploading...</Text>
        </View>
      );
    return (
      <View style={styles.container}>
        <View style={styles.msgContainer}>
          <Text style={styles.msg}>Choose a Photo from Gallery</Text>
          <Text style={styles.msg}>Or</Text>
          <Text style={styles.msg}>Shoot it</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={this.handleChoose}>
            <View style={{ ...styles.button, ...styles.choose }}>
              <Ionicons name="ios-photos" color="white" size={33} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleTake}>
            <View style={styles.button}>
              <Ionicons name="ios-camera" color="white" size={35} />
            </View>
          </TouchableOpacity>
        </View>

        <Modal isVisible={this.state.isVisible}>
          <AddPost
            isVisible={this.isVisible}
            image_path={this.state.image_path}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  msgContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },

  msg: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10
  },

  button: {
    backgroundColor: "#2096F3",
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 100,
    margin: 20,
    marginBottom: 50
  },

  choose: {
    paddingHorizontal: 15
  }
});
