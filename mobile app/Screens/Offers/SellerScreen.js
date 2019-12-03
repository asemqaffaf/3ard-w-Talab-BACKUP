import React, { Component } from 'react'
import { View, Text, Image , ScrollView } from 'react-native'
import axios from 'axios'
export default class SellerScreen extends Component {
  state = {
    img: [],
    brand: null,
    offers: []
  }
  componentDidMount() {
    axios.get('http://192.168.86.33:9002/', {
      params: {
        sellerID: 'Asem'
      }
    })
      .then(res => {

        res.data.map(item => {
          if (typeof item == "string") {
            this.state.img.push(item)
            this.setState({
              img: this.state.img
            })
          }
          if(typeof item == "object"){
            this.state.offers.push(item)
            this.setState({
              offers: this.state.offers
            })
          }
        })
        console.log(this.state.offers)
      })
  }
  render() {
    return (
      <>
      <ScrollView>
        <View style={{ marginTop: 5 }}>
          <Text>SellerScreen</Text>
          {this.state.img.map((pic, i) => {
            console.log(pic)
           return(
              <Image
          style={{width: 50, height: 50 , margin : 0}}
          source={{uri: pic}}/> 
           )
          })}
          
        </View>
        </ScrollView>
      </>
    )
  }
}
