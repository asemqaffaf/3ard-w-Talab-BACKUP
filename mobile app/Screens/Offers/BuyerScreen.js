import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity,
  Button,
  FlatList
} from "react-native";
import axios from "axios";
import { vw, vh } from "react-native-expo-viewport-units";
import Modal from "react-native-modal";
import BuyerModal from "./BuyerModal";

export default class BuyerScreen extends Component {
  state = {
    offers: [],
    post: null,
    isVisible: false,
    refreshing: false
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
      <View style={{ margin: 10, flex: 1 }}>
        <Modal isVisible={this.state.isVisible}>
          <BuyerModal
            post={this.state.post}
            deleteOfferHandler={this.deleteOfferHandler}
            isVisible={this.isVisible}
          />
        </Modal>

        <FlatList
          keyExtractor={(offer, index) => index.toString()}
          data={this.state.offers}
          renderItem={offer => {
            let formatDate = offer.item.date;
            formatDate = formatDate.split(" ");
            return (
              <TouchableOpacity
                onPress={() => {
                  this.postHandler(offer.item, true);
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
                    source={{ uri: offer.item.imgUrl }}
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
                      {`You've sent an offer for ${offer.item.price} JOD`}
                    </Text>
                    {Array.isArray(offer.item.status) ? (
                      <Text style={{ fontSize: 15, color: "lightgray" }}>
                        {`${formatDate[4]}`}
                        <Text
                          style={{ color: "#90ee90" }}
                        >{`  ${offer.item.status[0]}`}</Text>
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 15, color: "lightgray" }}>
                        {`${formatDate[4]}`}{" "}
                        <Text
                          style={{
                            color:
                              offer.item.status === "Rejected"
                                ? "tomato"
                                : "lightgray"
                          }}
                        >{`  ${offer.item.status}...`}</Text>
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          refreshing={this.state.refreshing}
          onRefresh={this.fetchBuyerSellerOffers}
        />
      </View>
    );
  }
}
