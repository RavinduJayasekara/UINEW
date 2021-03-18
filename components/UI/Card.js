import React from "react";
import { StyleSheet, View } from "react-native";

const Card = (props) => {
  return (
    <View {...props} style={{ ...styles.container, ...props.style }}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default Card;
