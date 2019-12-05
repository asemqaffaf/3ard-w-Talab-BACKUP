import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import { AsyncStorage } from "react-native";
import Profile from "./Screens/ProfileScreen";
import Home from "./Screens/HomeScreen";
import Offers from "./Screens/OffersScreen";
import CameraScreen from "./Screens/CameraScreen";
import LoginScreen from "./Screens/LoginScreen";
import LandingScreen from "./Screens/LandingScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const HomeStack = createStackNavigator({
  Home
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ tintColor }) => (
    <MaterialCommunityIcons color={tintColor} name="home-outline" size={32} />
  )
};
const CameraStack = createStackNavigator({
  CameraScreen
});
CameraStack.navigationOptions = {
  tabBarLabel: "Camera",
  tabBarIcon: prop => (
    <MaterialCommunityIcons color={prop.tintColor} name="camera" size={32} />
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
      size={32}
    ></MaterialCommunityIcons>
  )
};
const OfferStack = createStackNavigator({
  Offers
});

OfferStack.navigationOptions = {
  tabBarLabel: "Offer",
  tabBarIcon: prop => (
    <MaterialCommunityIcons
      name="tag"
      color={prop.tintColor}
      size={32}
    ></MaterialCommunityIcons>
  )
};

const loginStack = createStackNavigator({
  LoginScreen
});

const landingStack = createStackNavigator({
  LandingScreen
});

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CameraStack,
  OfferStack,
  ProfileStack
});

let mainNavigator = createSwitchNavigator({
  landingStack,
  loginStack,
  tabNavigator
});

const container = createAppContainer(mainNavigator);
export default container;
