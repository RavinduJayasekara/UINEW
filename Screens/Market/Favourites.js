import React, { useEffect, useState } from "react";
import { List, ListItem } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import Links from "../../Links/Links";
import SecTile from "../../components/ATComponents/SecTile";

const Favourites = (props) => {
  const watchId = useSelector((state) => state.auth.watchId);
  const [favS, setFavS] = useState([]);

  const getFavs = async (userWatchId) => {
    const response2 = await fetch(
      Links.mLink +
        "watch?action=userWatch&format=json&size=10&exchange=CSE&bookDefId=1&watchId=" +
        userWatchId +
        "&lastUpdatedId=0"
    );

    const resData2 = await response2.text();

    let replaceString2 = resData2.replace(/'/g, '"');
    let object2 = JSON.parse(replaceString2);

    setFavS(object2.data.watch);
  };

  const removeSec = async (secCode, userWatchId) => {
    const response = await fetch(
      Links.mLink +
        "watch?action=deleteUserSecurity&format=json&exchange=CSE&bookDefId=1&securityid=" +
        secCode +
        "&watchId=" +
        userWatchId
    );

    const resData = await response.text();
    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);
    await getFavs(userWatchId);
  };

  useEffect(() => {
    props.navigation.addListener("focus", getFavs.bind(this, watchId));
  }, [props.navigation]);

  return (
    <List
      data={favS}
      initialNumToRender={5}
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
          screen={"f"}
          onSelect={removeSec.bind(this, itemData.item.security, watchId)}
          onPress={() =>
            props.navigation.navigate("QuoteTabNavigator", {
              params: {
                security: itemData.item.security,
                companyname: itemData.item.companyname,
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
  );
};

export default Favourites;
