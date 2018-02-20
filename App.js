import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import configureStore from "./src/store/configureStore";

import MainClickScreen from "./src/screens/MainClickScreen/MainClickScreen";

const store = configureStore();

Navigation.registerComponent(
  "ucount.MainClickScreen",
  () => MainClickScreen,
  store,
  Provider
);

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "ucount.MainClickScreen",
    // title: "Login"
  }
});

// export default () =>
//   Navigation.startSingleScreenApp({
//     screen: {
//       screen: "ucount.MainClickScreen",
//       // title: "Login"
//     }
//   });
