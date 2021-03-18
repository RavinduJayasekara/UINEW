import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TitleText = (props) => {
  return (
    <View>
      <Text style={{ ...styles.text, ...props.style }}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default TitleText;
