import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import axios from "axios";
import { vw, vh } from "react-native-expo-viewport-units";
import Modal from "react-native-modal";
import SellerModal from "./SellerModal";

export default class SellerScreen extends Component {
  state = {
    offers: [],
    post: null,
    isVisible: false
  };
  componentDidMount = () => {
    this.fetchSellerOffers();
  };
  fetchSellerOffers = async () => {
    axios
      .get("https://ardwtalabapp.herokuapp.com/posts/API/getOffers", {
        params: {
          sellerID: await AsyncStorage.getItem("userId")
          // sellerID: '5dd03149694cc74c0fbe210c' // ahmad@gmail.com
        }
      })
      .then(res => {
        this.setState({
          offers: res.data
        });
      })
      .catch(err => console.log(err));
  };

  detailsHandler = (post, isVisible) => {
    this.setState({ post, isVisible });
  };
  acceptOfferHandler = async post => {
    let { offerMaker, postId } = post;
    let contactNumber = await AsyncStorage.getItem("phoneNumber");
    axios
      .delete(
        `https://ardwtalabapp.herokuapp.com/posts/API/deleteAtSpecificTime/${postId}`
      )
      .then(res => console.log(res.data))
      .catch(err => console.log(err.message))
      .then(
        axios
          .put("https://ardwtalabapp.herokuapp.com/posts/API/acceptOffer", {
            postId,
            offerMaker,
            contactNumber
          })
          .then(res => {
            this.fetchSellerOffers();
          })
          .catch(err => console.log(err))
      )
      .then(() => this.setState({ isVisible: false }));
  };
  deniedOfferHandler = post => {
    let { offerMaker, postId } = post;
    axios
      .put("https://ardwtalabapp.herokuapp.com/posts/API/deniedOffer/", {
        postId,
        offerMaker
      })
      .then(res => {
        this.fetchSellerOffers();
      })
      .catch(err => console.log(err))
      .then(() => this.setState({ isVisible: false }));
  };
  isVisible = isVisible => this.setState({ isVisible });
  render() {
    return (
      <>
        <ScrollView>
          <View style={{ margin: 10 }}>
            <Modal isVisible={this.state.isVisible}>
              <SellerModal
                post={this.state.post}
                acceptOfferHandler={this.acceptOfferHandler}
                deniedOfferHandler={this.deniedOfferHandler}
                isVisible={this.isVisible}
              />
            </Modal>

            {this.state.offers.map((item, index) => {
              statusColor = "white";
              if (item.status == "Rejected") {
                statusColor = "tomato";
              }
              if (item.status[0] == "Accepted") {
                statusColor = "#90ee90";
              }
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.detailsHandler(item, true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      height: vh(10),
                      marginTop: vh(2)
                    }}
                  >
                    <Image
                      source={{ uri: item.imgUrl }}
                      // source={{
                      //   uri:
                      //     "http://www.websalution.com/wp-content/uploads/2019/08/icon.javascript.png"
                      // }}
                      style={{
                        width: vw(20),
                        height: vh(8),
                        borderRadius: 8,
                        margin: vw(1)
                      }}
                    />
                    <View
                      style={{
                        width: vw(70),
                        borderRadius: 10,
                        backgroundColor: "#2096F3",
                        fontWeight: "400",
                        padding: 10
                      }}
                    >
                      <Text
                        style={{ fontSize: 20, color: "white" }}
                      >{`You've got an offer: ${item.price} JOD`}</Text>
                      <Text style={{ fontSize: 15, color: "white" }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 15, color: `${statusColor}` }}>
                        {Array.isArray(item.status)
                          ? item.status[0]
                          : item.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  }
}

// <TouchableOpacity><Text style={{ height: vh(4), backgroundColor: '#4280c8', fontWeight: '400', color: 'white', marginTop: vh(2) }}>Accept</Text></TouchableOpacity>
// <TouchableOpacity><Text style={{ height: vh(4), backgroundColor: '#4280c8', fontWeight: '400', color: 'white', marginLeft: vw(1), marginTop: vh(2) }}>Decline</Text></TouchableOpacity>
