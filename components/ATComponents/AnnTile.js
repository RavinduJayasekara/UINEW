import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../constants/Colors";

const AnnTile = (props) => {
  return (
    <View>
      <View>
        <Text style={styles.titleCol}>{props.title}</Text>
        <Text style={styles.text}>{props.securityId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    color: Colors.primary,
  },
  titleCol: {
    fontWeight: "bold",
  },
});

export default AnnTile;
