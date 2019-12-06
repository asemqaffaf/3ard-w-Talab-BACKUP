import React, { Component } from 'react'
import { View, Text, Image, AsyncStorage, ScrollView, TouchableOpacity,Button } from 'react-native'
import axios from 'axios'
import { vw, vh } from 'react-native-expo-viewport-units';
import Modal from 'react-native-modal'
import BuyerModal from './BuyerModal'

export default class BuyerScreen extends Component {
  state = {
    offers: null,
    post: null,
    isVisible: false
  }
  componentDidMount = async () => {
    this.fetchBuyerSellerOffers()
  }
  fetchBuyerSellerOffers = async () => {
    axios.get("https://ardwtalabapp.herokuapp.com/posts/API/getOffers", {
      params: {
        buyerOffers: await AsyncStorage.getItem('userId')
      }
    })
      .then(res => {
        this.setState({ offers: res.data })
      })
      .catch(err => console.log(err))
      // .then(() => {
      //   console.log(this.state.offers[1])
      // })
  }
  postHandler=(post, isVisible)=>{
    this.setState({post,isVisible})
  }
  deleteOfferHandler = async (post) => {
    let offerMaker = await AsyncStorage.getItem('userId')
    let postId = post.id
    axios.put('https://ardwtalabapp.herokuapp.com/posts/API/deleteOffer/',{
      postId ,
      offerMaker
    })
    .then(res=>{
      console.log(res.data)
      this.fetchBuyerSellerOffers()
    })
    .catch(err=>console.log(err))
    .then(()=>{
      this.isVisible(false)
    })
  }

  isVisible = (isVisible) => this.setState({ isVisible })
   

  render() {
    this.fetchBuyerSellerOffers()
    return (
      <>
        <ScrollView>
          <View style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {this.state.offers !== null ? this.state.offers.map(item => {
                if (typeof item != 'object') {
                  return <Image
                    key={item}
                    source={{ uri: item }}
                    style={{ width: vw(20), height: vh(9), borderRadius: 40 }}
                  />
                }
                else {
                  let formatDate = item.date
                  formatDate = formatDate.split(" ")
                  return (
                  <TouchableOpacity key={item.date}  onPress={()=>{this.postHandler(item,true)}}>
                  <View style={{ margin: vw(.5), width: vw(70), borderRadius: 10, backgroundColor: '#4280c8', fontWeight: '400', padding: 10 }}>
                    <Text>{formatDate[1] + " " + formatDate[2] + " " + formatDate[3]}</Text>
                    <Text style={{ fontSize: 20, color: 'white' }}>{"Price " + item.price} </Text>
                    <Text style={{ color: 'lightgray' }}>{formatDate[4] + " " + item.status + '...'}</Text>
                  </View>
                  </TouchableOpacity>
                  )
                }
              }) : null}
            </View>
          </View>
    
          <Modal isVisible={this.state.isVisible}>
          <BuyerModal 
          post={this.state.post} 
          deleteOfferHandler = {this.deleteOfferHandler}
          isVisible= {this.isVisible}
          />
        </Modal>
        </ScrollView>
      </>
    )
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
