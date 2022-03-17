import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* getLeaderboard() {
  let response = yield axios.get('/api/leaderboard');
  yield put({
    type: 'SET_LEADERBOARD',
    payload: response.data,
  })
}

function* leaderboardSaga() {
  yield takeLatest('GET_LEADERBOARD', getLeaderboard);
}

export default leaderboardSaga;