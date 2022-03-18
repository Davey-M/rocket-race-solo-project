import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* saveEdit(action) {
  yield axios.put('/edit', action.payload);
}

function* getEdit() {
  let response = yield axios.get('/edit')
  yield put({
    type: 'SET_EDIT',
    payload: response.data[0],
  })
}

function* editSaga() {
  yield takeLatest('SAVE_EDIT', saveEdit);
  yield takeLatest('GET_EDIT', getEdit);
}