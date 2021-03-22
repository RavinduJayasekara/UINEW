import React, { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  TouchableNativeFeedback,
  StyleSheet,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";

import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as allSecurityActions from "../../store/action/dropdownsecurities";
import Links from "../../Links/Links";

const Search = (props) => {
  const [searchWord, setSearchWord] = useState("");
  const allSecurities = useSelector(
    (state) => state.dropdownsecurities.securityDetails
  );
  const [filteredSecurities, setFilteredSecuritites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const setWatch = useSelector((state) => state.auth.watchId);
  const [companyDetails, setCompanyDetails] = useState([]);

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android") {
    TouchableCmp = TouchableNativeFeedback;
  }

  const searchHandler = (text) => {
    setSearchWord(text);
    if (text !== "") {
      let securityWordToUpperCase = text.toUpperCase();

      const filterSearchedSecurities = allSecurities.filter((sec) =>
        sec.security.match(securityWordToUpperCase, "g")
      );

      setFilteredSecuritites(filterSearchedSecurities);
    } else {
      setFilteredSecuritites([]);
    }
  };

  const loadAllSecurities = useCallback(async () => {
    setIsLoading(true);
    await dispatch(allSecurityActions.fetchDropDownAllSecurities());
    setIsLoading(false);
  }, [setIsLoading]);

  const getCompanyData = useCallback(
    async (securityId) => {
      try {
        const response = await fetch(
          Links.mLink +
            "watch?action=getQuickWatch&format=json&exchange=CSE&bookDefId=1&securityid=" +
            securityId +
            "&isquickwatchsecurity=true&lastUpdatedId=26858&dojo.preventCache=1606190373695"
        );

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const resData = await response.text();

        let replaceString = resData.replace(/'/g, '"');
        let object = JSON.parse(replaceString);

        return object.data.watch;
      } catch (err) {
        throw err;
      }
    },
    [setCompanyDetails]
  );

  const securityHandler = async (itemData) => {
    const getItem = await getCompanyData(itemData.item.security);

    props.navigation.navigate("CompanyDetailsScreen", {
      secCode: getItem[0].security,
      companyname: getItem[0].companyname,
      lastpx: getItem[0].lastpx,
      lowpx: getItem[0].lowpx,
      highpx: getItem[0].highpx,
      totvolume: getItem[0].totvolume,
      tradeprice: getItem[0].tradeprice,
      totturnover: getItem[0].totturnover,
      netchange: getItem[0].netchange,
      perchange: getItem[0].perchange,
    });
  };

  useEffect(() => {
    loadAllSecurities();
  }, [loadAllSecurities]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View>
      <SearchBar
        platform={Platform.OS === "android" ? "android" : "ios"}
        onChangeText={searchHandler}
        value={searchWord}
      />
      <FlatList
        data={filteredSecurities}
        renderItem={(itemData) => (
          <Card>
            <TouchableCmp onPress={securityHandler.bind(this, itemData)}>
              <View style={styles.cardView}>
                <Text>{itemData.item.security}</Text>
              </View>
            </TouchableCmp>
          </Card>
        )}
        keyExtractor={(item) => item.security}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
  },
});

export default Search;
