import React, { Component } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  FlatList
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
    isVisible: false,
    username: null,
    email: null,
    refreshing: false
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
    let name = await AsyncStorage.getItem("username");
    let email = await AsyncStorage.getItem("email");

    this.setState({ userId, phoneNumber, name, email });
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
      .then(() => {
        this.fetchUsersPosts();
        this.setState({ isVisible: false });
      });
  };
  logOut = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("phoneNumber");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("email");
    this.props.navigation.navigate("landingStack");
  };
  // post._id
  isVisible = isVisible => this.setState({ isVisible });

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal isVisible={this.state.isVisible}>
          <ProfileModal
            selectedPost={this.state.selectedPost}
            deletePost={this.deletePost}
            isVisible={this.isVisible}
          ></ProfileModal>
        </Modal>

        <View style={styles.header}>
          <Text style={styles.name}>{`${this.state.name}`}</Text>
          <Text style={styles.name}>{`${this.state.phoneNumber}`}</Text>
          <Text style={styles.name}>{`${this.state.email}`}</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.logOut}
            >
              <Text style={{ color: "white" }}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButtonContainer}
              onPress={this.fetchUsersPosts}
            >
              <Text style={{ color: "white" }}>DEACTIVATE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          keyExtractor={(post, index) => index.toString()}
          data={this.state.posts}
          renderItem={post => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.postInfoHandler(post.item, true);
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
                          source={{ uri: post.imgUrl }}
                          // source={{ uri: 'https://assets.fontsinuse.com/static/use-media-items/17/16215/full-1052x1052/56702c8b/js.png?resolution=0' }}
                          style={{
                            width: vw(20),
                            height: vh(9),
                            borderRadius: 10,
                            margin: vh(0.2)
                          }}
                        />
                      </View>
                      <View
                        style={{
                          margin: vw(1),
                          width: vw(60),
                          borderRadius: 10,
                          backgroundColor: "#2096F3",
                          fontWeight: "400",
                          padding: 8
                        }}
                      >
                        <Text style={{ fontSize: 20, color: "white" }}>
                          {`Name: ${post.item.name}`}
                        </Text>
                        <Text style={{ fontSize: 15, color: "lightgray" }}>
                          {`Category: ${post.item.postCategories}`}
                        </Text>
                        <Text style={{ fontSize: 15, color: "lightgray" }}>
                          {`Location ${post.item.location}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          refreshing={this.state.refreshing}
          onRefresh={this.fetchUsersPosts}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    backgroundColor: "black",
    height: 200,
    justifyContent: "center",
    alignItems: "center"
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
    padding: 30
  },
  name: {
    fontSize: 28,
    color: "white",
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
    marginBottom:10,
    marginTop:10,
    marginRight:10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    borderRadius: 10,
    backgroundColor: "#2096F3"
  },
  deleteButtonContainer: {
    marginBottom:10,
    marginTop:10,
    marginLeft:10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    borderRadius: 10,
    backgroundColor: "red"
  }
});

Profile.navigationOptions = {
  title: "Profile"
};
