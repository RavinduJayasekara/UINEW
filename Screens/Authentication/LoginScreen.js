import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import * as authActions from "../../store/action/auth";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";

const LoginScreen = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const dispatch = useDispatch();

  const submitHandler = (uN, pW) => {
    if (!validUserName || !validPassword) {
      Alert.alert("Fill the username or Password", "", [
        {
          text: "Okay",
          style: "cancel",
          onPress: () => {
            userNameHandler("");
            passwordHandler("");
          },
        },
      ]);
      return;
    }
    dispatch(authActions.signIn(uN, pW));
  };

  const userNameHandler = (text) => {
    if (text.trim().length === 0) {
      setValidUserName(false);
    } else {
      setValidUserName(true);
    }
    setUsername(text.trim());
  };

  const passwordHandler = (text) => {
    if (text.trim().length === 0) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
    setPassword(text.trim());
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 5}
      behavior={Platform.OS === "android" ? "" : "padding"}
      style={styles.container}
    >
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        // style={{ flex: 1 }}
      >
        <ImageBackground
          style={styles.imageBack}
          source={{
            uri:
              "https://static.asiawebdirect.com/m/kl/portals/srilanka-hotels-ws/homepage/colombo/nightlife/pagePropertiesImage/colombo-night.jpg.jpg",
          }}
        >
          <Card style={styles.cardComp}>
            <View style={styles.imageComp}>
              <Image
                source={{
                  uri:
                    "https://lh3.googleusercontent.com/QAi5gJKa0UCZ5Vk7FYSrLiuZZvrLbcA-oCeudsBI17uArR9caSntBuldCszopubOqwGy",
                }}
                style={styles.image}
                resizeMode="contain"
              />
              <View>
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={userNameHandler}
                  style={styles.textInput}
                  ke
                />
                {!validUserName && <Text>Please fill the username</Text>}
              </View>
              <View>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={passwordHandler}
                  secureTextEntry
                  style={styles.textInput}
                />
                {!validPassword && <Text>Please fill the password</Text>}
              </View>
            </View>
            <Button
              title="Sign in"
              onPress={submitHandler.bind(this, username, password)}
            />
          </Card>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  cardComp: {
    width: "80%",
    padding: 20,
    backgroundColor: "#ffffff00",
  },
  imageBack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
    marginVertical: 10,
  },
  image: {
    height: 150,
    width: "95%",
  },
  imageComp: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
});

export default LoginScreen;
