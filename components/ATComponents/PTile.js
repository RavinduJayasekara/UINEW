import { Divider, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";

const PTile = (props) => {
  let tColor = "";
  const nG = parseFloat(props.netGaLo);
  if (nG > 0) {
    tColor = Colors.positive;
  } else if (nG < 0) {
    tColor = Colors.negative;
  } else {
    tColor = Colors.white;
  }

  return (
    <View style={styles.portListBlockContainer}>
      <View style={styles.portListBlockT}>
        <Text style={{ ...styles.tRText, ...{ color: Colors.primary } }}>
          {props.security}
        </Text>
        <Text>{props.lastTraded}</Text>
      </View>
      <View style={styles.portListBlockS}>
        <Text style={{ ...styles.tRText, ...{ color: tColor } }}>{nG}</Text>
        <Text>{props.mVa}</Text>
      </View>
      <View style={styles.portListBlockS}>
        <Text style={styles.tRText}>{props.quantity}</Text>
        <Text>{props.avgPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  portListBlockContainer: {
    flexDirection: "row",
  },
  portListBlockS: {
    width: "30%",
    alignItems: "flex-end",
  },
  portListBlockT: {
    width: "40%",
  },
  tRText: { fontSize: 18, fontWeight: "bold" },
});

export default PTile;

/* <Text>{props.}</Text> */
/* <Text>{props.}</Text> */
/* <Text>{props.}</Text> */
