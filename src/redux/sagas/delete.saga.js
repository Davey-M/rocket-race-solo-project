import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* deleteRace(action) {
  yield axios.delete(`/api/profile/race/${action.payload.delete}`);
  yield put({
    type: 'GET_PROFILE',
    payload: action.payload.user
  })
}

function* deleteSaga() {
  yield takeLatest('DELETE_RACE', deleteRace);
}

export default deleteSaga;