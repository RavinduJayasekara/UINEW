import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DefaultText = (props) => {
  return (
    <View>
      <Text {...props} numberOfLines = {1} style={{ ...styles.title, ...props.style }}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
  },
});

export default DefaultText;
