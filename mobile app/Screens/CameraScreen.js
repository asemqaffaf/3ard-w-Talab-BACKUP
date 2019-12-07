import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { storage } from "../config/firebaseConfig";
import Modal from "react-native-modal";
import AddPost from "./AddPostScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class FirebaseStorageUploader extends Component {
  state = {
    url: null,
    name: null,
    progress: 0,
    isVisible: false
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  uploadToFirebase = async blob => {
    console.log("UPLOAD");
    let name = Date.now().toString();
    this.state.name = name;

    let status = await storage
      .ref(`uploads/${name}`)
      .put(blob, {
        contentType: "image/jpeg"
      })
      .on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          console.log(error);
        },
        () => {
          storage
            .ref("uploads")
            .child(name)
            .getDownloadURL()
            .then(url => {
              this.setState({ url, isVisible: true });
            });
        }
      );
    return status;
  };

  handleChoose = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );

    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images"
      })
        .then(result => {
          if (!result.cancelled) {
            const { uri } = result;
            return this.uriToBlob(uri);
          }
        })
        .then(blob => {
          return this.uploadToFirebase(blob);
        })
        .then(snapshot => {
          console.log("File uploaded");
        })
        .then()
        .catch(error => {
          throw error;
        });
    }
  };

  handleTake = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraRollPerm === "granted") {
      ImagePicker.launchCameraAsync({
        mediaTypes: "Images"
      })
        .then(result => {
          if (!result.cancelled) {
            const { uri } = result;
            return this.uriToBlob(uri);
          }
        })
        .then(blob => {
          return this.uploadToFirebase(blob);
        })
        .then(snapshot => {
          console.log("File uploaded");
        })
        .then()
        .catch(error => {
          throw error;
        });
    }
  };

  isVisible = condition => {
    this.setState({ isVisible: condition, progress: 0 });
    this.props.navigation.navigate("landingStack");
  };

  render() {
    if (this.state.progress > 0)
      return (
        <View style={styles.activity}>
          <ActivityIndicator size={75} color="#2196f3" />
          <Text>Uploading...</Text>
        </View>
      );
    return (
      <View style={styles.container}>
        <View style={styles.msgContainer}>
          <Text style={styles.msg}>choose a photo from gallery</Text>
          <Text style={styles.msg}>or</Text>
          <Text style={styles.msg}>shoot it</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={this.handleChoose}>
            <View style={{ ...styles.button, ...styles.choose }}>
              <Ionicons name="ios-photos" color="white" size={33} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleTake}>
            <View style={styles.button}>
              <Ionicons name="ios-camera" color="white" size={35} />
            </View>
          </TouchableOpacity>
        </View>

        <Modal isVisible={this.state.isVisible}>
          <AddPost isVisible={this.isVisible} imgUrl={this.state.url} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  msgContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },

  msg: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10
  },

  button: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 100,
    margin: 20,
    marginBottom: 50
  },

  choose: {
    paddingHorizontal: 15
  }
});
