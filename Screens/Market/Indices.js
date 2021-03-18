import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, FlatList } from "react-native";
import moment from "moment";

import Links from "../../Links/Links";
import Colors from "../../constants/Colors";
import { ListItem, List, Layout, Text } from "@ui-kitten/components";
import MarketInfoLink from "../../Links/MarketInfo";
import ISTile from "../../components/ATComponents/ISTile";

const IndicesSummary = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [indexSecArray, setIndexSecArray] = useState([]);
  const [marketStatus, setMarketStatus] = useState();

  const getMarketStatus = useCallback(async () => {
    const response = await fetch(Links.mLink + MarketInfoLink.statusLink);

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);
    return object.data.status;
  }, []);

  const fetchIndicesSummary = async () => {
    const dateLink = moment(this.date).format("YYYY-MM-DD");
    const usableDate = dateLink.split("-");

    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getMarketIndexSummary&format=json&tradeDate=" +
          usableDate[1] +
          "%2F" +
          usableDate[2] +
          "%2F" +
          usableDate[0]
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      return object.data.index;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;

    getMarketStatus()
      .then((mkS) => {
        if (isMounted) {
          setMarketStatus(mkS);
        }
      })
      .catch((e) => console.log(e));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchIndicesSummary()
      .then((iS) => {
        if (isMounted) {
          setIndexSecArray(iS);
        }
      })
      .catch((e) => console.log(e));

    return () => {
      isMounted = false;
    };
  }, [fetchIndicesSummary]);

  if (isLoading) {
    return (
      <Layout style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </Layout>
    );
  }

  const renderItemHandler = (itemData) => {
    return (
      <ListItem
        description={() => (
          <ISTile
            sector={itemData.item.sector}
            description={itemData.item.description}
            totVolume={itemData.item.totVolume}
            lastTraded={itemData.item.price}
            change={itemData.item.change}
            perChange={itemData.item.perChange}
          />
        )}
      />
    );
  };

  if (indexSecArray) {
    <Layout style={styles.centered}>
      <Text>Market Data is not updated for today</Text>
    </Layout>;
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.marketStatusContainer}>
        <Layout style={styles.mkStatContainer}>
          <Text
            style={{
              color:
                marketStatus === "Open" ? Colors.positive : Colors.negative,
            }}
          >
            {marketStatus}
          </Text>
        </Layout>
        <Layout
          style={{
            width: "80%",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>CSE</Text>
        </Layout>
        <Layout style={styles.levelContainer} />
      </Layout>
      <Layout
        style={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.ashgray,
        }}
      >
        <Layout style={{ width: "40%" }}>
          <Text style={styles.tText}>Index</Text>
          <Text>Description</Text>
        </Layout>
        <Layout style={{ width: "30%", alignItems: "flex-end" }}>
          <Text style={styles.tText}>Last Traded</Text>
          <Text>Volume</Text>
        </Layout>
        <Layout style={{ width: "30%", alignItems: "flex-end" }}>
          <Text style={styles.tText}>Change %</Text>
          <Text>Change</Text>
        </Layout>
      </Layout>

      <List
        onRefresh={fetchIndicesSummary}
        refreshing={isLoading}
        data={indexSecArray}
        renderItem={renderItemHandler}
        keyExtractor={(item) => item.sector}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    padding: 5,
  },
  marketStatusContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 30,
    alignItems: "center",
  },
  mkStatContainer: { width: "10%" },
  levelContainer: { width: "10%" },
  tText: { fontWeight: "bold" },
});

export default IndicesSummary;
