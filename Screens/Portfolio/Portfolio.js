import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

import Links from "../../Links/Links";
import Portfolio from "../../Links/Portfolio";
import Colors from "../../constants/Colors";
import {
  Layout,
  Select,
  SelectItem,
  Spinner,
  Text,
  IndexPath,
  List,
  ListItem,
  Divider,
  Modal,
} from "@ui-kitten/components";
import PTile from "../../components/ATComponents/PTile";
import { useSelector } from "react-redux";

const generateLink = (cCode, bId, cLastName, cInitials) => {
  const clientCodeSplitArray = cCode.split("/");

  const accountLink =
    clientCodeSplitArray[0] +
    "%2F" +
    clientCodeSplitArray[1] +
    "%2F" +
    clientCodeSplitArray[2];

  return (
    Links.mLink +
    Portfolio.clientPortfolioLink +
    "&account=" +
    accountLink +
    "&broker=" +
    bId +
    "&portfolioClientAccount=" +
    accountLink +
    "+(" +
    cInitials +
    "+" +
    cLastName +
    ")&portfolioAsset=EQUITY"
  );
};

const PortfolioSummary = (props) => {
  const [dropDownElements, setDropDownElements] = useState([]);
  const select = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [commission, setCommision] = useState(0);
  const [salesProceeds, setSalesProceeds] = useState(0);
  const [netGain, setNetGain] = useState(0);
  const [totCost, setTotCost] = useState(0);
  const [marketValue, setMarketValue] = useState(0);
  const [unrTotal, setUnrTotal] = useState(0);
  const [cCodeVal, setCCodeVal] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  let textColorGain = "";
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  // const visible = true;
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  let textColorUnr = "";
  // let displayValue = "";
  const [displayValue, setDisplayValue] = useState("");

  const allClients = useSelector((state) => state.loadingclients.allClients);

  const clientArray = [];

  for (const key in allClients) {
    clientArray.push({
      label:
        allClients[key].clientCode +
        " (" +
        allClients[key].initials +
        allClients[key].lastName +
        ")",
      value: allClients[key].clientCode,
    });
  }

  const fetchPortfolioDetails = useCallback(async (link) => {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      const portfolioDetails = object.data.portfolios;
      let allCommisions = 0;
      let allSalesProceeds = 0;
      let allNetGain = 0;
      let allTotCost = 0;
      let allUnrGainOrLoss = 0;
      let allTotQty = 0;
      for (const key in portfolioDetails) {
        allCommisions =
          allCommisions + parseFloat(portfolioDetails[key].commission);
        allSalesProceeds =
          allSalesProceeds + parseFloat(portfolioDetails[key].salesproceeds);
        allNetGain = allNetGain + parseFloat(portfolioDetails[key].netGain);
        allTotCost = allTotCost + parseFloat(portfolioDetails[key].totCost);
        allUnrGainOrLoss =
          allUnrGainOrLoss +
          parseFloat(
            portfolioDetails[key].netchange * portfolioDetails[key].quantity
          );
        allTotQty = allTotQty + parseFloat(portfolioDetails[key].quantity);
      }
      allTotQty = allTotQty.toFixed(2);
      setCommision(allCommisions.toFixed(2));
      setSalesProceeds(allSalesProceeds.toFixed(2));
      setNetGain(allNetGain.toFixed(2));
      setTotCost(allTotCost.toFixed(2));
      setMarketValue(parseFloat(object.data.markerValTot).toFixed(2));
      setUnrTotal(allUnrGainOrLoss.toFixed(2));
      setPortfolios(portfolioDetails);
    } catch (err) {
      throw err;
    }
  }, []);

  //check if netGain and unrTotal are positive negative or zero

  if (netGain > 0) {
    textColorGain = "green";
  } else if (netGain < 0) {
    textColorGain = "red";
  } else {
    textColorGain = "purple";
  }

  if (unrTotal > 0) {
    textColorUnr = "green";
  } else if (unrTotal < 0) {
    textColorUnr = "red";
  } else {
    textColorUnr = "purple";
  }

  const changeItemHandler = async (itemDataVal, itemDataLabel) => {
    setVisible(true);
    setDisplayValue(itemDataLabel);
    const selectedClient = allClients.find(
      (cli) => cli.clientCode === itemDataVal
    );
    const bId = selectedClient.brokerId;
    const cCode = selectedClient.clientCode;
    const cLastName = selectedClient.lastName;
    const cInitials = selectedClient.initials;

    const linkUrl = generateLink(cCode, bId, cLastName, cInitials);

    console.log(itemDataLabel, itemDataVal);

    await fetchPortfolioDetails(linkUrl)
      .then(() => setVisible(false))
      .catch((e) => console.log(e));
  };

  const renderOption = (itemData) => (
    <SelectItem title={itemData.label} key={itemData.label} />
  );

  const renderItem = (itemData) => {
    const netGL = parseFloat(itemData.item.netGain).toFixed(2);
    const mV = parseFloat(itemData.item.marketValue).toFixed(2);
    const agP = parseFloat(itemData.item.avgPrice).toFixed(2);
    return (
      <ListItem
        description={() => (
          <PTile
            security={itemData.item.security}
            lastTraded={itemData.item.lastTraded}
            netGaLo={netGL}
            mVa={mV}
            quantity={itemData.item.quantity}
            avgPrice={agP}
          />
        )}
        style={{
          backgroundColor:
            itemData.index % 2 === 0 ? Colors.white : Colors.lGray,
        }}
      />
    );
  };

  const ListHeaderComponent = () => (
    <Layout>
      <Layout style={styles.portListBlockContainer}>
        <Layout style={styles.portListBlockT}>
          <Text style={styles.tRText}>Symbol</Text>
          <Text>Price</Text>
        </Layout>
        <Layout style={styles.portListBlockS}>
          <Text style={styles.tRText}>Gain/Loss</Text>
          <Text>Market Value</Text>
        </Layout>
        <Layout style={styles.portListBlockS}>
          <Text style={styles.tRText}>Quantity</Text>
          <Text>Avg. Cost</Text>
        </Layout>
      </Layout>
      <Divider />
    </Layout>
  );

  if (clientArray.length === 0) {
    return (
      <Layout style={styles.centered}>
        <Text>No Clients. No Information.</Text>
      </Layout>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          },
        ]}
      >
        <Text style={styles.fadingText}>Fading View!</Text> */}

      <Layout style={styles.container}>
        <Layout style={{ marginVertical: 5 }}>
          {clientArray.length !== 0 ? (
            <Select
              size="large"
              status="basic"
              selectedIndex={selectedIndex}
              onSelect={(index) => {
                setSelectedIndex(index);
                changeItemHandler(
                  clientArray[index.row].value,
                  clientArray[index.row].label
                );
              }}
              value={
                displayValue === ""
                  ? changeItemHandler(
                      clientArray[selectedIndex.row].value,
                      clientArray[selectedIndex.row].label
                    )
                  : displayValue
              }
            >
              {clientArray.map(renderOption)}
            </Select>
          ) : (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </Layout>
        <Divider />
        <Layout
          style={{
            flexDirection: "row",
            width: "100%",
            marginHorizontal: 10,
          }}
        >
          <Layout style={styles.detailContainer}>
            <Layout style={styles.contentContainer}>
              <Text style={styles.tText}>Total Cost</Text>
              {loadingDetails ? (
                <Layout>
                  <Spinner size="small" color={Colors.primary} />
                </Layout>
              ) : (
                <Text>
                  {totCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Layout style={styles.contentContainer}>
              <Text style={styles.tText}>Market Value</Text>
              {loadingDetails ? (
                <Layout>
                  <Spinner size="small" color={Colors.primary} />
                </Layout>
              ) : (
                <Text>
                  {marketValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Layout style={styles.contentContainer}>
              <Text style={styles.tText}>Sales Commision</Text>
              {loadingDetails ? (
                <Layout>
                  <Spinner size="small" color={Colors.primary} />
                </Layout>
              ) : (
                <Text>
                  {commission.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
          </Layout>
          <Layout style={styles.detailContainer}>
            <Layout style={styles.contentContainer}>
              <Text style={styles.tText}>Sales Proceeds</Text>
              {loadingDetails ? (
                <Layout>
                  <Spinner size="small" color={Colors.primary} />
                </Layout>
              ) : (
                <Text>
                  {salesProceeds
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Layout style={styles.contentContainer}>
              <Text style={styles.tText}>Unrealized Gain/(Loss)</Text>
              {loadingDetails ? (
                <Layout>
                  <Spinner size="small" color={Colors.primary} />
                </Layout>
              ) : (
                <Text style={{ color: textColorGain }}>
                  {netGain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Layout style={styles.contentContainer}>
              <Text style={styles.tText}>Unr Today Gain/(Loss)</Text>
              {loadingDetails ? (
                <Layout>
                  <Spinner size="small" color={Colors.primary} />
                </Layout>
              ) : (
                <Text style={{ color: textColorUnr }}>
                  {unrTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
          </Layout>
        </Layout>
        <Divider />
        <List
          style={{ flex: 1 }}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => (
            <Layout>
              <List
                data={portfolios}
                renderItem={renderItem}
                keyExtractor={(item) => item.security}
              />
            </Layout>
          )}
        />
      </Layout>
      {/* </Animated.View> */}
      <Modal
        visible={visible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Spinner size="large" />
        <Text>Loading</Text>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: 50,
  },
  container: {
    flex: 1,
  },
  fadingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "powderblue",
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
    margin: 10,
  },
  dropDownContainer: {
    width: "97%",
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: "1.5%",
    shadowColor: Colors.none,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 10,
  },
  tText: { fontSize: 18, fontWeight: "bold" },
  linearGrad: {
    flex: 1,
  },
  detailContainer: {
    width: "50%",
    backgroundColor: "aqua",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  portListBlockContainer: {
    flexDirection: "row",
    marginHorizontal: 7,
    backgroundColor: Colors.white,
  },
  portListBlockS: {
    width: "30%",
    backgroundColor: Colors.white,
    alignItems: "flex-end",
  },
  portListBlockT: {
    width: "40%",
    backgroundColor: Colors.white,
  },
  tRText: { fontSize: 18, fontWeight: "bold" },
});

export default PortfolioSummary;
