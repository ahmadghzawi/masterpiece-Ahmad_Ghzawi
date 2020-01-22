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
            <Text style={{ fontSize: 27, marginLeft: 20, marginTop: 5 }}>
              {this.props.selectedPost.title}
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
              source={{ uri: this.props.selectedPost.image_path }}
              style={{ width: vw(100), height: vh(40) / 1.5 }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Location: </Text>
                {this.props.selectedPost.location}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Category: </Text>
                {this.props.selectedPost.product_category}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Info: </Text>
                {this.props.selectedPost.info}
              </Text>
              <Text style={styles.textWrapper}>
                <Text style={styles.text}>Bid: </Text>
                {this.props.selectedPost.bid}
              </Text>
              <View
                style={{
                  width: vw(80),
                  borderTopColor: "black",
                  borderTopWidth: 1,
                  paddingTop: 10
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.deleteButtonContainer}
              onPress={() => {
                this.props.deletePost(this.props.selectedPost._id);
                this.props.isVisible(false);
              }}
            >
              <Text style={{ color: "white" }}>DELETE this Post!</Text>
            </TouchableOpacity>
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
  deleteButtonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
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
