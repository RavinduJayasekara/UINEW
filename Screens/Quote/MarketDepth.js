import { Layout, List, Divider, Button } from "@ui-kitten/components";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Colors from "../../constants/Colors";
import Links from "../../Links/Links";

const generateLinkOrderBook = (sCode) => {
  return (
    Links.mLink +
    "marketdetails?action=getOrderBook&format=json&security=" +
    sCode +
    "&board=1"
  );
};

const MarketDepth = (props) => {
  const [orderBookArrayBid, setOrderBookArrayBid] = useState([]);
  const [orderBookArrayAsk, setOrderBookArrayAsk] = useState([]);
  const [orderBooktotalAsk, setOrderBookTotalAsk] = useState(0);
  const [orderBooktotalBids, setOrderBookTotalBids] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const security = props.route.params.props.security;
  const cN = props.route.params.props.companyname;
  const tP = props.route.params.props.tradeprice;
  const nC = props.route.params.props.netchange;
  const pC = props.route.params.props.perchange;

  const buyHandler = (sec, cName, tRp, nCh, pCh) => {
    props.navigation.navigate("BuySell", {
      bOrS: "Buy",
      securityCode: sec,
      securityName: cName,
      tradeP: tRp,
      netC: nCh,
      perC: pCh,
    });
  };

  const getOrderBook = useCallback(async (link) => {
    try {
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      if (object.data.size[0].size === "0") {
        return;
      } else {
        setOrderBookArrayBid(object.data.orderbook[0].bid);
        setOrderBookArrayAsk(object.data.orderbook[0].ask);
        setOrderBookTotalBids(object.data.orderbook[0].totalbids);
        setOrderBookTotalAsk(object.data.orderbook[0].totalask);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    const linkUrlOrderBook = generateLinkOrderBook(security);
    const initialOrderBook = async () => {
      setLoadingDetails(true);
      await getOrderBook(linkUrlOrderBook);
      setLoadingDetails(false);
    };
    initialOrderBook();
  }, [getOrderBook]);

  if (loadingDetails) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  const renderItem = (itemData, lC, dC, t) => {
    return (
      <Layout style={styles.listTile}>
        <Layout style={styles.value}>
          <Text style={styles.vText}>{itemData.item.splits}</Text>
        </Layout>

        <Layout
          style={{
            ...styles.value,
            ...{ alignItems: "flex-end", paddingHorizontal: 5 },
          }}
        >
          <Text style={{ ...styles.vText, ...{ color: t } }}>
            {parseInt(itemData.item.qty)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </Layout>

        <Layout
          style={{
            ...styles.value,

            ...{ backgroundColor: itemData.index % 2 === 0 ? lC : dC },
          }}
        >
          <Text
            style={{
              ...styles.vText,
              color: t,
            }}
          >
            {parseFloat(itemData.item.price).toFixed(2)}
          </Text>
        </Layout>
      </Layout>
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={styles.secContainer}>
        <Text style={styles.secText}>{props.route.params.props.security}</Text>
        <Button
          status="success"
          size="small"
          onPress={buyHandler.bind(this, security, cN, tP, nC, pC)}
        >
          Buy
        </Button>
      </Layout>
      <Divider />
      <Layout
        style={{
          width: "100%",
          backgroundColor: Colors.lGray,
          paddingVertical: 5,
          paddingHorizontal: 5,
        }}
      >
        <Text style={{ color: Colors.ashgray }}>Depth By Price</Text>
      </Layout>
      <Divider />
      <Layout
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          height: 40,
          alignItems: "center",
        }}
      >
        <Layout style={{ flexDirection: "row" }}>
          <Text>Total Qty:</Text>
          <Layout style={{ marginHorizontal: 2 }} />
          <Text style={{ color: Colors.positive, fontWeight: "bold" }}>
            {orderBooktotalBids
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </Layout>
        <Layout style={{ flexDirection: "row" }}>
          <Text>Total Qty:</Text>
          <Layout style={{ marginHorizontal: 2 }} />
          <Text style={{ color: Colors.negative, fontWeight: "bold" }}>
            {orderBooktotalAsk.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </Layout>
      </Layout>
      <Divider />
      <List
        ListEmptyComponent={() => (
          <Layout
            style={{ flex: 1, backgroundColor: "aqua", flexDirection: "row" }}
          >
            <Layout style={styles.listContainer}>
              <List
                ListHeaderComponent={() => (
                  <Layout style={{ width: "100%", flexDirection: "row" }}>
                    <Layout style={styles.value}>
                      <Text style={styles.tText}>Splits</Text>
                    </Layout>
                    <Layout style={styles.value}>
                      <Text style={styles.tText}>Quantity</Text>
                    </Layout>
                    <Layout style={styles.value}>
                      <Text style={styles.tText}>Bid</Text>
                    </Layout>
                  </Layout>
                )}
                data={orderBookArrayBid}
                renderItem={(item) =>
                  renderItem(
                    item,
                    Colors.lPositive,
                    Colors.dPositive,
                    Colors.positive
                  )
                }
                keyExtractor={(it, ind) => ind.toString()}
                listKey="1"
              />
            </Layout>
            <Layout style={styles.listContainer}>
              <List
                ListHeaderComponent={() => (
                  <Layout style={{ width: "100%", flexDirection: "row" }}>
                    <Layout style={styles.value}>
                      <Text style={styles.tText}>Splits</Text>
                    </Layout>
                    <Layout style={styles.value}>
                      <Text style={styles.tText}>Quantity</Text>
                    </Layout>
                    <Layout style={styles.value}>
                      <Text style={styles.tText}>Ask</Text>
                    </Layout>
                  </Layout>
                )}
                data={orderBookArrayAsk}
                renderItem={(item) =>
                  renderItem(
                    item,
                    Colors.lnegative,
                    Colors.dnegative,
                    Colors.negative
                  )
                }
                keyExtractor={(it, ind) => ind.toString()}
                listKey={"2"}
              />
            </Layout>
          </Layout>
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  secContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  listContainer: {
    width: "50%",
  },
  text: {
    color: Colors.primary,
  },
  titleCol: {
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listTile: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tText: { fontSize: 15, color: Colors.primary, fontWeight: "bold" },
  vText: { fontSize: 12 },
  value: { width: "33%", alignItems: "center", justifyContent: "center" },
  secText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MarketDepth;
