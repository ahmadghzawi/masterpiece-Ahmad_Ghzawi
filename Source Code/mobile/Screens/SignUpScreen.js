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

export default class SignUp extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    phone_number: "",
    msg:
      "Full Name:\n" +
      "\t\t\tmust at least 3 characters long (only letters)\n" +
      "\n" +
      "Email:\n" +
      "\t\t\tmust follow 'username@your-domain.com'\n" +
      "\n" +
      "Password:\n" +
      "\t\t\tmust be at least 8 characters long\n" +
      "\t\t\tmust contain at least one digit\n" +
      "\t\t\tmust contain at least one lower case\n" +
      "\t\t\tmust contain at least one upper case\n" +
      "\n" +
      "Phone Number:\n" +
      "\t\t\tmust be at least 9 digits long'\n"
  };

  formHandler = (event, name) => {
    const regexName = /^[a-zA-Z][^#&<>"~;.=+*!@%^&()[\]/,$^%{}?123456789]{2,29}$/;
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    const regexPassword = /^[0-9a-zA-Z]{8,}$/;
    const regexPhoneNumber = /^[0-9]{9,}$/;

    if (name === "name") {
      let name = event;
      if (regexName.test(event)) this.setState({ name });
      else this.setState({ name: "" });
    }

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

    if (name === "phone_number") {
      let phone_number = event;
      if (regexPhoneNumber.test(event)) this.setState({ phone_number });
      else this.setState({ phone_number: "" });
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
    const { name, email, password, phone_number } = this.state;
    if (name !== "" && email !== "" && password !== "" && phone_number !== "") {
      axios
        .post(
          "https://ard-w-talab-version-2.herokuapp.com/users/API/new",
          this.state
        )
        .then(async response => {
          const { _id, name, email, phone_number } = response.data;
          await AsyncStorage.setItem("user_id", _id);
          await AsyncStorage.setItem("phone_number", phone_number);
          await AsyncStorage.setItem("name", name);
          await AsyncStorage.setItem("email", email);
          this.props.isVisibleHandler(false, true);
        })
        .catch(error => alert("Email already exists "));
    } else alert(this.state.msg);
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5 }}>
              Registration
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={this.props.isVisibleHandler.bind(this, false, false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <TextInput
              style={styles.input}
              placeholder="  Full name"
              placeholderTextColor="darkgrey"
              textContentType="name"
              onChangeText={event => this.formHandler(event, "name")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Email Address"
              placeholderTextColor="darkgrey"
              textContentType="emailAddress"
              autoCapitalize="none"
              onChangeText={event => this.formHandler(event, "email")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Password"
              placeholderTextColor="darkgrey"
              textContentType="password"
              secureTextEntry={true}
              onChangeText={event => this.formHandler(event, "password")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Phone number"
              placeholderTextColor="darkgrey"
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              onChangeText={event => this.formHandler(event, "phone_number")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.submitHandler}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Register
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
    alignItems: "center"
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
