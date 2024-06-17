import { handleResponse } from "@/session-helper";
import Vue from "vue";

export const pythonService = {
  detector,
  view,
  getAddress,
  detections,
  getCameras,
  createCamera,
  calibrateCamera,
  updateCamera,
  getNewFrame,
  getClassesDetect,
  getAllDetections
};

function detector(body, weight) {
  const requestOptions = {};
  let formData = new FormData();
  formData.append("file", body, body.name);
  formData.append("weight", weight);
  return Vue.http
    .post(
      `${process.env.VUE_APP_DETECT_URL}/file-upload`,
      formData,
      requestOptions
    )
    .then(handleResponse)
    .catch(handleResponse);
}

function view(path, img) {
  return Vue.http
    .get(`${process.env.VUE_APP_DETECT_URL}/${path}/${img}`)
    .then(handleResponse)
    .catch(handleResponse);
}

function getAddress(coordinates) {
  return Vue.http
    .get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lng}`
    )
    .then(handleResponse)
    .catch(handleResponse);
}

function detections() {
  return Vue.http
    .get(`${process.env.VUE_APP_DETECT_URL}/detections/`)
    .then(handleResponse)
    .catch(handleResponse);
}

function getCameras() {
  return Vue.http
    .get(`${process.env.VUE_APP_HEFESTO_API}/captures/`)
    .then(handleResponse)
    .catch(handleResponse);
}

function createCamera(body) {
  return Vue.http
    .post(`${process.env.VUE_APP_HEFESTO_API}/captures/`, body)
    .then(handleResponse)
    .catch(handleResponse);
}

function updateCamera(id, body) {
  return Vue.http
    .put(`${process.env.VUE_APP_HEFESTO_API}/captures/${id}`, body)
    .then(handleResponse)
    .catch(handleResponse);
}

function calibrateCamera(id_camera, body) {
  return Vue.http
    .put(
      `${process.env.VUE_APP_HEFESTO_API}/camera_calibration/${id_camera}`,
      body
    )
    .then(handleResponse)
    .catch(handleResponse);
}

function getNewFrame(id_camera) {
  return Vue.http
    .get(`${process.env.VUE_APP_HEFESTO_API}/camera_calibration/${id_camera}`)
    .then(handleResponse)
    .catch(handleResponse);
}

function getClassesDetect() {
  return Vue.http
    .get(`${process.env.VUE_APP_HEFESTO_API}/labels/`)
    .then(handleResponse)
    .catch(handleResponse);
}

function getAllDetections({ capture_id, limit, offset }) {
  return Vue.http
    .get(
      `${process.env.VUE_APP_HEFESTO_API}/detections/?offset=${offset}&limit=${limit}&capture_id=${capture_id}`
    )
    .then(handleResponse)
    .catch(handleResponse);
}
