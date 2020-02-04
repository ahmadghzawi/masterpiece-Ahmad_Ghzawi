import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

export default class BuyerModal extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5, maxWidth: '75%'}}>
              {this.props.post.title}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.isVisible(false)}
            >
              <Text style={{ color: "#4280c8", fontWeight: "400" }}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            {Array.isArray(this.props.post.status) ? (
              <View>
                <Text
                  style={{ fontSize: vw(5), margin: vh(3), color: "green",textAlign: 'center' }}
                >
                  {"Congrats! your offer has been " +
                    this.props.post.status[0] +
                    "!"}
                </Text>
                <Text style={{ fontSize: vw(5), textAlign: 'center', marginBottom: vh(3) }}>
                  {"Please Contact me on this number " +
                    this.props.post.status[1]}
                </Text>
              </View>
            ) : this.props.post.status === "Rejected" ? (
              <Text style={{ fontSize: vw(5), margin: vh(3), color: "red", textAlign: 'center' }}>
                {"Unfortunately your offer has been " +
                  this.props.post.status +
                  "!"}
              </Text>
            ) : (
              <Text style={{ fontSize: vw(5), margin: vh(3) }}>
                Status: Pending... 
              </Text>
            )}
            <Image
              source={{
                uri: this.props.post.image_path
              }}
              style={{ width: vw(100), height: vh(40) / 1.5 }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Location: </Text>
                {this.props.post.location}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Category: </Text>
                {this.props.post.product_category}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Info: </Text>
                {this.props.post.info}
              </Text>
              <View
                style={{
                  width: vw(80),
                  borderTopColor: "black",
                  borderTopWidth: 1,
                  paddingTop: 10
                }}
              />
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Sent Offer: </Text>
                {this.props.post.price}JOD
              </Text>
            </View>
            {/* <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => this.props.deleteOfferHandler(this.props.post)}
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  Delete this Offer!
                </Text>
              </TouchableOpacity>
            </View> */}
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
    padding: 1
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

  buttonContainer: {
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
    marginTop: 10
  }
});
