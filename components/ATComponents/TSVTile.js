import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../constants/Colors";

const TSVTile = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.topic}>
        <Text style={styles.textS}>{props.sec}</Text>
      </View>
      <View style={styles.valuesB}>
        <Text style={styles.text}>{props.bidprice}</Text>
      </View>
      <View style={styles.valuesV}>
        <Text style={styles.text}>{props.totvolume}</Text>
      </View>
      <View style={styles.valuesT}>
        <Text style={styles.text}>{props.totturnover}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  topic: {
    width: "35%",
  },
  valuesB: {
    width: "14%",
    alignItems: "flex-end",
  },
  valuesV: {
    width: "25.5%",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  valuesT: {
    width: "25.5%",
    alignItems: "flex-end",
  },
  text: {
    color: Colors.primary,
  },
  textS: {
    fontWeight: "bold",
  },
});

export default TSVTile;
