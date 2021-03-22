import React, { useState } from "react";
import { DrawerLayoutAndroid, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import WatchListScreen from "../Screens/Market/WatchListScreen";
import MarketDepth from "../Screens/Quote/MarketDepth";
import Favourites from "../Screens/Market/Favourites";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import LoginScreen from "../Screens/Authentication/LoginScreen";
import Quote from "../Screens/Quote/Quote";
import Colors from "../constants/Colors";
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  useTheme,
  Drawer,
  DrawerItem,
  IndexPath,
  TabBar,
  Tab,
  BottomNavigation,
  BottomNavigationTab,
} from "@ui-kitten/components";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TopStocks from "../Screens/Market/TopStocks";
import MarketInfo from "../Screens/Market/MarketInfo";
import IndicesSummary from "../Screens/Market/Indices";
import Portfolio from "../Screens/Portfolio/Portfolio";
import AccountSummary from "../Screens/Portfolio/AccountSummary";
import PortfolioSummary from "../Screens/Portfolio/Portfolio";
import OrderList from "../Screens/Portfolio/OrderList";
import { useDispatch } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import BuySell from "../Screens/Quote/BuySell";

const changeScreenOrientationToPortrait = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
};

const CommonHeader = {
  header: ({ scene, previous, navigation }) => {
    const theme = useTheme();
    const { options } = scene.descriptor;
    const renderDrawerIcon = () => (
      <Icon name="menu" fill={theme["color-warning-500"]} style={styles.icon} />
    );
    const renderBackAction = () => (
      <TopNavigationAction
        onPress={() => navigation.toggleDrawer()}
        icon={renderDrawerIcon}
      />
    );

    const renderSearchIcon = () => (
      <Icon
        name="search"
        fill={theme["color-warning-500"]}
        style={styles.icon}
      />
    );

    const renderSearchAction = () => (
      <TopNavigationAction
        onPress={() => console.log(scene.route)}
        icon={renderSearchIcon}
      />
    );

    return (
      <TopNavigation
        title={scene.route.params.hName}
        accessoryLeft={renderBackAction}
        accessoryRight={renderSearchAction}
        style={(options.headerStyle = { minHeight: 80 })}
      />
    );
  },
};

const CommonHeaderBack = {
  header: ({ scene, previous, navigation }) => {
    const theme = useTheme();
    const { options } = scene.descriptor;
    const renderGoBackIcon = () => (
      <Icon
        name="arrow-ios-back"
        fill={theme["color-warning-500"]}
        style={styles.icon}
      />
    );
    const renderBackAction = () => (
      <TopNavigationAction
        onPress={() => navigation.popToTop()}
        icon={renderGoBackIcon}
      />
    );

    const renderSearchIcon = () => (
      <Icon
        name="search"
        fill={theme["color-warning-500"]}
        style={styles.icon}
      />
    );

    const renderSearchAction = () => (
      <TopNavigationAction
        onPress={() => console.log(scene.route)}
        icon={renderSearchIcon}
      />
    );

    return (
      <TopNavigation
        title={scene.route.params.hName}
        accessoryLeft={renderBackAction}
        accessoryRight={renderSearchAction}
        style={(options.headerStyle = { minHeight: 80 })}
      />
    );
  },
};

const WatchStack = createStackNavigator();

const WatchStackNav = () => (
  <WatchStack.Navigator headerMode="none">
    <WatchStack.Screen name={"Favourites"} component={Favourites} />
  </WatchStack.Navigator>
);

const MarketTabBar = ({ navigation, state }) => {
  const theme = useTheme();

  const MarketIcon = () => (
    <Icon name={"info"} fill={theme["color-info-500"]} style={styles.icon} />
  );
  const TopStockIcon = () => (
    <Icon
      name={"bar-chart"}
      fill={theme["color-info-500"]}
      style={styles.icon}
    />
  );
  const IndexIcon = () => (
    <Icon name={"hash"} fill={theme["color-info-500"]} style={styles.icon} />
  );
  return (
    <TabBar
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <Tab icon={MarketIcon} title="Market" />
      <Tab icon={TopStockIcon} title="Top Stocks" />
      <Tab icon={IndexIcon} title="Indices" />
    </TabBar>
  );
};

