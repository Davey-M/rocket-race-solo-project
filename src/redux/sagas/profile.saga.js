import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

function* getProfile(action) {
  console.log('in get profile');
  let response = yield axios.get(`/api/profile/${action.payload}`);
  console.log(response);

  if (response.data.length > 0) {
    yield put({
      type: 'SET_PROFILE',
      payload: response.data[0],
    });
  }
}

function* profileSaga() {
  yield takeLatest('GET_PROFILE', getProfile);
}

export default profileSaga;