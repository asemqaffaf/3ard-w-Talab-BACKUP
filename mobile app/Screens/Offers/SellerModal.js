import React, { Component } from 'react'
import {Text,View  , StyleSheet, ScrollView,TouchableOpacity,Image, TextInput} from 'react-native'
import { vw, vh } from 'react-native-expo-viewport-units';

export default class SellerModal extends Component {

  render() {
   
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
        <Text style={{ fontSize: 27, marginBottom: 50 }}>{this.props.post.name}</Text>
        <Image
          source={{ uri: 'http://gregfranko.com/images/JavaScript-logo-small.png' }}
          style={{ width: vw(80), height: vh(50) / 1.5 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textWrapper}>
            <Text style={styles.text}>Post Name: </Text>
            {this.props.post.name}
          </Text>
          <Text style={styles.textWrapper}>
            <Text style={styles.text}>Post Category: </Text>
            {this.props.post.postCategories}
          </Text>
          <Text style={styles.textWrapper}>
            <Text style={styles.text}>Location: </Text>
            {this.props.post.location}
          </Text>
        </View>
          <View
            style={{
              flexDirection:'column',
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
          <TouchableOpacity  style={styles.buttonContainerDenied} onPress={()=>this.props.deniedOfferHandler(this.props.post)}>
          <Text style={{ color:'white' , fontSize:20}}>Denied</Text></TouchableOpacity>
          <TouchableOpacity  style={styles.buttonContainerAccept} onPress={()=>this.props.acceptOfferHandler(this.props.post) }>
          <Text style={{ color:'white' , fontSize:20}}>Accept</Text></TouchableOpacity>
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

buttonContainerDenied: {
marginTop: 10,
height: 40,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
marginBottom: 20,
width: "90%",
borderRadius: 10,
backgroundColor: "red"
},
buttonContainerAccept: {
  marginTop: 10,
  height: 40,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
  width: "90%",
  borderRadius: 10,
  backgroundColor: "green"
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

// <TouchableOpacity style={{backgroundColor:'red', width: vw(20) , margin:vh(1)}} onPress={()=>this.props.operationHandler('denied', this.props.post)}>
// <TouchableOpacity style={{backgroundColor:'green', width: vw(20)}} onPress={()=>this.props.operationHandler('accept', this.props.post) }>
