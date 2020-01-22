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
    user_id: this.props.info.user_id,
    name: this.props.info.name,
    email: this.props.info.email,
    phone_number: this.props.info.phone_number,
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

  checkForm = () => {
    const regexName = /^[a-zA-Z][^#&<>"~;.=+*!@%^&()[\]/,$^%{}?123456789]{2,29}$/;
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    const regexPhoneNumber = /^[0-9]{9,}$/;

    const { name, email, phone_number } = this.state;
    if (
      regexName.test(name) &&
      regexEmail.test(email) &&
      regexPhoneNumber.test(phone_number)
    ) {
      return true;
    }
    return false;
  };

  saveHandler = async () => {
    await this.removeSpace();
    let toProceed = await this.checkForm();
    if (toProceed) {
      const { user_id, name, email, phone_number } = this.state;
      axios
        .put(
          `https://ard-w-talab-version-2.herokuapp.com/users/API/editProfile/${user_id}/${name}/${email}/${phone_number}`
        )
        .then(async response => {
          const { name, email, phone_number } = this.state;
          await AsyncStorage.setItem("phone_number", phone_number);
          await AsyncStorage.setItem("name", name);
          await AsyncStorage.setItem("email", email);
          this.props.isVisible(false, this.state);
        })
        .catch(error => alert(error.message));
    } else {
      alert("Please check your info fields!\n\n" + this.state.msg);
    }
  };

  render() {
    let { name, email, phone_number } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5 }}>
              Edit Profile
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.isVisible(false, false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="  Full name"
              placeholderTextColor="darkgrey"
              textContentType="name"
              onChangeText={event => this.formHandler(event, "name")}
            ></TextInput>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="  Email Address"
              placeholderTextColor="darkgrey"
              textContentType="emailAddress"
              autoCapitalize="none"
              onChangeText={event => this.formHandler(event, "email")}
            ></TextInput>
            <TextInput
              style={styles.input}
              value={phone_number}
              placeholder="  Phone number"
              placeholderTextColor="darkgrey"
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              onChangeText={event => this.formHandler(event, "phone_number")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.saveHandler}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
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
    backgroundColor: "green"
  }
});