const MarketTab = createMaterialTopTabNavigator();

const MarketTabNav = () => {
  return (
    <MarketTab.Navigator tabBar={(props) => <MarketTabBar {...props} />}>
      <MarketTab.Screen name={"MarketInfo"} component={MarketInfo} />
      <MarketTab.Screen name={"TopStocks"} component={TopStocks} />
      <MarketTab.Screen name={"IndicesSummary"} component={IndicesSummary} />
    </MarketTab.Navigator>
  );
};

const WatchListTabBar = ({ navigation, state }) => {
  const theme = useTheme();

  const CSEIcon = () => (
    <Icon
      name={"activity"}
      fill={theme["color-info-500"]}
      style={styles.icon}
    />
  );
  const FavIcon = () => (
    <Icon name={"star"} fill={theme["color-info-500"]} style={styles.icon} />
  );

  return (
    <TabBar
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <Tab icon={CSEIcon} title="CSE" />
      <Tab icon={FavIcon} title="Favourites" />
    </TabBar>
  );
};

const QuoteTabBar = ({ navigation, state }) => {
  const theme = useTheme();

  const CSEIcon = () => (
    <Icon
      name={"activity"}
      fill={theme["color-info-500"]}
      style={styles.icon}
    />
  );
  const FavIcon = () => (
    <Icon name={"star"} fill={theme["color-info-500"]} style={styles.icon} />
  );

  return (
    <TabBar
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <Tab icon={CSEIcon} title="Quote" />
      <Tab icon={FavIcon} title="Market Depth" />
    </TabBar>
  );
};

const PortfolioTabBar = ({ navigation, state }) => {
  const theme = useTheme();

  const CSEIcon = () => (
    <Icon
      name={"activity"}
      fill={theme["color-info-500"]}
      style={styles.icon}
    />
  );

  const OrderIcon = () => (
    <Icon
      name={"shopping-cart"}
      fill={theme["color-info-500"]}
      style={styles.icon}
    />
  );

  const FavIcon = () => (
    <Icon name={"star"} fill={theme["color-info-500"]} style={styles.icon} />
  );

  return (
    <TabBar
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <Tab icon={CSEIcon} title="Portfolio" />
      <Tab icon={OrderIcon} title="Order List" />
      <Tab icon={FavIcon} title="Account Summary" />
    </TabBar>
  );
};

const WatchListTab = createMaterialTopTabNavigator();

const WatchListTabNavigator = (props) => {
  return (
    <WatchListTab.Navigator
      screenOptions={CommonHeader}
      tabBar={(props) => <WatchListTabBar {...props} />}
    >
      <WatchListTab.Screen
        name={"WatchListScreen"}
        component={WatchListScreen}
      />
      <WatchListTab.Screen name={"WatchStackNav"} component={WatchStackNav} />
    </WatchListTab.Navigator>
  );
};

const PortfolioTab = createMaterialTopTabNavigator();

const PortfolioTabNavigator = (props) => {
  return (
    <PortfolioTab.Navigator tabBar={(props) => <PortfolioTabBar {...props} />}>
      <PortfolioTab.Screen
        name={"PortfolioSummary"}
        component={PortfolioSummary}
      />
      <PortfolioTab.Screen name={"OrderList"} component={OrderList} />
      <PortfolioTab.Screen name={"AccountSummary"} component={AccountSummary} />
    </PortfolioTab.Navigator>
  );
};

const QuoteS = createStackNavigator();

const QuoteSNav = (props) => {
  return (
    <QuoteS.Navigator headerMode="none">
      <QuoteS.Screen
        name={"Quote"}
        component={Quote}
        initialParams={{
          security: props.route.params.props.security,
          companyname: props.route.params.props.companyname,
          tradeprice: props.route.params.props.tradeprice,
          perchange: props.route.params.props.perchange,
          netchange: props.route.params.props.netchange,
          bidprice: props.route.params.props.bidprice,
          askprice: props.route.params.props.askprice,
          bidqty: props.route.params.props.bidqty,
          askqty: props.route.params.props.askqty,
          vwap: props.route.params.props.vwap,
          lowpx: props.route.params.props.lowpx,
          highpx: props.route.params.props.highpx,
          totvolume: props.route.params.props.totvolume,
          tottrades: props.route.params.props.tottrades,
          totturnover: props.route.params.props.totturnover,
          lasttradedtime: props.route.params.props.lasttradedtime,
        }}
      />
    </QuoteS.Navigator>
  );
};

