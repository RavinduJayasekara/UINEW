import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";

const CustomButton = (props) => {
  return (
    <View
      style={{
        ...styles.button,
        ...props.style,
        ...{
          backgroundColor: Platform.OS === "android" ? props.buttonColor : "",
          borderWidth: 1,
          borderColor: props.buttonColor,
        },
      }}
    >
      <TouchableOpacity style={styles.touchable} onPress={props.onPress}>
        <Text
          numberOfLines={1}
          style={{
            ...styles.title,
            ...{
              color:
                Platform.OS === "android" ? props.textColor : props.buttonColor,
            },
          }}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "100%",
    borderRadius: 5,
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  title: {
    fontSize: 18,
  },
});

export default CustomButton;
