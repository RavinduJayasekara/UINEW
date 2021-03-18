// // import { StatusBar } from "expo-status-bar";
// // import React from "react";
// // import { StyleSheet, View } from "react-native";
// // import * as eva from "@eva-design/eva";
// // import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";

// // export default function App() {
// //   return (
// //     <ApplicationProvider {...eva} theme={eva.light}>
// //       <Layout style={styles.container}>
// //         <Text>Open up App.js to start working on your app!</Text>
// //         <StatusBar style="auto" />
// //       </Layout>
// //     </ApplicationProvider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#fff",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// // });

// // import React, { useState } from "react";
// // import {
// //   Dimensions,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // import Basic from "./components/ATComponents";

// // const componentMap = {
// //   Basic,
// // };

// // export default function App() {
// //   const [mode, setMode] = useState("Basic");

// //   const renderExample = () => {
// //     return <Basic />;
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.switchContainer}></View>
// //       <Basic />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     backgroundColor: "white",
// //     flex: 1,
// //   },
// //   switchContainer: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     marginVertical: 50,
// //     flexWrap: "wrap",
// //   },
// // });

import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import AtradNavigator from "./navigation/AtradNavigator";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { applyMiddleware, createStore, combineReducers } from "redux";
import allSecReducer from "./store/reducer/dropdownsecurities";
import authReducer from "./store/reducer/auth";
import loadingClientsReducer from "./store/reducer/loadingclients";
import topStocksReducer from "./store/reducer/topStocks";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function App() {
  const rootReducer = combineReducers({
    auth: authReducer,
    allSecurities: allSecReducer,
    topStocks: topStocksReducer,
    loadingclients: loadingClientsReducer,
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Provider store={store}>
          <StatusBar hidden={true} />
          <AtradNavigator />
        </Provider>
      </ApplicationProvider>
    </>
  );
}

// import React from "react";
// import { Button, Text, View } from "react-native";
// // import ReactDOM from "react-dom";

// const simulateSlowNetworkRequest = () =>
//   new Promise((resolve) => setTimeout(resolve, 2500));

// function Example() {
//   const [text, setText] = React.useState("waiting...");

//   React.useEffect(() => {
//     let isCancelled = false;

//     simulateSlowNetworkRequest().then(() => {
//       if (!isCancelled) {
//         setText("done!");
//         console.log(isCancelled);
//       }
//     });

//     return () => {
//       isCancelled = true;
//     };
//   }, []);

//   return <Text>{text}</Text>;
// }

// function App() {
//   const [mouted, setMounted] = React.useState(true);

//   const unmount = () => {
//     setMounted(false);
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button onPress={unmount} title="Unmount the component" />
//       {mouted && <Example />}
//     </View>
//   );
// }

// export default App;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
