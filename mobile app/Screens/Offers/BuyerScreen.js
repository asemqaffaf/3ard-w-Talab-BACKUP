import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  Button
} from "react-native";
import axios from "axios";
import { vw, vh } from "react-native-expo-viewport-units";
import Modal from "react-native-modal";
import BuyerModal from "./BuyerModal";

export default class BuyerScreen extends Component {
  state = {
    offers: null,
    post: null,
    isVisible: false
  };
  componentDidMount = async () => {
    this.fetchBuyerSellerOffers();
  };
  fetchBuyerSellerOffers = async () => {
    axios
      .get("https://ardwtalabapp.herokuapp.com/posts/API/getOffers", {
        params: {
          buyerOffers: await AsyncStorage.getItem("userId")
        }
      })
      .then(res => {
        this.setState({ offers: res.data });
      })
      .catch(err => console.log(err));
  };
  postHandler = (post, isVisible) => {
    this.setState({ post, isVisible });
  };
  deleteOfferHandler = async post => {
    let offerMaker = await AsyncStorage.getItem("userId");
    let postId = post.id;
    axios
      .put("https://ardwtalabapp.herokuapp.com/posts/API/deleteOffer/", {
        postId,
        offerMaker
      })
      .then(res => {
        console.log(res.data);
        this.fetchBuyerSellerOffers();
      })
      .catch(err => console.log(err))
      .then(() => {
        this.isVisible(false);
      });
  };

  isVisible = isVisible => this.setState({ isVisible });

  render() {
    return (
      <>
        <ScrollView>
          <View style={{ margin: 10 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start"
              }}
            >
              {this.state.offers != null
                ? this.state.offers.map((item, index) => {
                    let formatDate = item.date;
                    formatDate = formatDate.split(" ");
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          this.postHandler(item, true);
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
                            style={{
                              width: vw(20),
                              height: vh(9),
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
                            <Text>
                              {formatDate[1] +
                                " " +
                                formatDate[2] +
                                " " +
                                formatDate[3]}
                            </Text>
                            <Text style={{ fontSize: 20, color: "white" }}>
                              {`You've sent an offer for ${item.price} JOD`}
                            </Text>
                            {Array.isArray(item.status) ? (
                              <Text
                                style={{ fontSize: 15, color: "lightgray" }}
                              >
                                {`${formatDate[4]}`}
                                <Text
                                  style={{ color: "#90ee90" }}
                                >{`  ${item.status[0]}`}</Text>
                              </Text>
                            ) : (
                              <Text
                                style={{ fontSize: 15, color: "lightgray" }}
                              >
                                {`${formatDate[4]}`}{" "}
                                <Text
                                  style={{
                                    color:
                                      item.status === "Rejected"
                                        ? "tomato"
                                        : "lightgray"
                                  }}
                                >{`  ${item.status}...`}</Text>
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </View>
          </View>

          <Modal isVisible={this.state.isVisible}>
            <BuyerModal
              post={this.state.post}
              deleteOfferHandler={this.deleteOfferHandler}
              isVisible={this.isVisible}
            />
          </Modal>
        </ScrollView>
      </>
    );
  }
}
// <Modal isVisible={true}>
// <DetailsScreen
//           post={this.state.offers[1]}
//           acceptOfferHandler= {this.acceptOfferHandler}
//           deniedOfferHandler = {this.deniedOfferHandler}
//           isVisible= {this.isVisible}

// />
//  </Modal>
// <TouchableOpacity style={{ width: vw(10), height: vh(9), borderRadius: 10, backgroundColor: "red" }}><Text style={{ marginTop: '40%', marginLeft: '30%', color: 'white', fontWeight: 'bold', fontSize: 30 }}>X</Text></TouchableOpacity>
