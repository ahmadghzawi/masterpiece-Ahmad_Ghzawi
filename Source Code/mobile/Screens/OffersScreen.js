import BuyerScreen from "./Offers/BuyerScreen";
import SellerScreen from "./Offers/SellerScreen";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";

const topNav = createMaterialTopTabNavigator({
  Selling: SellerScreen,
  Buying: BuyerScreen
});

const container = createAppContainer(topNav);

container.navigationOptions = {
  title: "Offers"
};

export default container;
