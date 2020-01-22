import React, { Component } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Picker
} from "react-native";
import axios from "axios";
import Modal from "react-native-modal";
import PostScreen from "./PostScreen";

export default class Home extends Component {
  state = {
    posts: [],
    post: null,
    isVisible: false,
    width: Math.floor(Dimensions.get("window").width / 3) - 2,
    refreshing: false,
    user_id: null,
    selectedCategory: "All Categories",
    categories: []
  };

  componentDidMount() {
    this.getPostsAndCategories();
  }

  getProductsByCategory = category => {
    if (category === "All Categories") {
      this.setState({ selectedCategory: "All Categories" });
      this.getPostsAndCategories();
    } else {
      this.setState({ selectedCategory: category });
      axios
        .get(
          `https://ard-w-talab-version-2.herokuapp.com/posts/API/getProductsByCategory/${category}`
        )
        .then(res => {
          this.setState({
            posts: res.data,
            refreshing: false
          });
        })
        .catch(err => console.log(err));
    }
  };

  getPostsAndCategories = async () => {
    let user_id = await AsyncStorage.getItem("user_id");
    this.setState({ user_id });
    axios
      .get("https://ard-w-talab-version-2.herokuapp.com/posts/API/data")
      .then(res => {
        this.setState({
          posts: res.data.products,
          categories: res.data.categories,
          refreshing: false
        });
      })
      
      .catch(err => console.log({ message: err.message }));
  };

  isVisible = (isVisible, post) => {
    this.setState({ isVisible, post });
  };

  render() {
    let { width, posts, refreshing, selectedCategory, categories } = this.state;
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={selectedCategory}
          style={{ width: Math.floor(Dimensions.get("window").width) }}
          onValueChange={category => this.getProductsByCategory(category)}
        >
          <Picker.Item label="All Categories" value="All Categories" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
        <FlatList
          keyExtractor={post => post._id}
          data={posts}
          numColumns={3}
          renderItem={post => {
            return (
              <TouchableOpacity onPress={() => this.isVisible(true, post.item)}>
                <Image
                  source={{ uri: post.item.image_path }}
                  style={{ width, height: width, margin: 1 }}
                />
              </TouchableOpacity>
            );
          }}
          refreshing={refreshing}
          onRefresh={this.getPostsAndCategories}
        />
        <Modal isVisible={this.state.isVisible}>
          <PostScreen
            isVisible={this.isVisible}
            post={this.state.post}
            getPosts={this.getPostsAndCategories}
            user_id={this.state.user_id}
          />
        </Modal>
      </View>
    );
  }
}

Home.navigationOptions = {
  title: "3ard w Talab"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  }
});
