import { StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import * as ExpoLinking from 'expo-linking'
import { ThemedText } from '@/components/ThemedText'
import { useRouter } from 'expo-router'
import { useRouteInfo } from 'expo-router/build/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, signinChallengeClear } from '@/stores/signin-challenge-store'
import { SigninChallengeState } from '@/stores/states/signin-challenge'
import axios from 'axios'


export default function OAuthCallback() {
  const defaultScheme = 'sis.parentportal.mobile'
  const packageName = 'com.fxd.parentportal'
  const webBaseUrl = 'https://1lhrxh58-44335.asse.devtunnels.ms'
  const oauthCallbackUrl = `${defaultScheme}://oauth-callback`

  const siginCodeVerifier = useSelector((state: RootState) => state.codeVerifier)
  const siginCodeChallenge = useSelector((state: RootState) => { state.codeChallenge })
  const dispatchSiginChallenge = useDispatch()
  const urlObj = useRouteInfo()
  useEffect(() => {
    (async () => {
      const callbackParams = urlObj.params
      console.log('OAuthCallback useRouteInfo()', urlObj,  callbackParams['code'])
      const requestUrl = `${webBaseUrl}/connect/token`

      let requestDt = {
        code: callbackParams['code'],
        redirect_uri: oauthCallbackUrl,
        code_verifier: siginCodeVerifier,
        client_id: 'Sis_ParentPortal_Mobile',
        grant_type: 'authorization_code'
      }
      let form = new FormData()
      form.append('code', callbackParams['code'] as string ?? '')
      form.append('redirect_uri', oauthCallbackUrl ?? '')
      form.append('code_verifier', siginCodeVerifier ?? '')
      form.append('client_id', 'Sis_ParentPortal_Mobile')
      form.append('grant_type', 'authorization_code')

      let options: RequestInit = {
        body: form,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            // "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
      };
      try {
        let res = await axios.request({
          url: requestUrl,
          data: form,
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // "Content-Type": "multipart/form-data",
              "Accept": "application/json"
          }
        })
        console.log('fetch token result', res)
      } catch (error) {
        console.log(`OAuthCallback fetch(requestUrl, options) error `, error)
      }
      dispatchSiginChallenge(signinChallengeClear())
      console.log('OAuthCallback cleared challenge', siginCodeVerifier ?? 'null')
    })()
  }, [urlObj])

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
      <ThemedText>{ JSON.stringify(urlObj?.params, null, 2) ?? 'null'}</ThemedText>
      <ThemedText>{siginCodeVerifier ?? 'codeVerifier null'}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({})
