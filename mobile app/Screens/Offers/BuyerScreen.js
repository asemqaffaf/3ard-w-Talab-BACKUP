import React, { Component } from 'react'
import { View, Text, Image,AsyncStorage,ScrollView } from 'react-native'
import axios from 'axios'
import { vw, vh } from 'react-native-expo-viewport-units';

export default class BuyerScreen extends Component {
  state = {
    offers: null
  }
  componentDidMount = async() => {
    axios.get("https://ardwtalabapp.herokuapp.com/posts/API/getOffers", {
      params: {
        buyerOffers:await AsyncStorage.getItem('userId')
      }
    })
      .then(res => this.setState({ offers: res.data }))
      .catch(err => console.log(err))
  }
  render() {
    return (
      <>
      <ScrollView>
        <View style={{ margin: 10 }}>
        <View style={{flexDirection: 'row', flexWrap:'wrap' ,alignItems: 'flex-start'}}>
            {this.state.offers !== null ? this.state.offers.map(item => {
              // return JSON.stringify(item.price)
              if(typeof item != 'object'){
               return <Image
                  source={{ uri: item}}
                  style={{width:vw(20),height:vh(9), borderRadius:40}}
                />
           
              }
              else{
                let formatDate = item.date
                formatDate= formatDate.split(" ")
                return <View style={{ margin:vw(1), width:vw(70) ,borderRadius:10,  backgroundColor: '#4280c8', fontWeight: '400', padding:10 }}>
                <Text>{formatDate[1]+" "+formatDate[2]+" "+formatDate[3] }</Text>
                <Text style={{fontSize:20 ,color:'white' }}>{"Price "+ item.price } </Text>
                <Text style={{color: 'lightgray'}}>{ formatDate[4]+" "+item.status+'...'}</Text>
                </View>
              }
            }) : null}
            </View>
        </View>
        </ScrollView>
      </>
    )
  }
}
