import { put, take, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* getLeaderboard() {
  let response = yield axios.get('/api/leaderboard');
  yield put({
    type: 'SET_LEADERBOARD',
    payload: response.data,
  })
}

function* getRace(action) {
  let response = yield axios.get(`/api/leaderboard/${action.payload}`);
  yield put({
    type: 'SET_RACE',
    payload: response.data,
  })
}

function* leaderboardSaga() {
  yield takeLatest('GET_LEADERBOARD', getLeaderboard);
  yield takeLatest('GET_RACE', getRace);
}

export default leaderboardSaga;