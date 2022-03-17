import { takeLatest, all, put } from 'redux-saga/effects';
import axios from 'axios';

function* getProfile(action) {
  let response = yield axios.get(`/api/profile/${action.payload}`)
  yield put({
    type: 'SET_PROFILE',
    payload: response.data,
  })
}

function* profileSaga() {
  yield takeLatest('getProfile', getProfile);
}

export default profileSaga;