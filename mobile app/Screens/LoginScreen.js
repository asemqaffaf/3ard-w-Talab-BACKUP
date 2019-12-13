import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  YellowBox
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
    isVisible: false
  };
   componentDidMount() {
    this.load()
    YellowBox.ignoreWarnings(["Warning: Can't perform a React state update on an unmounted component"])

  }
  load = async ()=>{
    let getter = await AsyncStorage.getItem("userId");
    if (getter !== null) {
      this.setState({
        isLoggedIn: true
      });
      // this.props.navigation.navigate("tabNavigator");
    } else {
      this.setState({
        isLoggedIn: false
      });
    }

  }
  AuthHandler = (event, name) => {
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    const regexPassword = /^[0-9a-zA-Z]{8,}$/;
    if (name === "email") {
      this.state.email = event;
      if (regexEmail.test(event)) {
        this.setState({
          email: this.state.email
        });
      }
    } else if (name === "password") {
      this.state.password = event;
      if (regexPassword.test(event)) {
        this.setState({
          [name]: event
        });
      }
    }
  };
  submitHandler = async () => {
    axios
      .get("https://ardwtalabapp.herokuapp.com/users/API/auth", {
        params: {
          email: this.state.email.toLowerCase(),
          password: this.state.password
        }
      })
      .then(async response => {
        await AsyncStorage.setItem("userId", response.data.userId);
        await AsyncStorage.setItem("phoneNumber", response.data.phoneNumber);
        await AsyncStorage.setItem("username", response.data.username);
        await AsyncStorage.setItem("email", response.data.email);
        this.setState({
          isLoggedIn: true,
          getId: await AsyncStorage.getItem("userId")
        });
        this.props.navigation.navigate("tabNavigator");
      })
      .catch(err => {
        this.setState({
          isLoggedIn: false
        });
        alert('Invalid email or password!');
      });
  };

  isModalVisibleHandler = async  (isVisible, isLoggedIn) => {
     this.setState({
      isVisible,
      isLoggedIn
    });
    if (isLoggedIn) {
      this.props.navigation.navigate("tabNavigator");
    }
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
              style={{ width: vw(75), height: vh(40), marginTop:vh(-3), marginBottom: vh(3)}}
            />

            <TextInput
              style={styles.input}
              placeholder="  Email Address"
              placeholderTextColor='darkgrey'
              textContentType="emailAddress"
              onChangeText={event => this.AuthHandler(event, "email")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="  Password"
              placeholderTextColor='darkgrey'
              textContentType="password"
              secureTextEntry={true}
              onChangeText={event => this.AuthHandler(event, "password")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.submitHandler}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Log in
              </Text>
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
