import React, { useEffect, useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  IndexPath,
  Layout,
  Modal,
  Select,
  SelectItem,
  Spinner,
} from "@ui-kitten/components";

import Portfolio from "../../Links/Portfolio";
import Links from "../../Links/Links";
import Colors from "../../constants/Colors";

//THESE EXACT SAME STEPS WILL BE FOLLOWED IN PORTFOLIO ALSO

const generateLink = (cCode, bId, cAcnId) => {
  const clientCodeSplitArray = cCode.split("/");

  const accountLink =
    clientCodeSplitArray[0] +
    "%2F" +
    clientCodeSplitArray[1] +
    "%2F" +
    clientCodeSplitArray[2];

  const dateLink = moment(this.date).format("YYYY-MM-DD");

  return (
    Links.mLink +
    Portfolio.clientAccountSumLink +
    "&account=" +
    accountLink +
    "&broker=" +
    bId +
    "&accStmtdate=" +
    dateLink +
    "&clientAnctId=" +
    cAcnId
  );
};

const generateExactValue = (value) => {
  let num = 1;
  const numberSplitArray = value.split("E");

  for (let i = 0; i < numberSplitArray[1]; i++) {
    num = num * 10;
  }

  let exactNum = parseFloat(numberSplitArray[0]);
  const roundUpValue = exactNum * num;

  return roundUpValue.toFixed(2);
};

const AccountSummary = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const [totCostPort, setTotCostPort] = useState(0);
  const [totMarketPort, setTotMarketPort] = useState(0);
  const [totGL, setTotGL] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [pendingBuyOrders, setPendingBuyOrders] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [marginAmountEquity, setMarginAmountEquity] = useState(0);
  const [marginAmountDebt, setMarginAmountDebt] = useState(0);
  const [cashBlock, setCashBlock] = useState(0);
  const [marginBlock, setMarginBlock] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [displayValue, setDisplayValue] = useState("");
  const [visible, setVisible] = useState(false);
  // textColors for values

  let textColorTotGL = "";
  let textColorCashBalance = "";
  let textColorBuyingPower = "";

  if (totGL > 0) {
    textColorTotGL = "green";
  } else if (totGL < 0) {
    textColorTotGL = "red";
  } else {
    textColorTotGL = "purple";
  }

  if (cashBalance > 0) {
    textColorCashBalance = "green";
  } else if (cashBalance < 0) {
    textColorCashBalance = "red";
  } else {
    textColorCashBalance = "purple";
  }

  if (buyingPower > 0) {
    textColorBuyingPower = "green";
  } else if (buyingPower < 0) {
    textColorBuyingPower = "red";
  } else {
    textColorBuyingPower = "purple";
  }

  const getInformation = async (gotLink) => {
    try {
      const response = await fetch(gotLink);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      let totCostPort = "";
      let totMarketValPort = "";
      let totGainLossPort = "";
      let totBuyPowerPort = "";
      let totMarginEquiPort = "";
      let totCashBalancePort = "";

      totCostPort = generateExactValue(
        object.data.clientSummary.totalPortfolioCost
      );
      setTotCostPort(totCostPort);

      totMarketValPort = generateExactValue(
        object.data.clientSummary.totalPortfolioMarketValue
      );
      setTotMarketPort(totMarketValPort);

      totGainLossPort = generateExactValue(
        object.data.clientSummary.totalGainLoss
      );
      setTotGL(totGainLossPort);

      totCashBalancePort = generateExactValue(
        object.data.clientSummary.cashBalance
      );
      setCashBalance(totCashBalancePort);

      totBuyPowerPort = generateExactValue(
        object.data.clientSummary.buyingPower
      );
      setBuyingPower(totBuyPowerPort);

      setPendingBuyOrders(object.data.clientSummary.totalPendingBuyOrderValue);
      setPercentage(object.data.clientSummary.exposurePercentage);

      totMarginEquiPort = generateExactValue(
        object.data.clientSummary.marginAmount
      );
      setMarginAmountEquity(totMarginEquiPort);

      setMarginAmountDebt(object.data.clientSummary.marginAmountD);
      setCashBlock(object.data.clientSummary.cashBlock);
      setMarginBlock(object.data.clientSummary.marginBlock);
    } catch (error) {
      throw error;
    }
  };

  const changeItemHandler = async (itemDataVal, itemDataLabel) => {
    setVisible(true);
    setDisplayValue(itemDataLabel);
    const selectedClient = allClients.find(
      (cli) => cli.clientCode === itemDataVal
    );

    const cCode = selectedClient.clientCode;
    const bId = selectedClient.brokerId;
    const cAcnId = selectedClient.clientacntid;

    const generalLink = generateLink(cCode, bId, cAcnId);

    await getInformation(generalLink).then(() => setVisible(false));
    // .then(() => setVisible(false))
    // .catch((e) => console.log(e));

    // setLoadingDetails(true);
    // setTimeout(() => {
    //   setVisible(false);
    //   getInformation(generalLink);
    //   console.log("ravindu");
    // }, 5000);

    // .then(() => {
    //   setLoadingDetails(false);
    // })
    // .catch((e) => console.log(e));
    //   console.log("Ravindu");
  };

  const renderOption = (itemData) => (
    <SelectItem title={itemData.label} key={itemData.label} />
  );

  if (clientArray.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Clients. No Information.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Layout style={styles.container}>
        <Layout style={styles.dropDownContainer} level="1">
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
        <Layout style={{ flex: 1 }}>
          <ScrollView>
            <Layout style={styles.contentContainer}>
              <Text>Total Cost of the Portfolio</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {totCostPort.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Total Market Value of the Portfolio</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {totMarketPort
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Total Gain/Loss</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text style={{ color: textColorTotGL }}>
                  {totGL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Cash Balance</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text style={{ color: textColorCashBalance }}>
                  {cashBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Buying Power</Text>

              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text style={{ color: textColorBuyingPower }}>
                  {buyingPower.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Total Pending Buy Orders Value</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {pendingBuyOrders
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Exposure Precentage</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {percentage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Exposure Margin Amount-Equity</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {marginAmountEquity
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Exposure Margin Amount-Debt</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {marginAmountDebt
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Cash Block Amount</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {cashBlock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
            <Layout style={styles.contentContainer}>
              <Text>Margin Block Amount</Text>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {marginBlock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Layout>
            <Divider />
          </ScrollView>
        </Layout>
      </Layout>

      <Modal visible={visible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Spinner size="large" />
          <Text>Now Loading</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    padding: 5,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropDownContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  linearGrad: {
    flex: 1,
  },
});

export default AccountSummary;
