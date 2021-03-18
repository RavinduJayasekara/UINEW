// import React, { useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   View,
// } from "react-native";

// import { SwipeListView } from "react-native-swipe-list-view";

// const rowTranslateAnimatedValues = {};
// Array(20)
//   .fill("")
//   .forEach((_, i) => {
//     rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
//   });

// export default function SwipeToDelete() {
//   const [listData, setListData] = useState(
//     Array(20)
//       .fill("")
//       .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
//   );

//   const onSwipeValueChange = (swipeData) => {
//     const { key, value } = swipeData;
//     if (value < -Dimensions.get("window").width && !this.animationIsRunning) {
//       this.animationIsRunning = true;
//       Animated.timing(rowTranslateAnimatedValues[key], {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start(() => {
//         const newData = [...listData];
//         const prevIndex = listData.findIndex((item) => item.key === key);
//         newData.splice(prevIndex, 1);
//         setListData(newData);
//         this.animationIsRunning = false;
//       });
//     }
//   };

//   const renderItem = (data) => (
//     <Animated.View
//       style={[
//         styles.rowFrontContainer,
//         {
//           height: 50,
//           // height: rowTranslateAnimatedValues[
//           //     data.item.key
//           // ].interpolate({
//           //     inputRange: [0, 1],
//           //     outputRange: [0, 50],
//           // }),
//         },
//       ]}
//     >
//       <TouchableHighlight
//         onPress={() => console.log("You touched me")}
//         style={styles.rowFront}
//         underlayColor={"#AAA"}
//       >
//         <View>
//           <Text>I am {data.item.text} in a SwipeListView</Text>
//         </View>
//       </TouchableHighlight>
//     </Animated.View>
//   );

//   const renderHiddenItem = () => (
//     <View style={styles.rowBack}>
//       <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
//         <Text style={styles.backTextWhite}>Delete</Text>
//       </View>
//       <Text>Ravindu</Text>
//       <Text>Jayasekara</Text>
//       <Text>Test</Text>
//       <Text>Sri Lanka</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <SwipeListView
//         data={listData}
//         renderItem={renderItem}
//         renderHiddenItem={renderHiddenItem}
//         rightOpenValue={-Dimensions.get("window").width}
//         previewRowKey={"0"}
//         previewOpenValue={-40}
//         previewOpenDelay={3000}
//         onSwipeValueChange={onSwipeValueChange}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     flex: 1,
//   },
//   backTextWhite: {
//     color: "#FFF",
//   },
//   rowFront: {
//     alignItems: "center",
//     backgroundColor: "#CCC",
//     borderBottomColor: "black",
//     borderBottomWidth: 1,
//     justifyContent: "center",
//     height: 50,
//   },
//   rowBack: {
//     alignItems: "center",
//     backgroundColor: "red",
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingLeft: 15,
//   },
//   backRightBtn: {
//     alignItems: "center",
//     bottom: 0,
//     justifyContent: "center",
//     position: "absolute",
//     top: 0,
//     width: 75,
//   },
//   backRightBtnRight: {
//     backgroundColor: "red",
//     right: 0,
//   },
// });

// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableHighlight,
//   View,
// } from "react-native";

// import { SwipeListView } from "react-native-swipe-list-view";

// export default function Basic() {
//   const [listData, setListData] = useState(
//     Array(20)
//       .fill("")
//       .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
//   );

//   const closeRow = (rowMap, rowKey) => {
//     if (rowMap[rowKey]) {
//       rowMap[rowKey].closeRow();
//     }
//   };

//   const deleteRow = (rowMap, rowKey) => {
//     closeRow(rowMap, rowKey);
//     const newData = [...listData];
//     const prevIndex = listData.findIndex((item) => item.key === rowKey);
//     newData.splice(prevIndex, 1);
//     setListData(newData);
//   };

//   const onRowDidOpen = (rowKey) => {
//     console.log("This row opened", rowKey);
//   };

//   const renderItem = (data) => (
//     <TouchableHighlight
//       onPress={() => console.log("You touched me")}
//       style={styles.rowFront}
//       underlayColor={"#AAA"}
//     >
//       <View>
//         <Text>I am {data.item.text} in a SwipeListView</Text>
//       </View>
//     </TouchableHighlight>
//   );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <Text>Right</Text>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
      {/* <Text>Ravindu</Text>
      <Text>Theekshana</Text>
      <Text>Jayasekara</Text> */}
    </View>
  );

//   return (
//     <View style={styles.container}>
//       <SwipeListView
//         data={listData}
//         renderItem={renderItem}
//         renderHiddenItem={renderHiddenItem}
//         leftOpenValue={75}
//         rightOpenValue={-150}
//         previewRowKey={"0"}
//         previewOpenValue={-40}
//         previewOpenDelay={3000}
//         onRowDidOpen={onRowDidOpen}
//         stopLeftSwipe={50}
//         stopRightSwipe={-200}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     flex: 1,
//   },
//   backTextWhite: {
//     color: "#FFF",
//   },
//   rowFront: {
//     alignItems: "center",
//     backgroundColor: "#CCC",
//     borderBottomColor: "black",
//     borderBottomWidth: 1,
//     justifyContent: "center",
//     height: 50,
//   },
//   rowBack: {
//     alignItems: "center",
//     backgroundColor: "#DDD",
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingLeft: 15,
//   },
//   backRightBtn: {
//     alignItems: "center",
//     bottom: 0,
//     justifyContent: "center",
//     position: "absolute",
//     top: 0,
//     width: 75,
//   },
//   backRightBtnLeft: {
//     backgroundColor: "blue",
//     right: 75,
//   },
//   backRightBtnRight: {
//     backgroundColor: "red",
//     right: 0,
//   },
// });