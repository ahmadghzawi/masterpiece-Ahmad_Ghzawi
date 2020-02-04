import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import Modal from "react-native-modal";
import SignUp from "./SignUpScreen";
import axios from "axios";
import { vw, vh } from "react-native-expo-viewport-units";

export default class LoginScreen extends Component {
  state = {
    isLoggedIn: false,
    email: "",
    password: "",
    isVisible: false,
    msg:
      "Email:\n" +
      "\t\t\tmust follow 'username@your-domain.com'\n" +
      "\n" +
      "Password:\n" +
      "\t\t\tmust be at least 8 characters long\n" +
      "\t\t\tmust contain at least one digit\n" +
      "\t\t\tmust contain at least one lower case\n" +
      "\t\t\tmust contain at least one upper case\n"
  };

  authHandler = (event, name) => {
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if (name === "email") {
      let email = event.toLowerCase();
      if (regexEmail.test(event)) this.setState({ email });
      else this.setState({ email: "" });
    }

    if (name === "password") {
      let password = event;
      if (regexPassword.test(event)) this.setState({ password });
      else this.setState({ password: "" });
    }
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

  submitHandler = async () => {
    await this.removeSpace();
    const { email, password } = this.state;
    if (email !== "" && password !== "") {
      axios
        .post("https://ard-w-talab-version-2.herokuapp.com/users/API/auth", {
          email,
          password
        })
        .then(async response => {
          const { _id, name, email, phone_number } = response.data;
          await AsyncStorage.setItem("user_id", _id);
          await AsyncStorage.setItem("phone_number", phone_number);
          await AsyncStorage.setItem("name", name);
          await AsyncStorage.setItem("email", email);

          this.setState({ isLoggedIn: true });
          this.props.navigation.navigate("tabNavigator");
        })
        .catch(error => alert("Invalid Email or Password!"));
    } else {
      // alert("Please enter Email & Password");
      alert(this.state.msg);
    }
  };

  isModalVisibleHandler = async (isVisible, isLoggedIn) => {
    this.setState({ isVisible, isLoggedIn });
    if (isLoggedIn) this.props.navigation.navigate("tabNavigator");
  };

  render() {
    return (
      <>
        <ScrollView>
          <View style={styles.body}>
            <Image
              source={{
                uri:
                  "https://cdn1.iconfinder.com/data/icons/hawcons/32/698889-icon-146-tag-512.png"
              }}
              style={{
                width: vw(75),
                height: vh(40),
                marginTop: vh(-3),
                marginBottom: vh(3)
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="  Email Address"
              placeholderTextColor="darkgrey"
              textContentType="emailAddress"
              autoCapitalize="none"
              onChangeText={event => this.authHandler(event, "email")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Password"
              placeholderTextColor="darkgrey"
              textContentType="password"
              secureTextEntry={true}
              onChangeText={event => this.authHandler(event, "password")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.submitHandler}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Log in</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUp}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{ height: 2, backgroundColor: "gray", width: 40 + "%" }}
              ></View>
              <Text style={{ marginTop: -10 }}>OR</Text>
              <View
                style={{ height: 2, backgroundColor: "gray", width: 40 + "%" }}
              ></View>
            </View>
            <TouchableOpacity
              style={styles.buttonContainerTwo}
              onPress={() => this.isModalVisibleHandler(true)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "bold" }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <Modal isVisible={this.state.isVisible}>
            <SignUp isVisibleHandler={this.isModalVisibleHandler}></SignUp>
          </Modal>
        </ScrollView>
      </>
    );
  }
}

LoginScreen.navigationOptions = {
  title: "3ard w talab"
};

const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    alignItems: "center"
  },
  input: {
    lineHeight: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    width: "90%",
    height: 50,
    borderRadius: 15,
    marginTop: vh(1)
  },
  buttonContainer: {
    marginTop: vh(1),
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#00BFFF"
  },
  buttonContainerTwo: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#cbdcf0"
  },
  signUp: {
    marginTop: vh(10),
    flexDirection: "column",
    alignItems: "center"
  }
});
