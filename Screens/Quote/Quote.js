import { Divider, Layout, Text, Button, Icon } from "@ui-kitten/components";
import React, { useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";

const UpIcon = () => (
  <Icon style={styles.icon} fill={Colors.positive} name="arrow-up" />
);
const DownIcon = () => (
  <Icon style={styles.icon} fill={Colors.negative} name="arrow-down" />
);

const Quote = (props) => {
  let bPColor = "",
    tPColor = "",
    tCColor = "",
    tTColor = "";

  const sec = props.route.params.security;
  const cN = props.route.params.companyname;

  const buyHandler = (sec, cName) => {
    props.navigation.navigate("BuySell", {
      bOrS: "Buy",
      securityCode: sec,
      securityName: cName,
    });
  };

  if (parseFloat(props.route.params.perchange) > 0) {
    bPColor = Colors.positive;
    tPColor = Colors.white;
  } else if (parseFloat(props.route.params.perchange) === 0) {
    tPColor = Colors.white;
    bPColor = Colors.ashgray;
  } else {
    tPColor = Colors.white;
    bPColor = Colors.negative;
  }

  if (parseFloat(props.route.params.netchange) > 0) {
    tCColor = Colors.positive;
  } else if (parseFloat(props.route.params.netchange) === 0) {
    tCColor = Colors.ashgray;
  } else {
    tCColor = Colors.negative;
  }

  if (parseFloat(props.route.params.tradeprice) > 0) {
    tTColor = Colors.positive;
  } else if (parseFloat(props.route.params.tradeprice) === 0) {
    tTColor = Colors.ashgray;
  } else {
    tTColor = Colors.negative;
  }

  return (
    <Layout style={styles.container}>
      <Layout
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 5,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{sec}</Text>
        <Button
          size="small"
          status="success"
          onPress={buyHandler.bind(this, sec, cN)}
        >
          BUY
        </Button>
      </Layout>
      <Divider />
      <Layout style={{ marginVertical: 5 }}>
        <Layout
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {parseInt(props.route.params.tradeprice) > 0 ? (
            <UpIcon />
          ) : (
            <DownIcon />
          )}
          <Text style={{ color: tTColor, fontSize: 20, fontWeight: "bold" }}>
            {props.route.params.tradeprice === ""
              ? "0.00"
              : props.route.params.tradeprice}
          </Text>
        </Layout>
        <Layout style={styles.mainInfoContainer}>
          <Layout
            style={{
              backgroundColor: bPColor,
              paddingHorizontal: 5,
              borderRadius: 2,
            }}
          >
            <Text style={{ color: tPColor, fontWeight: "bold" }}>
              {props.route.params.perchange}%
            </Text>
          </Layout>
          <Layout style={{ marginHorizontal: 5 }}>
            <Text style={{ color: tCColor, fontWeight: "bold" }}>
              {props.route.params.netchange}
            </Text>
          </Layout>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Best Bid</Text>
          <Text style={{ ...styles.vText, ...{ color: Colors.positive } }}>
            {props.route.params.bidprice}
          </Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Best Offer</Text>
          <Text style={{ ...styles.vText, ...{ color: Colors.negative } }}>
            {props.route.params.askprice}
          </Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Bid Qty</Text>
          <Text style={{ ...styles.vText, ...{ color: Colors.positive } }}>
            {props.route.params.bidqty}
          </Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Offer Qty</Text>
          <Text style={{ ...styles.vText, ...{ color: Colors.negative } }}>
            {props.route.params.askqty}
          </Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Prev. Closed</Text>
          <Text style={styles.vText}>{props.route.params.vwap}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Open</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Low</Text>
          <Text style={styles.vText}>{props.route.params.lowpx}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>High</Text>
          <Text style={styles.vText}>{props.route.params.highpx}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Volume</Text>
          <Text style={styles.vText}>{props.route.params.totvolume}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Trades</Text>
          <Text style={styles.vText}>{props.route.params.tottrades}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Turnover</Text>
          <Text style={styles.vText}>{props.route.params.totturnover}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Net Cash</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>52wk Low</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>52wk High</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Min</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Max</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>TOP</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>TOV</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>Market Cap</Text>
          <Text style={styles.vText}>{null}</Text>
        </Layout>
        <Layout style={styles.mainValueContainerS}>
          <Text style={{ fontSize: 12 }}>L.T. Time</Text>
          <Text style={styles.vText}>{props.route.params.lasttradedtime}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={styles.mainValueContainer}>
        <Text style={{ fontSize: 12 }}>Market</Text>
        <Text style={styles.vText}>{}</Text>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 5 },
  vText: { fontWeight: "bold" },
  mainValueContainerS: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginVertical: 2,
  },
  mainValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  mainInfoContainer: { flexDirection: "row", marginVertical: 2 },
  icon: { width: 20, height: 20 },
});

export default Quote;