const QuoteTab = createMaterialTopTabNavigator();

const QuoteTabNavigator = (props) => {
  return (
    <QuoteTab.Navigator
      screenOptions={CommonHeader}
      tabBar={(props) => <QuoteTabBar {...props} />}
    >
      <QuoteTab.Screen
        name={"QuoteSNav"}
        component={QuoteSNav}
        initialParams={{
          props: props.route.params.params,
        }}
      />
      <QuoteTab.Screen
        name={"MarketDepth"}
        component={MarketDepth}
        initialParams={{
          props: props.route.params.params,
        }}
      />
    </QuoteTab.Navigator>
  );
};

const WStack = createStackNavigator();

const WStackNav = () => (
  <WStack.Navigator>
    <WStack.Screen
      initialParams={{ hName: "Watch List" }}
      name={"WatchListTabNavigator"}
      component={WatchListTabNavigator}
      options={CommonHeader}
    />
    <WatchStack.Screen
      name={"QuoteTabNavigator"}
      initialParams={{ hName: "Watch List" }}
      options={CommonHeaderBack}
      component={QuoteTabNavigator}
    />
    <WatchStack.Screen
      name={"BuySell"}
      component={BuySell}
      options={CommonHeaderBack}
      initialParams={{ hName: "Trades" }}
    />
  </WStack.Navigator>
);

const MStack = createStackNavigator();

const MStackNav = () => (
  <MStack.Navigator screenOptions={CommonHeader}>
    <MStack.Screen
      initialParams={{ hName: "Market" }}
      name={"MarketTabNav"}
      component={MarketTabNav}
    />
  </MStack.Navigator>
);

const PStack = createStackNavigator();

const PStackNav = () => (
  <PStack.Navigator screenOptions={CommonHeader}>
    <PStack.Screen
      initialParams={{ hName: "Portfolio" }}
      name={"PortfolioTabNavigator"}
      component={PortfolioTabNavigator}
    />
  </PStack.Navigator>
);

// const UIDrawer = ({ navigation, state }) => {
//   const theme = useTheme();
//   const MarketIcon = () => (
//     <Icon name={"info"} fill={theme["color-info-500"]} style={styles.icon} />
//   );

//   const LikeIcon = () => (
//     <Icon name={"star"} fill={theme["color-info-500"]} style={styles.icon} />
//   );

//   const [selectedIndex, setSelectedIndex] = useState(null);
//   return (
//     <Drawer
//       selectedIndex={new IndexPath(state.index)}
//       onSelect={(index) => {
//         navigation.navigate(state.routeNames[index.row]);
//         setSelectedIndex(index);
//       }}
//     >
//       <DrawerItem title={"Watch List"} />
//       <DrawerItem title={"Market"} />
//       <DrawerItem title={"Portfolio"} />
//     </Drawer>
//   );
// };

const UIDrawer = ({ navigation, state }) => {
  const theme = useTheme();
  const MarketIcon = () => (
    <Icon name={"info"} fill={theme["color-info-500"]} style={styles.icon} />
  );

  const LikeIcon = () => (
    <Icon name={"star"} fill={theme["color-info-500"]} style={styles.icon} />
  );

  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    <Drawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => {
        navigation.navigate(state.routeNames[index.row]);
        setSelectedIndex(index);
      }}
    >
      <DrawerItem title={"Market Info"} />
      <DrawerItem title={"Portfolio Summary"} />
      <DrawerItem title={"Selected Watch"} />
      {/* <DrawerItem title={"Order List"} />
      <DrawerItem title={"Top Stocks"} />
      <DrawerItem title={"Account Summary"} />
      <DrawerItem title={"Charts"} />
      <DrawerItem title={"Settings"} /> */}
    </Drawer>
  );
};

