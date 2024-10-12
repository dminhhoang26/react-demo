import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import * as ExpoLinking from 'expo-linking'
import { ThemedText } from '@/components/ThemedText'
import { useRouter } from 'expo-router'
import { useRouteInfo } from 'expo-router/build/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, signinChallengeClear } from '@/stores/signin-challenge-store'
import { SigninChallengeState } from '@/stores/states/signin-challenge'
import axios from 'axios'
import * as ExpoWebBrowser from "expo-web-browser"
import { ThemedView } from '@/components/ThemedView'

export default function OAuthCallback() {
  const defaultScheme = 'sis.parentportal.mobile'
  const packageName = 'com.fxd.parentportal'
  const webBaseUrl = 'https://1lhrxh58-44335.asse.devtunnels.ms'
  const docUrl = `${webBaseUrl}//.well-known/openid-configuration`
  const oauthCallbackUrl = `${defaultScheme}://oauth-callback`

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefrestToken] = useState<string | null>(null)

  const siginCodeVerifier = useSelector((state: RootState) => state.codeVerifier)
  const siginCodeChallenge = useSelector((state: RootState) => { state.codeChallenge })
  const dispatchSiginChallenge = useDispatch()
  const urlObj = useRouteInfo()
  useEffect(() => {
    (async () => {
      const callbackParams = urlObj.params
      console.log('OAuthCallback useRouteInfo()', urlObj,  callbackParams['code'])
      if (!callbackParams['code'] || !siginCodeVerifier) return
      const requestUrl = `${webBaseUrl}/connect/token`

      let formBody = [
        `code=` + encodeURIComponent(callbackParams['code'] as string ?? ''),
        `grant_type=authorization_code`,
        `client_id=Sis_ParentPortal_Mobile`,
        `code_verifier=` + encodeURIComponent(siginCodeVerifier ?? ''),
        // `code_challenge=` + encodeURIComponent(siginCodeChallenge ?? ''),
        `code_challenge_method=S256`,
        // `scope=${encodeURIComponent('offline_access')}`,
        `redirect_uri=` + encodeURIComponent(oauthCallbackUrl ?? ''),
      ].join('&')

      // let options: RequestInit = {
      //   body: form,
      //   method: "POST",
      //   headers: {
      //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      //       // "Content-Type": "multipart/form-data",
      //       "Accept": "application/json"
      //   }
      // };
      // let res = await ExpoWebBrowser.openAuthSessionAsync(requestUrl+'?'+formBody)
      // console.log(`OAuthCallback ExpoWebBrowser.openAuthSessionAsync res`, res)
      try {
        let res = await axios.request({
          url: requestUrl,
          data: formBody,
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              // "Content-Type": "multipart/form-data",
              "Accept": "application/json"
          }
        })
        let data = res?.data
        console.log('fetch token result data', JSON.stringify(data, null, 2))
        if (data) {
          setAccessToken(data['access_token'])
          setRefrestToken(data['refresh_token'])

          let check = await axios.request({
            url: webBaseUrl+'/connect/userinfo',
            method: 'get',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
          if (check?.data)
            console.log('connect/userinfo data: ', JSON.stringify(check?.data ?? {}, null, 2))
          else
            console.log(` connect/userinfo res `, check)
        }
      } catch (error) {
        console.log(`OAuthCallback fetch(requestUrl, options) error `, error)
      }
      dispatchSiginChallenge(signinChallengeClear())
      console.log('OAuthCallback cleared challenge', siginCodeVerifier ?? 'null')
    })()
  }, [urlObj])

  return (
    <ThemedView style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8}} >
      <ScrollView>
        <ThemedText>{ JSON.stringify(urlObj?.params, null, 2) ?? 'null'}</ThemedText>
        <ThemedText>{siginCodeVerifier ?? 'codeVerifier null'}</ThemedText>
        <ThemedText style={{marginBottom: 32}}>{accessToken ?? 'accessToken null'}</ThemedText>
        <ThemedText>{refreshToken ?? 'refreshToken null'}</ThemedText>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({})
