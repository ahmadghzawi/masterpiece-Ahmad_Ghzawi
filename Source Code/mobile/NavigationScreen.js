import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import Profile from "./Screens/ProfileScreen";
import Home from "./Screens/HomeScreen";
import Offers from "./Screens/OffersScreen";
import CameraScreen from "./Screens/CameraScreen";
import LoginScreen from "./Screens/LoginScreen";
import LandingScreen from "./Screens/LandingScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const HomeStack = createStackNavigator({
  Home
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ tintColor }) => (
    <MaterialCommunityIcons color={tintColor} name="home-outline" size={35} />
  )
};
const CameraStack = createStackNavigator({
  CameraScreen
});
CameraStack.navigationOptions = {
  tabBarLabel: "Camera",
  tabBarIcon: prop => (
    <MaterialCommunityIcons color={prop.tintColor} name="camera" size={35} />
  )
};
const ProfileStack = createStackNavigator({
  Profile
});
ProfileStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: prop => (
    <MaterialCommunityIcons
      name="account"
      color={prop.tintColor}
      size={35}
    ></MaterialCommunityIcons>
  )
};
const OfferStack = createStackNavigator({
  Offers
});

OfferStack.navigationOptions = {
  tabBarLabel: "Offers",
  tabBarIcon: prop => (
    <MaterialCommunityIcons
      name="tag"
      color={prop.tintColor}
      size={35}
    ></MaterialCommunityIcons>
  )
};

const loginStack = createStackNavigator({
  LoginScreen
});

const landingStack = createStackNavigator({
  LandingScreen
});

const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    CameraStack,
    OfferStack,
    ProfileStack
  },
  {
    tabBarOptions: {
      style: { height: Math.floor(Dimensions.get("window").height * 0.075) }
    }
  }
);

let mainNavigator = createSwitchNavigator({
  landingStack,
  loginStack,
  tabNavigator
});

const container = createAppContainer(mainNavigator);
export default container;