const BottomTabBar = ({ navigation, state }) => {
  const theme = useTheme();
  const MarketIcon = () => (
    <Icon name={"info"} fill={theme["color-info-500"]} style={styles.icon} />
  );

  const PortfolioIcon = () => (
    <Icon
      name={"briefcase"}
      fill={theme["color-info-500"]}
      style={styles.icon}
    />
  );

  const WatchIcon = () => (
    <Icon name={"eye"} fill={theme["color-info-500"]} style={styles.icon} />
  );
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => {
        navigation.navigate(state.routeNames[index]);
        if (state.routeNames[index] === "MarketInfoStackNavigator") {
          navigation.jumpTo("MarketInfo");
        } else if (
          state.routeNames[index] === "PortfolioSummaryStackNavigator"
        ) {
          navigation.jumpTo("PortfolioSummary");
        } else if (state.routeNames[index] === "SelectWatchStackNavigator") {
          navigation.jumpTo("SelectedWatch");
        }
      }}
      appearance="noIndicator"
    >
      <BottomNavigationTab title="Market" icon={MarketIcon} />
      <BottomNavigationTab title="Portfolio" icon={PortfolioIcon} />
      <BottomNavigationTab title="Selected Watch" icon={WatchIcon} />
    </BottomNavigation>
  );
};

const DefaultTab = createBottomTabNavigator();

const DefaultTabNavigator = (props) => {
  return (
    <DefaultTab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      initialRouteName={props.route.params.routeScreen}
      tabBarOptions={{ activeTintColor: Colors.primary }}
    >
      <DefaultTab.Screen
        name="MarketInfoStackNavigator"
        component={MStackNav}
      />
      <DefaultTab.Screen
        name="PortfolioSummaryStackNavigator"
        component={PStackNav}
      />
      <DefaultTab.Screen
        name="SelectWatchStackNavigator"
        component={WStackNav}
      />
    </DefaultTab.Navigator>
  );
};

const DefaultDrawer = createDrawerNavigator();

const DefaultDrawerNavigator = () => {
  const dispatch = useDispatch();

  return (
    <DefaultDrawer.Navigator
      drawerContent={(props) => <UIDrawer {...props} />}
      initialRouteName="SelectedWatch"
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}
    >
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "MarketInfoStackNavigator" }}
        name="MarketInfo"
        component={DefaultTabNavigator}
        options={{
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      {/* <DefaultDrawer.Screen
        initialParams={{ routeScreen: "OrderListStackNavigator" }}
        name="OrderList"
        component={DefaultTabNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <FontAwesome5
                name="chart-line"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Order List",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      /> */}
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "PortfolioSummaryStackNavigator" }}
        name="PortfolioSummary"
        component={DefaultTabNavigator}
        options={{
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "SelectWatchStackNavigator" }}
        name="SelectedWatch"
        component={DefaultTabNavigator}
        options={{
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      {/* <DefaultDrawer.Screen
        name="TopStocksStackNavigator"
        component={TopStocksStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <AntDesign name="totop" size={23} color={drawerInfo.color} />
            );
          },
          drawerLabel: "Top Stocks",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="AccountSummaryStackNavigator"
        component={AccountSummaryStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons name="ios-wallet" size={23} color={drawerInfo.color} />
            );
          },
          drawerLabel: "Account Summary",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="ChartStackNavigator"
        component={ChartStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <FontAwesome5
                name="chart-area"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Charts",
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="SettingsStackNavigator"
        component={SettingsStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons
                name="ios-settings"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Settings",
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="SignoutScreen"
        component={SignoutScreen}
        listeners={{ focus: () => dispatch(authActions.signOut()) }}
        options={{ drawerLabel: "Sign Out" }}
      /> */}
    </DefaultDrawer.Navigator>
  );
};

const LoginStack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name={"LoginScreen"}
        component={LoginScreen}
        options={{
          headerTitle: "Login",
          headerTintColor: "white",
          headerStyle: { backgroundColor: Colors.primary },
        }}
      />
    </LoginStack.Navigator>
  );
};

const AtradNavigator = () => {
  const userToken = useSelector((state) => state.auth.userToken);

  return (
    <NavigationContainer>
      {userToken == null ? <LoginStackNavigator /> : <DefaultDrawerNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({ icon: { height: 20, width: 20 } });

export default AtradNavigator;
