import { Divider, Layout, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const ISTile = (props) => {
  let tColor;

  if (parseFloat(props.perChange) > 0) {
    tColor = Colors.positive;
  } else if (parseFloat(props.perChange) === 0) {
    tColor = "#ccc";
  } else {
    tColor = Colors.negative;
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.titleContainer}>
        <Text style={styles.tText}>{props.sector}</Text>
        <Text numberOfLines={1} style={styles.sText}>
          {props.description}
        </Text>
      </Layout>
      <Layout style={styles.midContainer}>
        <Text style={styles.tText}>{props.lastTraded}</Text>
        <Text style={styles.sText}>{props.totVolume}</Text>
      </Layout>
      <Layout style={styles.groundContainer}>
        <Text style={{ ...styles.tText, ...{ color: tColor } }}>
          {props.perChange}%
        </Text>
        <Text style={{ ...styles.sText, ...{ color: tColor } }}>
          {props.change}
        </Text>
      </Layout>
      <Divider />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", width: "100%" },
  titleContainer: { width: "40%" },
  midContainer: { width: "30%", alignItems: "flex-end" },
  groundContainer: { width: "30%", alignItems: "flex-end" },
  sText: { color: "#ccc" },
  tText: { fontSize: 20, fontWeight: "bold" },
});

export default ISTile;
