import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from "react-native";
import { Picker } from "@react-native-community/picker";

import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/UI/Card";
import Links from "../../Links/Links";
import TitleText from "../../components/UI/TitleText";

const generateUrlBuyOrSell = (
  clientCode,
  securityCode,
  accountId,
  orderQuantity,
  orderPrice
) => {
  const clientCodeSplitArray = clientCode.split("/");

  const setClCode =
    clientCodeSplitArray[0] +
    "%2F" +
    clientCodeSplitArray[1] +
    "%2F" +
    clientCodeSplitArray[2];

  return (
    Links.mLink +
    "order?action=checkBuyDisable&format=json&txtCDSActCode=" +
    setClCode +
    "&txtSecuritycode=" +
    securityCode +
    "&exchange=CSE&broker=NDB&accountid=" +
    accountId +
    "&ordPrice=" +
    orderPrice +
    "&ordQty=" +
    parseInt(orderQuantity)
  );
};

const generateLinkToGetInformation = (clCode, secCode, clActId, brk) => {
  const clientCodeSplitArray = clCode.split("/");

  const setClCode =
    clientCodeSplitArray[0] +
    "%2F" +
    clientCodeSplitArray[1] +
    "%2F" +
    clientCodeSplitArray[2];

  return (
    Links.mLink +
    "order?action=getOrderRestrictions&format=json&clientAcc=" +
    setClCode +
    "&security=" +
    secCode +
    "&broker=" +
    brk +
    "&clientAnctId=" +
    clActId
  );
};

const generateUrlCommision = (orderValue) => {
  return (
    Links.mLink +
    "order?action=calcCommission&format=json&orderValue=" +
    orderValue +
    "&accountType=normal"
  );
};

const generateUrlGetMarketDetails = () => {
  return Links.mLink + "order?action=getMarketDetails&format=json&market=CSE";
};

