import React, { forwardRef, PureComponent } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { ListItem, Text, Icon, Button } from "@ui-kitten/components";
import Colors from "../../constants/Colors";
import Links from "../../Links/Links";
import * as secActions from "../../store/action/dropdownsecurities";

class SecTile extends PureComponent {
  state = {
    modalVisible: false,
    added: false,
    favs: [],
    errC: "",
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  addToWatchList = (inList) => {
    this.setState({ added: inList });
  };

  addSecuritiesToList = async (secCode, userWatchId) => {
    const linkUrl =
      Links.mLink +
      "watch?action=addUserSecurity&format=json&exchange=CSE&bookDefId=1&securityid=" +
      secCode +
      "&watchId=" +
      userWatchId +
      "&isquickwatchsecurity=false";

    const response = await fetch(linkUrl);
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    // console.log(object.errorCount);

    if (parseInt(object.errorCount) === 0) {
      console.log("If 0 is", object.errorCount);
      this.setState({ errC: "0" });
    } else {
      console.log("If 1 is", object.errorCount);
      this.setState({ errC: "1" });
    }
  };

  removeSec = async (secCode, userWatchId) => {
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

    const response2 = await fetch(
      Links.mLink +
        "watch?action=userWatch&format=json&size=10&exchange=CSE&bookDefId=1&watchId=" +
        userWatchId +
        "&lastUpdatedId=0"
    );

    const resData2 = await response2.text();
    let replaceString2 = resData2.replace(/'/g, '"');
    let object2 = JSON.parse(replaceString2);

    // console.log(object2);
  };

  func = () => {
    const pFavourites = this.props.pFavourites;
    const sec = this.props.sec;
    if (pFavourites) {
      const item = pFavourites.find((item) => item.security === sec);
      if (item) {
        this.setState({ added: true });
        // console.log(item);
      }
    }
  };

  componentDidMount() {
    this.func();
  }

  render() {
    const { modalVisible, added, errC } = this.state;
    let bColor, tColor;

    const buttonFunc = (sec, errCode, watchId) => {
      console.log("sec is", sec, "errCode is", errCode);

      if (errCode === "1") {
        this.removeSec(sec, watchId);
      } else {
        this.addSecuritiesToList(sec, watchId);
      }
      this.addToWatchList(!added);
    };

    if (parseFloat(this.props.perC) > 0) {
      bColor = Colors.positive;
      tColor = Colors.white;
    } else if (parseFloat(this.props.perC) === 0) {
      bColor = "#ccc";
      tColor = Colors.none;
    } else {
      bColor = Colors.negative;
      tColor = Colors.white;
    }

    const AddWatchListIcon = () => (
      <Icon name="eye-off" style={{ width: 20, height: 20 }} fill="black" />
    );

    const InWatchListIcon = () => (
      <Icon name="eye" style={{ width: 20, height: 20 }} fill={"black"} />
    );

    const LeftIconShow = () => (
      <Icon
        name="arrow-ios-forward-outline"
        style={{ width: 20, height: 20 }}
        fill={"black"}
      />
    );

    const TrashIcon = () => (
      <Icon name="trash" style={{ width: 20, height: 20 }} fill={"black"} />
    );

    const LeftIconHide = () => (
      <Icon
        name="arrow-ios-back"
        style={{ width: 20, height: 20 }}
        fill={"black"}
      />
    );

    const renderItemAccessory = (props) => (
      <Button
        size="small"
        style={{ height: "100%" }}
        appearance="ghost"
        accessoryLeft={LeftIconShow}
        onPress={() => this.setModalVisible(!modalVisible)}
      />
    );

    const renderAccessory = (props) => (
      <Button
        size="small"
        style={{ height: "100%" }}
        appearance="ghost"
        accessoryLeft={LeftIconHide}
        onPress={() => this.setModalVisible(!modalVisible)}
      />
    );

    if (modalVisible) {
      return (
        <ListItem
          style={styles.ui}
          title={() => (
            <Text style={{ fontWeight: "bold" }}>{this.props.sec}</Text>
          )}
          description={() => (
            <View style={styles.container}>
              <View style={styles.tileMi}>
                <Button
                  style={{ width: "90%" }}
                  appearance={"outline"}
                  size={"medium"}
                >
                  Buy
                </Button>
              </View>
              <View style={styles.tileMi}>
                <Button
                  style={{ width: "90%" }}
                  appearance={"outline"}
                  size={"medium"}
                >
                  Sell
                </Button>
              </View>
              <View style={styles.tileMi}>
                <Button
                  style={{ width: "90%" }}
                  appearance={"outline"}
                  size={"medium"}
                  accessoryLeft={
                    this.props.screen === "w"
                      ? !added
                        ? AddWatchListIcon
                        : InWatchListIcon
                      : TrashIcon
                  }
                  onPress={
                    this.props.screen === "w"
                      ? buttonFunc.bind(
                          this,
                          this.props.sec,
                          errC,
                          this.props.watchId
                        )
                      : this.props.onSelect
                  }
                />
              </View>
              <View style={styles.tileMr}>
                <Text>{this.props.cName}</Text>
              </View>
            </View>
          )}
          accessoryLeft={renderAccessory}
          onPress={this.props.onPress}
        />
      );
    }

    return (
      <ListItem
        style={styles.ui}
        title={() => (
          <Text style={{ fontWeight: "bold" }}>{this.props.sec}</Text>
        )}
        description={() => (
          <View style={styles.container}>
            <View style={styles.tileMr}>
              <Text numberOfLines={1}>{this.props.cName}</Text>
            </View>
            <View style={styles.tileM}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: Colors.primary,
                }}
              >
                {this.props.tradeP}
              </Text>
              <Text>{this.props.totalV}</Text>
            </View>
            <View style={styles.tileM}>
              <View
                style={{
                  backgroundColor: bColor,
                  width: "75%",
                  borderRadius: 2.5,
                  alignItems: "flex-end",
                  paddingRight: 5,
                }}
              >
                <Text
                  style={{
                    color: tColor,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {this.props.perC}%
                </Text>
              </View>

              <Text>{this.props.netC}</Text>
            </View>
          </View>
        )}
        accessoryLeft={renderItemAccessory}
        onPress={this.props.onPress}
      />
    );
  }
}

// class SecTile extends PureComponent {
//   render() {
//     return (
//       <View style={styles.container} ref={this.ref}>
//         <View style={styles.tileMr}>
//           <Text>{this.props.sec}</Text>
//           <Text numberOfLines={1}>{this.props.cName}</Text>
//         </View>
//         <View style={styles.tileM}>
//           <Text>{this.props.tradeP}</Text>
//           <Text>{this.props.totalV}</Text>
//         </View>
//         <View style={styles.tileM}>
//           <Text>{this.props.perC}</Text>
//           <Text>{this.props.netC}</Text>
//         </View>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    width: "100%",
    alignItems: "center",
  },
  tileM: {
    width: "25%",
    alignItems: "flex-end",
  },
  tileMi: {
    width: "22%",
  },
  tileMr: {
    width: "50%",
  },
  ui: {
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: "row",
    height: 90,
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default SecTile;
