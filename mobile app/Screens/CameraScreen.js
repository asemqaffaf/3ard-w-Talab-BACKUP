import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { storage } from "../config/firebaseConfig";
import Modal from "react-native-modal";
import AddPost from "./AddPostScreen";
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
            const { height, width, type, uri } = result;
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

  isVisible = (condition) => {
    this.setState({ isVisible: condition });
    this.props.navigation.navigate("landingStack");
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Button
            style={styles.button}
            onPress={this.handleChoose}
            title="Choose"
          />
        </View>

        <View>
          <Button
            style={styles.button}
            onPress={this.handleTake}
            title="Take"
          />
        </View>

        <Modal isVisible={this.state.isVisible}>
          <AddPost isVisible={this.isVisible} imgUrl={this.state.url} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  buttonTake: {
    alignSelf: "baseline"
  },

  buttonChoose: {}
});
