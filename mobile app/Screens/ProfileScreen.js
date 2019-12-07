import React, { Component } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import Modal from "react-native-modal";
import ProfileModal from "./ProfileModal";
export default class Profile extends Component {
  state = {
    userId: null,
    phoneNumber: null,
    posts: [],
    selectedPost: null,
    isVisible: false
  };
  componentDidMount() {
    this.fetchUsersPosts();
    this.getUserInfo();
  }
  fetchUsersPosts = async () => {
    let sellerID = await AsyncStorage.getItem("userId");
    axios
      .get("https://ardwtalabapp.herokuapp.com/posts/API/getUserPosts", {
        params: {
          sellerID
        }
      })
      .then(res => this.setState({ posts: res.data }))
      .catch(err => console.log(err));
  };
  getUserInfo = async () => {
    let userId = await AsyncStorage.getItem("userId");
    let phoneNumber = await AsyncStorage.getItem("phoneNumber");

    this.setState({ userId, phoneNumber });
  };

  postInfoHandler = (selectedPost, isVisible) => {
    this.setState({ selectedPost, isVisible });
    console.log(selectedPost);
  };
  deletePost = id => {
    console.log(id);
    // `http://localhost:5000/posts/API/deletePost/${id}`
    // '
    axios
      .delete(`https://ardwtalabapp.herokuapp.com/posts/API/deletePost/${id}`)
      .then(res => console.log(res.data))
      .catch(err => alert(err.message))
      .then(this.setState({ isVisible: false }));
  };
  logOut = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("phoneNumber");
    this.props.navigation.navigate("loginStack");
  };
  // post._id
  isVisible = isVisible => this.setState({ isVisible });

  render() {
    this.fetchUsersPosts();
    return (
      <ScrollView style={styles.container}>
        <Modal isVisible={this.state.isVisible}>
          <ProfileModal
            selectedPost={this.state.selectedPost}
            deletePost={this.deletePost}
            isVisible={this.isVisible}
          ></ProfileModal>
        </Modal>
        <View style={styles.header}></View>
        <Image
          style={styles.avatar}
          source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
        />
        <View style={styles.bodyContent}>
          <Text
            style={styles.name}
          >{`Phone number ${this.state.phoneNumber}`}</Text>
          <Text style={styles.info}> Web designer / Mobile developer</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum
            electram expetendis, omittam deseruisse consequuntur ius an,
          </Text>

          {this.state.posts.map((post, index) => {
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    this.postInfoHandler(post, true);
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start"
                      }}
                    >
                      <View>
                        <Image
                          source={{
                            uri: post.imgUrl
                          }}
                          style={{
                            width: vw(20),
                            height: vh(9),
                            borderRadius: 40,
                            margin: vh(0.2)
                          }}
                        />
                      </View>
                      <View
                        style={{
                          margin: vw(1),
                          width: vw(60),
                          borderRadius: 10,
                          backgroundColor: "#4280c8",
                          fontWeight: "400",
                          padding: 10,
                          marginTop: vh(2)
                        }}
                      >
                        <Text style={{ fontSize: 20, color: "white" }}>
                          {post.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.logOut}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButtonContainer}
            onPress={this.fetchUsersPosts}
          >
            <Text style={{ color: "white" }}>DELETE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "black",
    height: 200
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130
  },
  name: {
    fontSize: 22,
    fontWeight: "600"
  },

  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    marginTop: 40
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  },
  deleteButtonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "tomato"
  }
});

Profile.navigationOptions = {
  title: "Profile"
};
