import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, AsyncStorage} from 'react-native'
import axios from 'axios'

export default class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: ''
  }
  signUpHandler = (event, name) => {
    const regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
    const regexPassword = /^[0-9a-zA-Z]{8,}$/
    const regexName = /^[a-zA-Z]{3,}$/
    if (name === 'name') {
      this.state.name = event
      if (regexName.test(event)) {
        this.setState({
          name: event
        })
      }
    }
    else if (name === 'email') {
      this.state.email = event
      if (regexEmail.test(event)) {
        this.setState({
          email: event
        })
      }
    }
    else if (name === 'password') {
      this.state.password = event
      if (regexPassword.test(event)) {
        this.setState({
          [name]: event
        })
      }
    }
  }

  submitHandler = () => {
    if (this.state.name != '' && this.state.email != '' && this.state.password != '') {
      // axios.post('http://192.168.86.33:9002/users/API/new', {
      axios.post('https://ardwtalabapp.herokuapp.com/users/API/new', {

        name: this.state.name,
        "email": this.state.email,
        "password": this.state.password
      })
        .then(async response => {
          await AsyncStorage.setItem("userId",response.data._id)
          this.props.isVisibleHandler(false, true)
        })
        .catch(error => {
          alert(error.message)

        })
    }

  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row-reverse' }} >
            <TouchableOpacity style={styles.backButton} onPress={this.props.isVisibleHandler.bind(this, false, false)}>
              <Text style={{ color: '#4280c8', fontWeight: '400' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <Text style={{ fontSize: 27, marginBottom: 50 }}>Sign up</Text>
            <TextInput style={styles.input} placeholder="  Full name" textContentType="emailAddress" onChangeText={(event) => this.signUpHandler(event, 'name')}></TextInput>
            <TextInput style={styles.input} placeholder="  Email Address" textContentType="emailAddress" onChangeText={(event) => this.signUpHandler(event, 'email')}></TextInput>
            <TextInput style={styles.input} placeholder="  Password" textContentType='password' secureTextEntry={true} onChangeText={(event) => this.signUpHandler(event, 'password')} ></TextInput>
            <TouchableOpacity style={styles.buttonContainer} onPress={this.submitHandler}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 20,
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,

  },
  backButton: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 50,
    borderRadius: 10,
    backgroundColor: "#cbdcf0",
  },
  input: {
    lineHeight: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    width: '90%',
    height: 50,
    borderRadius: 2,
    marginTop: 5
  },
  buttonContainer: {
    marginTop: 10,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    borderRadius: 10,
    backgroundColor: "#00BFFF",
  },
});
