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

export default class AddPost extends Component {
  state = {
    sellerID: null,
    postCategories: null,
    location: null,
    name: null,
    additionalInfo: null,
    imgUrl: null
  };

  componentDidMount = async () => {
    let sellerID = await AsyncStorage.getItem("userId");
    let { imgUrl } = this.props;
    this.setState({ sellerID, imgUrl });
  };

  postData = (event, name) => {
    this.setState({ [name]: event });
  };

  submitPost = () => {
    axios
      .post(
        "https://ardwtalabapp.herokuapp.com/posts/API/postAdvertisement",
        this.state
      )
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
       this.props.isVisible(false);
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flexDirection: "row-reverse" }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.isVisible(false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <Text style={{ fontSize: 27, marginBottom: 50 }}>Add Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Post Title"
              onChangeText={event => this.postData(event, "name")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Category"
              onChangeText={event => this.postData(event, "postCategories")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Location"
              onChangeText={event => this.postData(event, "location")}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={event => this.postData(event, "additionalInfo")}
            ></TextInput>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.submitPost}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Add Post
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
    alignItems: "center",
    padding: 30
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
    borderRadius: 2,
    marginTop: 5
  },
  buttonContainer: {
    marginTop: 10,
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
