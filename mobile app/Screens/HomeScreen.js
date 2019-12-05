import React, { Component } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import axios from "axios";
import Modal from "react-native-modal";
import PostScreen from "./PostScreen";

export default class Home extends Component {
  state = {
    posts: [],
    post: null,
    isVisible: false,
    width: Math.floor(Dimensions.get("window").width / 3)-2,
    refreshing: false
  };

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    axios
      .get("https://ardwtalabapp.herokuapp.com/posts/API/data")
      .then(res => {
        this.setState({
          posts: res.data,
          refreshing: false
        });
      })
      .catch(err => console.log({ message: err.message }));
  };

  isVisible = (condition, post) => {
    this.setState({ isVisible: condition, post });
  };

  render() {
    let { width, posts, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={post => post._id}
          data={posts}
          numColumns={3}
          renderItem={post => {
            return (
              <TouchableOpacity onPress={() => this.isVisible(true, post.item)}>
                <Image
                  source={{ uri: post.item.imgUrl }}
                  style={{ width, height: width, margin: 1 }}
                />
              </TouchableOpacity>
            );
          }}
          refreshing={refreshing}
          onRefresh={this.getPosts}
        />
        <Modal isVisible={this.state.isVisible}>
          <PostScreen
            isVisible={this.isVisible}
            post={this.state.post}
            getPosts={this.getPosts}
          />
        </Modal>
      </View>
    );
  }
}

Home.navigationOptions = {
  title: "Home"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  }
});
