import {
  Divider,
  Layout,
  List,
  ListItem,
  Text,
  Icon,
  Spinner,
} from "@ui-kitten/components";
import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import Colors from "../../constants/Colors";
import moment from "moment";
import MarketInfoLink from "../../Links/MarketInfo";
import Links from "../../Links/Links";
import AnnTile from "../../components/ATComponents/AnnTile";
import SpinnerOverlay from "react-native-loading-spinner-overlay";

const generateLinkForSectorData = (secId) => {
  return (
    Links.mLink +
    "sector?action=getSectorData&format=json&exchange=CSE&sectorId=" +
    secId
  );
};

const UpIcon = () => (
  <Icon style={styles.icon} fill={Colors.positive} name="arrow-up" />
);
const DownIcon = () => (
  <Icon style={styles.icon} fill={Colors.negative} name="arrow-down" />
);

const MarketInfo = (props) => {
  const [marketStatus, setMarketStatus] = useState();
  const [sectorDropDown, setSectorDropDown] = useState([]);
  const [sectorCode, setSectorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMarketInfo, setLoadingMarketInfo] = useState(false);
  const [totVolume, setTotVolume] = useState(0);
  const [totTrades, setTotTrades] = useState(0);
  const [totTurnOver, setTotTurnOver] = useState("");
  const [change, setChange] = useState("");
  const [perChange, setPerChange] = useState("");
  const [priceVal, setPriceVal] = useState("");
  const [announcementArray, setAnnouncementArray] = useState();
  const announcements = [];
  let changeOrPerChangeColor = "";
  const [visible, setVisible] = useState(false);

  const getMarketInfo = useCallback(async (link) => {
    try {
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      const marketInfoArray = object.data.sector;
      return marketInfoArray;
    } catch (e) {
      console.log("getDropDownDetails", e);
    }
  }, []);

  const getChartInfo = async (sCode) => {
    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getIntraDayData&format=json&market=CSE&item=" +
          sCode
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();
      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
    } catch (e) {
      console.log("getChartInfo", e);
    }
  };

  const getMarketStatus = useCallback(async () => {
    try {
      const response = await fetch(Links.mLink + MarketInfoLink.statusLink);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      return object.data.status;
    } catch (e) {
      console.log("getMarketStatus", e);
    }
  }, []);

  const getDropDownDetails = useCallback(async () => {
    try {
      const response = await fetch(
        Links.mLink + MarketInfoLink.marketDetailsLink
      );

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      const sectorValues = object.data.indices;
      let arrayList = [];
      for (const key in sectorValues) {
        arrayList.push({
          label: sectorValues[key].sector,
          value: sectorValues[key].sector,
        });
      }
      return arrayList;
    } catch (e) {
      console.log("getDropDownDetails", e);
    }
  }, []);

  const renderAnnouncementItem = (itemData) => {
    return (
      <ListItem
        description={() => (
          <AnnTile
            securityId={itemData.item.securityId}
            title={itemData.item.title}
          />
        )}
      />
    );
  };

  useEffect(() => {
    const weekAgo = moment().subtract(1, "week").calendar();
    const todayDate = moment(this.date).format("YYYY-MM-DD");
    let isMounted = true;
    const dateSplitArrayToday = todayDate.split("-");
    const dateSplitArrayWeek = weekAgo.split("/");

    const linkToday =
      dateSplitArrayToday[1] +
      "%2F" +
      dateSplitArrayToday[2] +
      "%2F" +
      dateSplitArrayToday[0];

    const linkWeek =
      dateSplitArrayWeek[0] +
      "%2F" +
      dateSplitArrayWeek[1] +
      "%2F" +
      dateSplitArrayWeek[2];

    fetch(
      Links.mLink +
        "marketdetails?action=getCSEAnnouncementHistory&format=json&msgType=CSE&fromDate=" +
        linkWeek +
        "&toDate=" +
        linkToday +
        "&security=&pageNumber=1"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        return response.text();
      })
      .then((resData) => {
        let replaceString = resData.replace(/'/g, '"');
        let object = JSON.parse(replaceString);
        return object;
      })
      .then((object) => {
        if (isMounted) {
          setAnnouncementArray(object.data.announcement);
        }
      })
      .catch((e) => console.log("catch", e));

    // if (!response.ok) {
    //   throw new Error("Something went wrong!");
    // }

    // const resData = await response.text();
    // let replaceString = resData.replace(/'/g, '"');
    // let object = JSON.parse(replaceString);

    // setAnnouncementArray(object.data.announcement);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const linkUrl = generateLinkForSectorData("ASI");
    // setLoadingMarketInfo(true);
    getMarketInfo(linkUrl)
      .then((marketInfoArray) => {
        if (isMounted) {
          let totTO = "";
          let totV = "";
          let totTr = "";
          let c = "";
          let pC = "";
          let pCV = "";
          marketInfoArray.map((item) => {
            totTO = item.totTurnOver;
            totV = item.totVolume;
            totTr = item.totTrades;
            c = item.change;
            pC = item.perChange;
            pCV = item.price;
          });

          setTotTurnOver(totTO);
          setTotVolume(parseFloat(totV));
          setTotTrades(parseFloat(totTr));
          setChange(c);
          setPerChange(pC);
          setPriceVal(pCV);
        }
      })
      .catch((e) => console.log("error", e));
    // await getChartInfo(itemData);
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

  useEffect(() => {
    let isMounted = true;
    getDropDownDetails()
      .then((arrayList) => {
        if (isMounted) {
          setSectorDropDown(arrayList);
        }
      })
      .catch((e) => console.log("error", e));
    return () => {
      isMounted = false;
    };
  }, []);

  const HeaderComp = () => (
    <Layout>
      <Layout style={{ marginHorizontal: 10 }}>
        <Divider />
        <Layout style={styles.indexNameContainer}>
          <Text style={{ fontWeight: "bold" }}>ASPI</Text>
          <Layout style={styles.indexNameContainerLevel} />
          <Text>All Share Index</Text>
        </Layout>
        <Divider />
        <Layout style={styles.indexMInfoContainer}>
          <Layout style={styles.priceValContainer}>
            {parseInt(priceVal) > 0 ? <UpIcon /> : <DownIcon />}
            <Text
              style={{
                ...styles.priceValText,
                ...{
                  color:
                    parseFloat(priceVal) > 0
                      ? Colors.positive
                      : Colors.negative,
                  fontWeight: "bold",
                },
              }}
            >
              {priceVal}
            </Text>
          </Layout>
          <Layout style={styles.indexMInfoContainerLevel} />
          <Layout style={styles.changeContainer}>
            <Layout
              style={{
                backgroundColor:
                  parseFloat(perChange) > 0 ? Colors.positive : Colors.negative,
                paddingHorizontal: 10,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: "bold",
                }}
              >
                {perChange}%
              </Text>
            </Layout>
            <Layout style={{ paddingHorizontal: 5 }} />
            <Text
              style={{
                color: parseInt(change) > 0 ? Colors.positive : Colors.negative,
                fontWeight: "bold",
              }}
            >
              {change}
            </Text>
          </Layout>
        </Layout>
        <Divider />
        <Layout style={styles.indexSInfoContainer}>
          <Layout style={styles.vTContainer}>
            <Layout style={styles.totVContainer}>
              <Text>Volume</Text>
              <Text style={styles.totTextValues}>
                {totVolume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </Layout>
            <Layout style={styles.totTContainer}>
              <Text>Trades</Text>
              <Text style={styles.totTextValues}>
                {totTrades.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </Layout>
          </Layout>
          <Text>Turnover</Text>
          <Text style={styles.totTextValues}>{totTurnOver}</Text>
        </Layout>
        <Divider />
      </Layout>

      <Layout style={styles.newsAannC}>
        <Text style={{ color: Colors.ashgray }}>News and Announcements</Text>
      </Layout>
      <Divider />
    </Layout>
  );

  if (change < 0 && perChange < 0) {
    changeOrPerChangeColor = Colors.negative;
  } else {
    changeOrPerChangeColor = Colors.positive;
  }

  if (announcementArray) {
    for (const key in announcementArray) {
      announcements.push({
        announcement: announcementArray[key].announcement,
        date: announcementArray[key].date,
        securityId: announcementArray[key].msgSecurityId,
        title: announcementArray[key].subject,
      });
    }
  }

  if (isLoading) {
    return (
      <Layout style={styles.centered}>
        <Spinner size="large" color={Colors.primary} />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <SpinnerOverlay
        visible={visible}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <Layout>
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
        <Layout style={styles.newsContainer}>
          {announcementArray && announcements.length !== 0 && (
            <List
              data={announcements}
              renderItem={renderAnnouncementItem}
              ListHeaderComponent={HeaderComp}
            />
          )}
        </Layout>
      </Layout>
      {/* ) : (
        <View style={styles.centered}>
          <Spinner size="small" />
        </View>
      )} */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  marketStatusContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 30,
    alignItems: "center",
  },
  indexNameContainer: {
    flexDirection: "row",
    minHeight: 30,
    alignItems: "center",
    marginVertical: 5,
  },
  changeContainer: { flexDirection: "row" },
  vTContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  mkStatContainer: { width: "10%" },
  levelContainer: { width: "10%" },
  indexNameContainerLevel: {
    paddingHorizontal: 10,
  },
  priceValText: {
    fontSize: 20,
  },
  icon: { width: 20, height: 20 },
  priceValContainer: { flexDirection: "row", alignItems: "center" },
  indexMInfoContainer: { marginVertical: 20 },
  indexMInfoContainerLevel: { paddingVertical: 5 },
  totTContainer: { alignItems: "flex-end" },
  totTextValues: { fontWeight: "bold", fontSize: 20 },
  indexSInfoContainer: { marginVertical: 7 },
  newsAannC: { backgroundColor: Colors.lGray, paddingHorizontal: 10 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MarketInfo;
