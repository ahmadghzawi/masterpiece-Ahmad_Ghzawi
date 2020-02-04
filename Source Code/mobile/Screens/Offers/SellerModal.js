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

export default class SellerModal extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5, maxWidth: '75%' }}>
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
            <Image
              source={{ uri: this.props.post.image_path }}
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
                <Text style={styles.text}>Received Offer: </Text>
                {this.props.post.price}JOD
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Status: </Text>
                {Array.isArray(this.props.post.status)
                  ? this.props.post.status[0]
                  : this.props.post.status}
              </Text>
            </View>
            {this.props.post.status === "pending" ? (
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: vw(80),
                    borderTopColor: "black",
                    borderTopWidth: 1,
                    paddingTop: 10
                  }}
                />
                <TouchableOpacity
                  style={styles.buttonContainerDenied}
                  onPress={() => this.props.deniedOfferHandler(this.props.post)}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonContainerAccept}
                  onPress={() => this.props.acceptOfferHandler(this.props.post)}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Accept</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: "red", marginVertical: 25 }}>
                You've already responded to this Offer!{" "}
              </Text>
            )}
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
    alignItems: "center"
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },

  textContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10
  }
});
