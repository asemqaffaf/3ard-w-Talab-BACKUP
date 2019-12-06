import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native'
import axios from 'axios'
import { vw, vh } from 'react-native-expo-viewport-units';
import Modal from 'react-native-modal'
import SellerModal from './SellerModal'


export default class SellerScreen extends Component {
  state = {
    offers: [],
    counter: 0,
    post : null,
    isVisible : false

  }
  componentDidMount = () => {
    this.fetchSellerOffers()
  }
  fetchSellerOffers = async () => {
    axios.get('https://ardwtalabapp.herokuapp.com/posts/API/getOffers', {
      params: {
        sellerID: await AsyncStorage.getItem('userId')
        // sellerID: '5dd03149694cc74c0fbe210c' // ahmad@gmail.com
      }
    })
      .then(res => {
        this.setState({
          offers: res.data
        })
      })
      .catch(err => console.log(err))
  }
  
  detailsHandler = (post , isVisible) => {
    this.setState({post, isVisible})
  }
  acceptOfferHandler=(post)=>{
    let {offerMaker , postId} = post
    axios.delete(`https://ardwtalabapp.herokuapp.com/posts/API/deleteAtSpecificTime/${postId}`)
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err.message))
    .then( axios.put('https://ardwtalabapp.herokuapp.com/posts/API/acceptOffer',{
        postId ,
        offerMaker
    })
    .then(res=>{
      this.fetchSellerOffers()
    })
    .catch(err => console.log(err))
    )
  }
  deniedOfferHandler=(post)=>{
    let {offerMaker , postId} = post
    axios.put('https://ardwtalabapp.herokuapp.com/posts/API/deleteOffer/',{
      postId ,
      offerMaker
    })
    .then(res=>{
      this.fetchSellerOffers()
    })
    .catch(err=>console.log(err))
  }
  isVisible = (isVisible) => this.setState({isVisible })
  render() {
    // this.fetchSellerOffers()
    return (
      <>
        <ScrollView>
          <View style={{ margin: 10 }}>
          <Modal isVisible={this.state.isVisible}>
                      <SellerModal 
                      post={this.state.post} 
                      acceptOfferHandler= {this.acceptOfferHandler}
                      deniedOfferHandler = {this.deniedOfferHandler}
                      isVisible= {this.isVisible}
                      />
                    </Modal>
                 
              {this.state.offers.map(item => {
                return (
                  <TouchableOpacity key={this.state.counter++} onPress={() => { this.detailsHandler(item, true) }}>
                  <View  >
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      <View>
                     <Image
                      source={{ uri: 'http://gregfranko.com/images/JavaScript-logo-small.png' }}
                      style={{ width: vw(20), height: vh(9), borderRadius: 40, margin: vh(.2) }} />
                      </View> 
                        <View style={{ margin: vw(1), width: vw(60), borderRadius: 10, backgroundColor: '#4280c8', fontWeight: '400', padding: 10, marginTop: vh(2) }}>
                          <Text style={{ fontSize: 20, color: 'white' }}>{item.price}</Text>
                          </View> 

                        </View>
                  </View>
                  </TouchableOpacity>
                )
              })}

          </View>
        </ScrollView>
      </>
    )
  }
}

// <TouchableOpacity><Text style={{ height: vh(4), backgroundColor: '#4280c8', fontWeight: '400', color: 'white', marginTop: vh(2) }}>Accept</Text></TouchableOpacity>
// <TouchableOpacity><Text style={{ height: vh(4), backgroundColor: '#4280c8', fontWeight: '400', color: 'white', marginLeft: vw(1), marginTop: vh(2) }}>Decline</Text></TouchableOpacity>