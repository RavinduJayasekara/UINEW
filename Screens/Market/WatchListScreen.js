import React, { createRef, useEffect, useState } from "react";
import { View, StyleSheet, Button, ScrollView } from "react-native";
import { List, ListItem } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import * as allSecActions from "../../store/action/dropdownsecurities";
import { SwipeListView } from "react-native-swipe-list-view";
import SecTile from "../../components/ATComponents/SecTile";
import Links from "../../Links/Links";

const WatchList = (props) => {
  const allSec = useSelector((state) => state.allSecurities.securityDetails);
  const justSec = useSelector((state) => state.allSecurities.justSecurities);
  const dispatch = useDispatch();
  const watchId = useSelector((state) => state.auth.watchId);
  const [favS, setFavS] = useState([]);

  const getFavs = async (userWatchId) => {
    const response = await fetch(
      Links.mLink +
        "watch?action=userWatch&format=json&size=10&exchange=CSE&bookDefId=1&watchId=" +
        userWatchId +
        "&lastUpdatedId=0"
    );

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    setFavS(object.data.watch);
  };

  const getAll = async () => {
    await dispatch(allSecActions.fetchDropDownAllSecurities());
    await getFavs.bind(this, watchId);
  };

  useEffect(() => {
    props.navigation.addListener("focus", getAll);
  }, [getAll, getFavs]);

  // getFavs(watchId);

  const ref = createRef();

  return (
    <View style={styles.container}>
      <List
        data={allSec}
        renderItem={(itemData) => (
          <SecTile
            sec={itemData.item.security}
            cName={itemData.item.companyname}
            tradeP={itemData.item.tradeprice}
            totalV={itemData.item.totvolume}
            perC={itemData.item.perchange}
            netC={itemData.item.netchange}
            watchId={watchId}
            pFavourites={favS}
            screen={"w"}
            onSelect={() => {}}
            onPress={() =>
              props.navigation.navigate("QuoteTabNavigator", {
                params: {
                  security: itemData.item.security,
                  tradeprice: itemData.item.tradeprice,
                  perchange: itemData.item.perchange,
                  netchange: itemData.item.netchange,
                  bidprice: itemData.item.bidprice,
                  askprice: itemData.item.askprice,
                  bidqty: itemData.item.bidqty,
                  askqty: itemData.item.askqty,
                  vwap: itemData.item.vwap,
                  lowpx: itemData.item.lowpx,
                  highpx: itemData.item.highpx,
                  totvolume: itemData.item.totvolume,
                  tottrades: itemData.item.tottrades,
                  totturnover: itemData.item.totturnover,
                  lasttradedtime: itemData.item.lasttradedtime,
                },
              })
            }
          />
        )}
        keyExtractor={(item) => item.security}
      />
    </View>
  );
};

export const screenOptions = (navData) => {
  return {};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tile: { flex: 1, flexDirection: "row", height: 150, width: "100%" },
  lowBack: {},
});

export default WatchList;

/* <SwipeListView
        data={allSec}
        renderItem={(itemData) => {
          return (
            <SecTile
              ref={ref}
              sec={itemData.item.security}
              cName={itemData.item.companyname}
              tradeP={itemData.item.tradeprice}
              totalV={itemData.item.totvolume}
              perC={itemData.item.perchange}
              netC={itemData.item.netchange}
            />
          );
        }}
        renderHiddenItem={() => (
          <View style={styles.lowBack}>
            <Button title={"Left"} />
            <Button title={"Left"} />
            <Button title={"Left"} />
          </View>
        )}
        keyExtractor={(item) => item.security}
      /> */