const BuySell = (props) => {
  const bOrS = props.route.params.bOrS;
  const allClients = useSelector((state) => state.loadingclients.allClients);
  const dispatch = useDispatch();
  const allSecurities = useSelector(
    (state) => state.allSecurities.justSecurities
  );
  const [isLoading, setIsLoading] = useState(false);
  const [security, setSecurity] = useState(props.route.params.securityCode);
  const [companyName, setCompanyName] = useState(
    props.route.params.securityName
  );
  const [buySell, setBuySell] = useState("");
  const [buyPow, setBuyPow] = useState("");
  const [client, setClient] = useState("");
  const clientDropDown = [];
  const tifDropDown = [];
  const [tifDropDownDays, setTifDropDownDays] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [commision, setCommision] = useState(0);
  const [orderValue, setOrderValue] = useState(0);
  const [netValue, setNetValue] = useState(0);
  const [tif, setTif] = useState([]);
  const [tifType, setTifType] = useState("");
  const [selectedTifDropDownDays, setSelectedTifDropDownDays] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  for (const key in allClients) {
    clientDropDown.push({
      label:
        allClients[key].clientCode +
        " (" +
        allClients[key].initials +
        allClients[key].lastName +
        ")",
      value: allClients[key].clientCode,
    });
  }

  const securityDropDown = [];

  for (const key in allSecurities) {
    securityDropDown.push({
      label: allSecurities[key].security,
      value: allSecurities[key].security,
    });
  }

  if (tif.length !== 0) {
    for (const key in tif) {
      tifDropDown.push({
        tifNames: tif[key].name,
        tifDay: tif[key].days,
      });
    }
  }

  const getMarketDetails = useCallback(async () => {
    const linkUrl = generateUrlGetMarketDetails();

    try {
      const responseMarketDetails = await fetch(linkUrl);

      const resDataMarketDetails = await responseMarketDetails.text();

      let replaceStringMarketDetails = resDataMarketDetails.replace(/'/g, '"');
      let objectMarketDetails = JSON.parse(replaceStringMarketDetails);

      return objectMarketDetails.data.market[3].tif;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const getMarketStatus = useCallback(async () => {
    try {
      const responseMarketStatus = await fetch(
        Links.mLink +
          "order?action=getMarketStatus&format=json&exchange=CSE&bordId=1&securityid=1"
      );

      if (!responseMarketStatus.ok) {
        throw new Error("Something went wrong!");
      }

      const resDataMarketStatus = await responseMarketStatus.text();

      let replaceStringMarketStatus = resDataMarketStatus.replace(/'/g, '"');
      let objectMarketStatus = JSON.parse(replaceStringMarketStatus);

      return objectMarketStatus.data.tradestatus;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const getClientInformation = useCallback(async (link) => {
    try {
      const response = await fetch(link);
      const resData = await response.text();
      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      setBuyPow(object.data.orderlimits.buyingpower);
      console.log(object.data.orderlimits.buyingpower);
    } catch (error) {
      throw error;
    }
  });

  useEffect(() => {
    let isMounted = true;
    getMarketDetails().then((tif) => {
      if (isMounted) {
        setTif(tif);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getMarketDetails]);

  useEffect(() => {
    let isMounted = true;

    getMarketStatus().then((oS) => {
      if (isMounted) {
        setOrderStatus(oS);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getMarketStatus]);

  const changeItemHandler = (itemData) => {
    const selectedSecurity = allSecurities.find(
      (sec) => sec.security === itemData
    );
    setSecurity(selectedSecurity.security);
    setCompanyName(selectedSecurity.securityDes);
  };

  const changeClientHandler = (itemData) => {
    setClient(itemData);
    const selectedClient = allClients.find(
      (cli) => cli.clientCode === itemData
    );
    const clientAccount = selectedClient.clientacntid;
    const brokerId = selectedClient.brokerId;
    const linkUrl = generateLinkToGetInformation(
      itemData,
      security,
      clientAccount,
      brokerId
    );
    getClientInformation(linkUrl);
  };

  const tifTypeHandler = (itemData) => {
    setTifType(itemData);
    const selectedTif = tifDropDown.find(
      (tifVal) => tifVal.tifNames === itemData
    );
    setTifDropDownDays(selectedTif.tifDay);
  };

  const selectedTifDropDownDaysHandler = (itemData) => {
    setSelectedTifDropDownDays(itemData);
  };

  const buySellPickerHandler = (itemData) => {
    setBuySell(itemData);
  };

  const getCommision = useCallback(async () => {
    if (quantity && price) {
      const orderVal = quantity * price;
      const commisionUrl = generateUrlCommision(orderVal);
      try {
        const responseCommision = await fetch(commisionUrl);
        if (!responseCommision.ok) {
          throw new Error("Something went wrong");
        }
        const resDataCommision = await responseCommision.text();
        let replaceStringCommision = resDataCommision.replace(/'/g, '"');
        let object = JSON.parse(replaceStringCommision);
        const commisionVal = parseFloat(object.data.commision[0]).toFixed(2);
        const netVal = parseFloat(orderVal) + parseFloat(commisionVal);
        setNetValue(netVal);
        setCommision(commisionVal);
        setOrderValue(orderVal);
      } catch (error) {
        throw error;
      }
    }
  }, [quantity, price]);

  getCommision();

  const buySellHandler = async () => {
    const selectedClient = allClients.find((cli) => cli.clientCode === client);

    const linkUrlrlBuyOrSell = generateUrlBuyOrSell(
      client,
      security,
      selectedClient.clientacntid,
      quantity,
      price
    );

    let lastNameSet = "";
    const lastNameSplitArray = selectedClient.lastName.split(" ");

    for (let i = 0; i < lastNameSplitArray.length; i++) {
      if (i === lastNameSplitArray.length - 1) {
        lastNameSet = lastNameSet + lastNameSplitArray[i] + "-";
      } else {
        lastNameSet = lastNameSet + lastNameSplitArray[i] + "%20";
      }
    }

    const clientCodeSplitArray = client.split("/");

    const setClCode =
      clientCodeSplitArray[0] +
      "%2F" +
      clientCodeSplitArray[1] +
      "%2F" +
      clientCodeSplitArray[2];

    const clientAccVal =
      setClCode +
      "%20(" +
      selectedClient.initials +
      "%20" +
      lastNameSet +
      selectedClient.nic +
      ")";

    try {
      const responseBuyOrSell = await fetch(linkUrlrlBuyOrSell);

      if (!responseBuyOrSell.ok) {
        throw new Error("Something went wrong!");
      }

      const resDataBuyOrSell = await responseBuyOrSell.text();

      let replaceStringBuyOrSell = resDataBuyOrSell.replace(/'/g, '"');
      let objectBuyOrSell = JSON.parse(replaceStringBuyOrSell);
      console.log(objectBuyOrSell);
    } catch (error) {
      throw error;
    }

    try {
      const responseBuySellForm = await fetch(Links.mLink + "order", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=submitOrder&market=CSE&broker=NDB&format=json&clientOrderId=&cseOrderId=&brokerClient=1&orderStatus=${orderStatus}&filledQty=&acntid=${
          selectedClient.clientacntid
        }&oldPrice=&oldQty=&remainder=${parseInt(
          quantity
        )}&orderplacedate=&marketPrice=1.5&oldDisclose=&txtContraBroker=&txtapprovalReason=&txtsenttoapproval=no&txtCompId=&txtOdrStatus=&clientAcc=${clientAccVal}&cmbClientAcc_end=&assetSelect=1&actionSelect=${buySell}&txtSecurity=${security}&cmbBoard=1&spnQuantity=${parseInt(
          quantity
        )}&spnPrice=${price}&spnMinFillQuantity=0&spnDisclose=${parseInt(
          quantity
        )}&cmbOrderType=2&cmbTif=${tifType}&cmbTifDays=${selectedTifDropDownDays}&spnYeild=0&spnEffectiveYield=0&hiddenSpnCseFee=0.02&spnCommission=0&txtTradeId=&brokerClientVal=1&confirm=1`,
      });

      if (!responseBuySellForm.ok) {
        throw new Error("Something went wrong!");
      }

      const resDataBuySellForm = await responseBuySellForm.text();

      let replaceStringBuySellForm = resDataBuySellForm.replace(/'/g, '"');
      let objectBuySellForm = JSON.parse(replaceStringBuySellForm);

      console.log(objectBuySellForm);

      if (
        objectBuySellForm.description ===
        "javascriptOrderSuccessesFullySubmitted"
      ) {
        Alert.alert(
          "Successful!",
          buySell === "1"
            ? "Your buying request has sent successfully"
            : "Your selling request has sent successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const buySellAlertHandler = () => {
    if (price != 0 && quantity != 0) {
      Alert.alert(
        "Are you sure?",
        buySell === "1"
          ? "Are you sure you want to buy?"
          : "Are you sure you want to sell?",
        [
          {
            text: buySell === "1" ? "Buy" : "Sell",
            onPress: () => {
              buySellHandler();
            },
            style: buySell === "1" ? "default" : "destructive",
          },
          {
            text: "Cancel",
            onPress: () => {},
            style: "default",
          },
        ]
      );
    }
    changeClientHandler(client);
  };

  const quantityHandler = (text) => {
    if (text !== "") {
      setQuantity(parseFloat(text).toFixed(2));
    } else {
      setQuantity(parseFloat(0).toFixed(2));
    }
  };

  const priceHandler = (text) => {
    if (text !== "") {
      setPrice(parseFloat(text).toFixed(2));
    } else {
      setPrice(parseFloat(0).toFixed(2));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (clientDropDown.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Clients, No Information</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {securityDropDown.length !== 0 && clientDropDown.length !== 0 ? (
        <View style={styles.contentContainer}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <View style={styles.pickerContainer}>
                <View
                  style={{
                    borderColor: Colors.positive,
                    borderWidth: 2,
                    width: "50%",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Picker
                    onValueChange={changeItemHandler}
                    selectedValue={security}
                  >
                    {securityDropDown.map((item, index) => (
                      <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.companyTitle}>
                <Text style={styles.title}>{companyName}</Text>
              </View>
              <View>
                <Text></Text>
              </View>
              <Card style={styles.subContainer}>
                <View style={styles.column}>
                  <View>
                    <Picker
                      selectedValue={
                        client === ""
                          ? changeClientHandler(clientDropDown[0].value)
                          : client
                      }
                      onValueChange={changeClientHandler}
                    >
                      {clientDropDown.map((item, index) => (
                        <Picker.Item
                          label={item.label}
                          value={item.value}
                          key={index}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View>
                    <TitleText>Price</TitleText>
                    <TextInput
                      style={{
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      }}
                      onChangeText={priceHandler}
                      keyboardType="numeric"
                    />
                    <TitleText>Buying Power</TitleText>
                    <Text>{buyPow}</Text>
                    <TitleText>Commission</TitleText>
                    <Text>{commision}</Text>
                  </View>
                </View>
                <View style={styles.column}>
                  <View>
                    {bOrS === "Buy" ? (
                      <Picker
                        selectedValue={
                          buySell === "" ? buySellPickerHandler("1") : buySell
                        }
                        onValueChange={buySellPickerHandler}
                      >
                        <Picker.Item label={"Buy"} value={"1"} />
                        <Picker.Item label={"Sell"} value={"2"} />
                      </Picker>
                    ) : (
                      <Picker
                        selectedValue={
                          buySell === "" ? buySellPickerHandler("2") : buySell
                        }
                        onValueChange={buySellPickerHandler}
                      >
                        <Picker.Item label={"Buy"} value={"1"} />
                        <Picker.Item label={"Sell"} value={"2"} />
                      </Picker>
                    )}
                  </View>
                  <View>
                    <TitleText>Quantity</TitleText>
                    <TextInput
                      style={{
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      }}
                      onChangeText={quantityHandler}
                      keyboardType="number-pad"
                    />
                    <TitleText>Order Value</TitleText>
                    <Text>{orderValue}</Text>
                    <TitleText>Net Value</TitleText>
                    <Text>{netValue}</Text>
                  </View>
                </View>
              </Card>
              <Card style={styles.subContainer}>
                <View style={styles.column}>
                  <TitleText>TIF:</TitleText>
                  {tifDropDown.length !== 0 && (
                    <Picker
                      selectedValue={
                        tifType === "" ? tifTypeHandler("DAY") : tifType
                      }
                      onValueChange={tifTypeHandler}
                    >
                      {tifDropDown.map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.tifNames}
                          value={item.tifNames}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
                <View style={styles.column}>
                  <TitleText>TIF Days:</TitleText>
                  {tifDropDownDays.length !== 0 && (
                    <Picker
                      selectedValue={
                        selectedTifDropDownDays === ""
                          ? selectedTifDropDownDaysHandler(
                              tifDropDownDays[0].day
                            )
                          : selectedTifDropDownDays
                      }
                      onValueChange={selectedTifDropDownDaysHandler}
                    >
                      {tifDropDownDays.map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.day}
                          value={item.day}
                        />
                      ))}
                    </Picker>
                  )}
                  <Button
                    title={buySell === "1" ? "Buy" : "Sell"}
                    onPress={buySellAlertHandler}
                  />
                </View>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </View>
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: "row",
  },
  pickerContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 5,
  },
  contentContainer: {
    flex: 1,
  },
  subContainer: {
    width: "98%",
    flexDirection: "row",
    marginHorizontal: 5,
    marginVertical: 15,
    paddingHorizontal: 2,
  },
  column: {
    width: "50%",
    padding: 5,
  },
  companyTitle: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
});

export default BuySell;
