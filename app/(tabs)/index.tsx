import { Image, StyleSheet, Platform, SafeAreaView, Button, View, StatusBar, Text, Pressable } from 'react-native';
import * as Linking from 'expo-linking'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useEffect, useState } from 'react';
import pkceChallenge from 'react-native-pkce-challenge';
import * as WebBrowser from "expo-web-browser"
import { Link, router } from 'expo-router';
import { Provider } from 'react-redux';
import { signinChallengeStore } from '@/stores/signin-challenge-store';

export default function HomeScreen() {
  // const [webRes, setWebRes] = useState<WebBrowser.WebBrowserAuthSessionResult | null>(null)
  const defaultScheme = 'sis.parentportal.mobile'
  const packageName = 'com.fxd.parentportal'

  const deepLinkUrl = Linking.useURL()
  // if (deepLinkUrl !== null && deepLinkUrl !== undefined) {
  //   console.log('deepLinkUrl: !== null', deepLinkUrl)
  // }
  // console.log('deepLinkUrl: ', deepLinkUrl)
  // const goToLogin = () => {
  //   const url = 'https://localhost:44335/connect/authorize'
  //   await Linking.canOpenURL(url) && Linking.openURL(url)
  // }
  // const url = `https://localhost:44335/connect/authorize&client-id=Sis_ParentPortal_Mobile&response_type=code&code_challenge=${challenge.codeChallenge}`
  // const goToLogin = useCallback(async () => {
  //   if ( await Linking.canOpenURL(url)) {
  //     // let res = await Linking.openURL(url)
  //     const res = await WebBrowser.openAuthSessionAsync(
  //       url ?? "",
  //       Linking.createURL('')
  //     )
  //     // setWebRes(res)
  //     console.log('WebBrowser.openAuthSessionAsync res: ', res)
  //   }
  // }, [url])
  // console.log('tabs Linking.createURL() ', Linking.createURL(''))
  return (
    <>
      <SafeAreaView style={{...styles.AndroidSafeArea, backgroundColor: "#CCF7E1"}}>
        <View style={styles.straigth}>
          <Link href={{ pathname: 'sis.parentportal.mobile://sign-in/', params: {msg: 'hello from tabs'} }} replace style={{marginTop: 16}}>
            {/* <Pressable> */}
                <Text>Go to Start</Text>
            {/* </Pressable> */}
          </Link>
          {/* <Button onPress={() => router.replace("sis.parentportal.mobile://start/?")} title='Go to screen'></Button> */}
          {/* <Text>{webRes ? JSON.stringify(webRes) : ""}</Text> */}
          <Text>{deepLinkUrl}</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  straigth: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});
