import { ListItem } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../constants/Colors";

const TGLTile = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.topic}>
        <Text style={styles.textS}>{props.sec}</Text>
      </View>
      <View style={styles.values}>
        <Text style={styles.text}>{props.last}</Text>
      </View>
      <View style={styles.values}>
        <Text style={{ color: props.color }}>{props.chng}</Text>
      </View>
      <View style={styles.values}>
        <Text style={{ color: props.color }}>{props.chngP}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  topic: {
    width: "40%",
  },
  values: {
    width: "20%",
  },
  text: {
    color: Colors.primary,
  },
  textS: {
    fontWeight: "bold",
  },
});

export default TGLTile;
