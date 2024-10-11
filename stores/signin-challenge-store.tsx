import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SigninChallengeState } from './states/signin-challenge'

const initialState: SigninChallengeState = {
  codeChallenge: null, codeVerifier: null,
}

const signinSlice = createSlice({
  name: 'SiginChallenge',
  initialState,
  reducers: {
    signinChallengeCreate: (state, action: PayloadAction<SigninChallengeState>) => {
      if (!state.codeVerifier) {
        state.codeChallenge = action.payload.codeChallenge
        state.codeVerifier = action.payload.codeVerifier
      }
    },
    signinChallengeClear: (state) => {
      // console.log(`signinChallengeClear state.codeVerifier `, state.codeVerifier)
      if (state.codeVerifier) {
        state.codeChallenge = null
        state.codeVerifier = null
      }
    },
  }
})

export const { signinChallengeCreate, signinChallengeClear } = signinSlice.actions

export const signinChallengeStore = configureStore({ reducer: signinSlice.reducer })

// // Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof signinChallengeStore.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof signinChallengeStore.dispatch
