import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  AsyncStorage,
  Image,
  Dimensions
} from "react-native";
import axios from "axios";

export default class AddPost extends Component {
  state = {
    width: Dimensions.get("window").width,
    offer: null,
    pendingOffer: null,
    showOffer: false
  };

  componentDidMount(){
    this.getOffer()
  }

  getOffer = async () => {
    let userId = await AsyncStorage.getItem('userId') 
    let offer = Object.keys(this.props.post).filter(offer => offer === userId)
    if(offer[0]){
      this.setState({offer:this.props.post[offer[0]].price, showOffer: true})
    }
  }

  makeOffer = pendingOffer => {
    this.setState({ pendingOffer });
  };

  submitOffer = async () => {
    this.textInput.clear()
    let buyerId = await AsyncStorage.getItem("userId");
    let id = this.props.post._id;
    let offer  = this.state.pendingOffer;

    axios
      .get("https://ardwtalabapp.herokuapp.com/posts/API/postOffers", {
        params: {
          id,
          [buyerId]: offer
        }
      })
      .then(res => {
        this.setState({offer, showOffer: true})
        this.props.getPosts()
      })
      .catch(err => console.log(err));
  };

  render() {
    let { width, offer, showOffer } = this.state;
    if (this.props.post === undefined) return null;
    let {
      name,
      postCategories,
      location,
      additionalInfo,
      imgUrl
    } = this.props.post;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flexDirection: "row-reverse" }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.isVisible(false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <Text style={{ fontSize: 27, marginBottom: 50 }}>{name}</Text>
            <Image
              source={{ uri: imgUrl }}
              style={{ width: width, height: width / 1.5 }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Post Category: </Text>
                {postCategories}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Additional Info: </Text>
                {additionalInfo}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Location: </Text>
                {location}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {showOffer === false ? null : (
                <Text style={styles.textWrapper}>
                  <Text style={styles.text}>You have made an offer for </Text>
                  {offer} JOD
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Make an Offer"
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                onChangeText={offer => this.makeOffer(offer)}
                ref={input => (this.textInput = input)}
              ></TextInput>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={this.submitOffer}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Make Offer!
                </Text>
              </TouchableOpacity>
            </View>
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
  },

  text: {
    fontSize: 18,
    fontWeight: "bold"
  },

  textWrapper: {
    marginBottom: 15
  },

  textContainer: {
    flex: 1,
    fontSize: 15,
    marginTop: 50
  }
});
