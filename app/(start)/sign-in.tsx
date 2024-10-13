import { View, Text, SafeAreaView, StyleSheet, Platform, StatusBar, Button, Pressable } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import * as Linking from 'expo-linking'
import { Link, router, Stack, useNavigation } from 'expo-router'
import { EventListenerCallback, EventMapCore } from '@react-navigation/native'
import * as ExpoWebBrowser from "expo-web-browser"
import { ThemedText } from '@/components/ThemedText'
import { useRouteInfo } from 'expo-router/build/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, signinChallengeCreate } from '@/stores/signin-challenge-store'
import { SigninChallengeState } from '@/stores/states/signin-challenge'
import generateRandomBytes from 'react-native-pkce-challenge/src/generate-random-bytes'
// import * as PkceUtils from 'react-native-pkce-challenge/src/utils'
import { generateChallenge, verifyChallenge, base64UrlEncode } from 'react-native-pkce-challenge/src/utils'

export default function SignIn() {
  const defaultScheme = 'sis.parentportal.mobile'
  const packageName = 'com.fxd.parentportal'
  const url = Linking.useURL()
  const webBaseUrl = 'https://1lhrxh58-44335.asse.devtunnels.ms'

  console.log(`sigin run `,)

  // Navigation
  const navigation = useNavigation();
  useEffect(() => {
    const gobackHandle = (e: any) => {
      e.preventDefault();
      console.log('onback', e.data.action);
      if (e?.data?.action?.payload?.params?.screen === 'index') {
        // console.log('onback index', e.data.action);
        navigation.dispatch(e.data.action);
      }
    }
    console.log(`navigation.addListener beforeRemove`,)
    navigation.addListener('beforeRemove', gobackHandle);
    // return navigation.removeListener('beforeRemove', gobackHandle)
  }, [navigation]);

  // const deepLinkHandle = (event: Linking.EventType) => {
  //     // console.log('sigin deepLinkHandle event', event)
  //     if (event?.url) {
  //         const { hostname, path, queryParams } = Linking.parse(event.url);
  //         console.log('sigin deeplink handle url', hostname, path, queryParams)
  //     }
  // }
  // Linking.addEventListener('url', deepLinkHandle)

  useEffect(() => {
    // if (url) {
    //     const { hostname, path, queryParams } = Linking.parse(url);
    //     console.log('sigin deeplink parse url', hostname, path, queryParams)
    // }
    console.log('SignIn deeplinking url: ', url ?? 'null')
  }, [url])

  const GoHome = () => {
    // router.replace(`sis.parentportal.mobile://(tabs)/index`)
    router.push({ pathname: `${defaultScheme}://`, params: { msg: 'Hello from sigin' } })
  }

  const siginCodeChallenge = useSelector((state: RootState) => { state.codeChallenge })
  const siginCodeVerifier = useSelector((state: RootState) => state.codeVerifier)
  const dispatchSiginChallenge = useDispatch()

  useEffect(() => {
    console.log('Signin page siginCodeChallenge: ', siginCodeChallenge)
    console.log('Signin page siginCodeVerifier: ', siginCodeVerifier)
  }, [siginCodeChallenge])

  const goToSignin = async () => {
    const codeVerifier = base64UrlEncode(generateRandomBytes().slice(0,32))
    const codeChallenge = generateChallenge(codeVerifier)
    dispatchSiginChallenge(signinChallengeCreate({codeVerifier, codeChallenge}))
    // dispatchSiginChallenge(signinChallengeCreate(newChallenge))
    // dispatchSiginChallenge(signinChallengeCreate({codeChallenge: '0Z3ch4ekmDJRtBKg1D-7qRboYiDS9XTTbFs42iIZ8rQ', codeVerifier: 'obJ8q4iniNbuSa4bkWVrqinakiJ9VZRJeyJnJ7wCXIQQTJNPXZEu7dJvxON8eKxRYtbUP9CKR3jWXT6'}))

    const oauthCallbackUrl = `${defaultScheme}://oauth-callback`
    // scope=openid offline_access StudentInfoSystem
    const queryParams = [
      `client_id=Sis_ParentPortal_Mobile&response_type=code`,
      `scope=${encodeURIComponent('openid offline_access StudentInfoSystem')}`,
      `code_challenge=${encodeURIComponent(codeChallenge)}`,
      `redirect_uri=${encodeURIComponent(oauthCallbackUrl)}`,
      `code_challenge_method=S256`
    ].join('&')
    const loginUrl = `${webBaseUrl}/connect/authorize?${queryParams}`
    // const browserRedirectUrl = Linking.createURL('')
    // console.log('loginUrl: ', loginUrl)
    // console.log('browserRedirectUrl: ', browserRedirectUrl)
    ExpoWebBrowser.openAuthSessionAsync(loginUrl, oauthCallbackUrl)
    // console.log('ExpoWebBrowser.openAuthSessionAsync res', res)
  }

  const urlObj = useRouteInfo()
  useEffect(() => {
    console.log('SignIn useRouteInfo()', urlObj)
  }, [urlObj])
  return (
    <>
      <SafeAreaView style={{ ...styles.AndroidSafeArea, backgroundColor: "#CCF7E1" }}>
        <View style={styles.Body}>
          <ThemedText>{url}</ThemedText>
          <View style={{ gap: 5, marginTop: 15 }}>
            <Button onPress={GoHome} title='Go to Home screen'></Button>
            <Button title='Go to login' onPress={goToSignin} />
            <ThemedText>{siginCodeChallenge ?? 'code challenge null'}</ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  Body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});
