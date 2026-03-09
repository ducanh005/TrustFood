import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function FoodReviewScreen() {
  const route = useRoute();
  const { imageUri } = route.params;

  const [rating, setRating] = useState(4);

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
        </View>

        {/* STARS */}
        <View style={styles.starRow}>
          {[1,2,3,4,5].map((i)=>(
            <TouchableOpacity key={i} onPress={()=>setRating(i)}>
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={32}
                color="#FFD400"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOCATION */}
        <Text style={styles.label}>Vị trí</Text>
        <View style={styles.input}>
          <Ionicons name="location" size={18} color="#FFD400"/>
          <TextInput
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#999"
            style={styles.textInput}
          />
          <Ionicons name="close" size={18} color="#999"/>
        </View>

        {/* RESTAURANT NAME */}
        <Text style={styles.label}>Tên nhà hàng</Text>
        <View style={styles.input}>
          <TextInput
            placeholder="Tên nhà hàng"
            placeholderTextColor="#999"
            style={styles.textInput}
          />
          <Ionicons name="close" size={18} color="#999"/>
        </View>

        {/* PRICE */}
        <Text style={styles.label}>Giá cả</Text>
        <View style={styles.input}>
          <TextInput
            placeholder="200.000"
            placeholderTextColor="#999"
            style={styles.priceInput}
          />

          <Text style={{color:"#fff"}}>-</Text>

          <TextInput
            placeholder="300.000"
            placeholderTextColor="#999"
            style={styles.priceInput}
          />

          <Text style={{color:"#aaa"}}>VND</Text>

          <Ionicons name="close" size={18} color="#999"/>
        </View>

        {/* TIME */}
        <Text style={styles.label}>Giờ mở cửa</Text>
        <View style={styles.input}>
          <TextInput
            placeholder="15:00"
            placeholderTextColor="#999"
            style={styles.priceInput}
          />

          <Text style={{color:"#fff"}}>-</Text>

          <TextInput
            placeholder="22:30"
            placeholderTextColor="#999"
            style={styles.priceInput}
          />

          <Ionicons name="close" size={18} color="#999"/>
        </View>

        {/* REVIEW TEXT */}
        <Text style={styles.label}>Đánh giá của bạn</Text>

        <View style={styles.textArea}>
          <TextInput
            placeholder="Viết đánh giá của bạn"
            placeholderTextColor="#888"
            multiline
            style={{color:"#fff"}}
          />
        </View>

      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View style={styles.bottomBar}>

        <TouchableOpacity>
          <Ionicons name="images" size={26} color="#fff"/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="paper-plane" size={28} color="#000"/>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="refresh" size={26} color="#fff"/>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#0c0500",
paddingHorizontal:20,
paddingTop:60
},

imageWrapper:{
alignItems:"center",
marginBottom:15
},

image:{
width:90,
height:90,
borderRadius:16
},

starRow:{
flexDirection:"row",
justifyContent:"center",
marginBottom:20
},

label:{
color:"#fff",
marginBottom:6
},

input:{
backgroundColor:"#2a2a2a",
borderRadius:12,
flexDirection:"row",
alignItems:"center",
paddingHorizontal:12,
marginBottom:16,
height:46,
gap:8
},

textInput:{
flex:1,
color:"#fff"
},

priceInput:{
width:70,
color:"#fff"
},

textArea:{
backgroundColor:"#2a2a2a",
borderRadius:12,
padding:12,
height:120,
marginBottom:100
},

bottomBar:{
position:"absolute",
bottom:40,
width:"100%",
flexDirection:"row",
justifyContent:"space-around",
alignItems:"center"
},

sendBtn:{
width:70,
height:70,
borderRadius:35,
backgroundColor:"#FFD400",
alignItems:"center",
justifyContent:"center",
borderWidth:3,
borderColor:"#000"
}

});