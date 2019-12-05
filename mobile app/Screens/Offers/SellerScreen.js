import React, { Component } from 'react'
import { View, Text, Image , ScrollView , TouchableOpacity , AsyncStorage} from 'react-native'
import axios from 'axios'
import { vw, vh} from 'react-native-expo-viewport-units';

export default class SellerScreen extends Component {
  state = {
    offers: []
  }
  componentDidMount = async()=> {
    axios.get('https://ardwtalabapp.herokuapp.com/posts/API/getOffers', {
      params: {
        sellerID: await AsyncStorage.getItem('userId')
        // sellerID: '5dd03149694cc74c0fbe210c' // ahmad@gmail.com
      }
    })
      .then(res => {
        
          this.setState({offers : res.data})
        })
      .catch(err=>console.log(err))
  }
  render() {
    return (
      <>
      <ScrollView>
        <View style={{ margin: 10 }}>
        <View style={{flexDirection: 'row', flexWrap:'wrap' ,alignItems: 'flex-start'}}>
            {this.state.offers.map(item => {
              // return JSON.stringify(item.price)
              if(typeof item != 'object'){
               return <Image
                  source={{ uri: item}}
                  style={{width:vw(20),height:vh(9), borderRadius:40 , margin:vh(.2)}}
                />
              }
              else{
                return (
                  <View style={{flexDirection: 'row', flexWrap:'wrap' ,alignItems: 'flex-start'}}>
                <View style={{ margin:vw(1), width:vw(45) ,borderRadius:10,  backgroundColor: '#4280c8', fontWeight: '400', padding:10, marginTop:vh(2)}}>
                  <Text style={{fontSize:20 ,color:'white' }}>{item[Object.keys(item)[1]]}</Text>
                </View>
                <TouchableOpacity><Text style={{ height:vh(4),backgroundColor: '#4280c8', fontWeight: '400', color:'white',marginTop:vh(2) }}>Accept</Text></TouchableOpacity>
                <TouchableOpacity><Text style={{ height:vh(4) , backgroundColor: '#4280c8', fontWeight: '400',color:'white',marginLeft:vw(1),marginTop:vh(2) }}>Decline</Text></TouchableOpacity>
                </View>
                )}
            })}
            </View>
        </View>
        </ScrollView>
      </>
    )
  }
}
