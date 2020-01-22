import { Component } from "react";
import { AsyncStorage } from "react-native";

export default class LandingScreen extends Component {
  async componentDidMount() {
    let user = await AsyncStorage.getItem("user_id");
    if (user != null) {
      this.props.navigation.navigate("tabNavigator");
    } else {
      this.props.navigation.navigate("loginStack");
    }
  }

  render() {
    return null;
  }
}
