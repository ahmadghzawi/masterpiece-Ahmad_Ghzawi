import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  FlatList
} from "react-native";
import axios from "axios";
import { vw, vh } from "react-native-expo-viewport-units";
import Modal from "react-native-modal";
import SellerModal from "./SellerModal";

export default class SellerScreen extends Component {
  state = {
    offers: [],
    post: null,
    isVisible: false,
    refreshing: false
  };

  componentDidMount = () => {
    this.fetchSellerOffers();
  };

  fetchSellerOffers = async () => {
    axios
      .get("https://ard-w-talab-version-2.herokuapp.com/posts/API/getOffers", {
        params: {
          seller_id: await AsyncStorage.getItem("user_id")
        }
      })
      .then(res => {
        this.setState({
          offers: res.data
        });
      })
      .catch(err => console.log(err));
  };

  detailsHandler = (post, isVisible) => {
    this.setState({ post, isVisible });
  };

  acceptOfferHandler = async post => {
    let { buyer, _id } = post;
    let contactNumber = await AsyncStorage.getItem("phone_number");
    axios
      .delete(
        `https://ard-w-talab-version-2.herokuapp.com/posts/API/deleteAtSpecificTime/${_id}`
      )
      .then()
      .catch(err => console.log(err.message))
      .then(
        axios
          .put("https://ard-w-talab-version-2.herokuapp.com/posts/API/acceptOffer", {
            _id,
            buyer,
            contactNumber
          })
          .then(res => {
            this.fetchSellerOffers();
          })
          .catch(err => console.log(err))
      )
      .then(() => this.setState({ isVisible: false }));
  };

  deniedOfferHandler = post => {
    let { buyer, _id } = post;
    axios
      .put("https://ard-w-talab-version-2.herokuapp.com/posts/API/deniedOffer/", {
        _id,
        buyer
      })
      .then(res => {
        this.fetchSellerOffers();
      })
      .catch(err => console.log(err))
      .then(() => this.setState({ isVisible: false }));
  };

  isVisible = isVisible => this.setState({ isVisible });

  render() {
    return (
      <View style={{ margin: 10, flex: 1 }}>
        <Modal isVisible={this.state.isVisible}>
          <SellerModal
            post={this.state.post}
            acceptOfferHandler={this.acceptOfferHandler}
            deniedOfferHandler={this.deniedOfferHandler}
            isVisible={this.isVisible}
          />
        </Modal>

        <FlatList
          keyExtractor={(offer, index) => index.toString()}
          data={this.state.offers}
          renderItem={offer => {
            statusColor = "white";
            if (offer.item.status == "Rejected") {
              statusColor = "tomato";
            }
            if (offer.item.status[0] == "Accepted") {
              statusColor = "#90ee90";
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  this.detailsHandler(offer.item, true);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    height: vh(10),
                    marginTop: vh(2)
                  }}
                >
                  <Image
                    source={{ uri: offer.item.image_path }}
                    style={{
                      width: vw(20),
                      height: vh(8),
                      borderRadius: 8,
                      margin: vw(1)
                    }}
                  />
                  <View
                    style={{
                      width: vw(70),
                      borderRadius: 10,
                      backgroundColor: "#2096F3",
                      fontWeight: "400",
                      padding: 10
                    }}
                  >
                    <Text
                      style={{ fontSize: 20, color: "white" }}
                    >{`You've got an offer: ${offer.item.price} JOD`}</Text>
                    <Text style={{ fontSize: 15, color: "white" }}>
                      {offer.item.title}
                    </Text>
                    <Text style={{ fontSize: 15, color: `${statusColor}` }}>
                      {Array.isArray(offer.item.status)
                        ? offer.item.status[0]
                        : offer.item.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          refreshing={this.state.refreshing}
          onRefresh={this.fetchSellerOffers}
        />
      </View>
    );
  }
}
