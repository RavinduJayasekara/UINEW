import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Button,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
} from "@ui-kitten/components";
import MarketInfoLink from "../../Links/MarketInfo";
import Colors from "../../constants/Colors";
import * as topStocksActions from "../../store/action/topStocks";
import { useDispatch, useSelector } from "react-redux";
import TGLTile from "../../components/ATComponents/TGLTile";
import TSVTile from "../../components/ATComponents/TSVTile";
import Links from "../../Links/Links";

const UpIcon = () => (
  <Icon style={styles.icon} fill={Colors.positive} name="arrow-up" />
);
const DownIcon = () => (
  <Icon style={styles.icon} fill={Colors.negative} name="arrow-down" />
);
const UpNIcon = () => (
  <Icon style={styles.icon} name="arrow-up" fill={Colors.primary} />
);
const DownNIcon = () => (
  <Icon style={styles.icon} name="arrow-down" fill={Colors.primary} />
);
const TurnOIcon = () => (
  <Icon style={styles.icon} name="pie-chart" fill={Colors.primary} />
);
const ShareIcon = () => (
  <Icon style={styles.icon} name="share" fill={Colors.primary} />
);

const TopStocks = (props) => {
  const [gV, setGV] = useState(false);
  const [lV, setLV] = useState(false);
  const [tV, setTV] = useState(false);
  const [sV, setSV] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const topGainers = useSelector((state) => state.topStocks.securitiesGainer);
  const topLosers = useSelector((state) => state.topStocks.securitiesLoser);
  const [marketStatus, setMarketStatus] = useState();
  const securitiesTurnOver = useSelector(
    (state) => state.topStocks.securitiesTurnOver
  );
  const securitiesShareVolume = useSelector(
    (state) => state.topStocks.securitiesShareVolume
  );
  const dispatch = useDispatch();

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

  const renderItem = (itemData, tColor) => {
    return (
      <ListItem
        description={() => (
          <TGLTile
            color={tColor}
            sec={itemData.item.security}
            last={itemData.item.tradeprice}
            chng={itemData.item.netchange}
            chngP={itemData.item.perchange}
          />
        )}
        style={{
          backgroundColor:
            itemData.index % 2 === 0 ? Colors.white : Colors.lGray,
        }}
      />
    );
  };

  const renderItemTSV = (itemData) => {
    return (
      <ListItem
        description={() => (
          <TSVTile
            sec={itemData.item.security}
            bidprice={itemData.item.bidprice}
            totvolume={itemData.item.totvolume}
            totturnover={itemData.item.totturnover}
          />
        )}
        style={{
          backgroundColor:
            itemData.index % 2 === 0 ? Colors.white : Colors.lGray,
        }}
      />
    );
  };

  const ListEmptyComponent = () => (
    <Layout>
      <Button
        onPress={() => setGV(!gV)}
        accessoryLeft={UpIcon}
        accessoryRight={gV ? UpNIcon : DownNIcon}
        style={styles.button}
        appearance="outline"
        size={"large"}
      >
        Top Gainers
      </Button>
      {gV && (
        <View>
          <List
            data={topGainers}
            renderItem={(item) => renderItem(item, Colors.positive)}
            keyExtractor={(item) => item.security}
            listKey={"1"}
          />
        </View>
      )}
      <Button
        onPress={() => setLV(!lV)}
        accessoryLeft={DownIcon}
        accessoryRight={lV ? UpNIcon : DownNIcon}
        style={styles.button}
        appearance="outline"
      >
        Top Losers
      </Button>
      {lV && (
        <View>
          <List
            data={topLosers}
            renderItem={(item) => renderItem(item, Colors.negative)}
            keyExtractor={(item) => item.security}
            listKey={"2"}
          />
        </View>
      )}
      <Button
        onPress={() => setTV(!tV)}
        accessoryLeft={TurnOIcon}
        accessoryRight={tV ? UpNIcon : DownNIcon}
        style={styles.button}
        appearance="outline"
      >
        Turn Over
      </Button>
      {tV && (
        <View>
          <List
            data={securitiesTurnOver}
            renderItem={renderItemTSV}
            keyExtractor={(item) => item.security}
            listKey={"3"}
          />
        </View>
      )}
      <Button
        onPress={() => setSV(!sV)}
        accessoryLeft={ShareIcon}
        accessoryRight={sV ? UpNIcon : DownNIcon}
        style={styles.button}
        appearance="outline"
      >
        Share Volume
      </Button>
      {sV && (
        <View>
          <List
            data={securitiesShareVolume}
            renderItem={renderItemTSV}
            keyExtractor={(item) => item.security}
            listKey={"4"}
          />
        </View>
      )}
    </Layout>
  );

  useEffect(() => {
    let isMounted = true;
    dispatch(topStocksActions.fetchGainers())
      .then((e) => {
        if (isMounted) {
          console.log("gainers");
        }
      })
      .catch((e) => console.log(e));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    dispatch(topStocksActions.fetchLosers())
      .then((e) => {
        if (isMounted) {
          console.log("losers");
        }
      })
      .catch((e) => console.log(e));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    dispatch(topStocksActions.fetchShareVolume())
      .then((e) => {
        if (isMounted) {
          console.log("sharevol");
        }
      })
      .catch((e) => console.log(e));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    dispatch(topStocksActions.fetchTurnOver())
      .then((e) => {
        if (isMounted) {
          console.log("turnover");
        }
      })
      .catch((e) => console.log(e));

    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <View style={styles.container}>
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
      <FlatList ListEmptyComponent={ListEmptyComponent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    borderRadius: 0,
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
});

export default TopStocks;
