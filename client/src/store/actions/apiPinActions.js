import { RSAA } from "redux-api-middleware";
import BASE_URL from "./apiConfig.js";

export const GET_ALL_PINS_REQUEST = "GET_ALL_PINS_REQUEST";
export const GET_ALL_PINS_SUCCESS = "GET_ALL_PINS_SUCCESS";
export const GET_ALL_PINS_FAILURE = "GET_ALL_PINS_FAILURE";
export const GET_PIN_BY_ID_REQUEST = "GET_PIN_BY_ID_REQUEST";
export const GET_PIN_BY_ID_SUCCESS = "GET_PIN_BY_ID_SUCCESS";
export const GET_PIN_BY_ID_FAILURE = "GET_PIN_BY_ID_FAILURE";
export const GET_USER_PINS_REQUEST = "GET_USER_PINS_REQUEST";
export const GET_USER_PINS_SUCCESS = "GET_USER_PINS_SUCCESS";
export const GET_USER_PINS_FAILURE = "GET_USER_PINS_FAILURE";
export const ADD_PIN_REQUEST = "ADD_PIN_REQUEST";
export const ADD_PIN_SUCCESS = "ADD_PIN_SUCCESS";
export const ADD_PIN_FAILURE = "ADD_PIN_FAILURE";
export const REMOVE_PIN_REQUEST = "REMOVE_PIN_REQUEST";
export const REMOVE_PIN_SUCCESS = "REMOVE_PIN_SUCCESS";
export const REMOVE_PIN_FAILURE = "REMOVE_PIN_FAILURE";
export const UPDATE_LIKES_REQUEST = "UPDATE_LIKES_REQUEST";
export const UPDATE_LIKES_SUCCESS = "UPDATE_LIKES_SUCCESS";
export const UPDATE_LIKES_FAILURE = "UPDATE_LIKES_FAILURE";
export const UPDATE_PINLIST_SUCCESS = "UPDATE_PINLIST_SUCCESS";

export function updatePinlist(pins) {
  return {
    type: UPDATE_PINLIST_SUCCESS,
    payload: { pins }
  };
}

/*
* Function: getAllPins -- return all pins
* This action dispatches additional actions as it executes:
*   GET_ALL_PINS_REQUEST:
*     Initiates spinner
*   GET_ALL_PINS_SUCCESS:
*     If pins array successfully retrieved, hides spinner
*   GET_ALL_PINS_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getAllPins() {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/pin/allpins`,
      method: "GET",
      types: [
        GET_ALL_PINS_REQUEST,
        GET_ALL_PINS_SUCCESS,
        {
          type: GET_ALL_PINS_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: getPinById -- get a single pin by pinId
* @param {string} pinId
* This action dispatches additional actions as it executes:
*   GET_PIN_BY_ID_REQUEST:
*     Initiates a spinner on the home page.
*   GET_PIN_BY_ID_SUCCESS:
*     If pin successfully retrieved, hides spinner
*   GET_PIN_BY_ID_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getPinById(pinId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/pin/${pinId}`,
      method: "GET",
      types: [
        GET_PIN_BY_ID_REQUEST,
        GET_PIN_BY_ID_SUCCESS,
        {
          type: GET_PIN_BY_ID_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: getUserPins -- get all pins for a given user
* @param {string} userId
* This action dispatches additional actions as it executes:
*   GET_USER_PINS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_USER_PINS_SUCCESS:
*     If array of pins successfully retrieved, hides spinner
*   GET_USER_PINS_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getUserPins(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/pin/userpins/${userId}`,
      method: "GET",
      types: [
        GET_USER_PINS_REQUEST,
        GET_USER_PINS_SUCCESS,
        {
          type: GET_USER_PINS_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: addpin -- add new pin to db
* @param {object} body (pin object)
*  --  @param {string} title,
*  --  @param {string} imageUrl,
*  --  @param {string} siteUrl,
*  --  @param {string} description,
*  --  @param {string} userId,
*  --  @param {string} userName,
*  --  @param {string} userAvatarUrl
* This action dispatches additional actions as it executes:
*   ADD_PIN_REQUEST:
*     Initiates a spinner on the home page.
*   ADD_PIN_SUCCESS:
*     If pin successfully retrieved, hides spinner
*   ADD_PIN_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function addPin(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/pin/new`,
      method: "PUT",
      types: [
        ADD_PIN_REQUEST,
        ADD_PIN_SUCCESS,
        {
          type: ADD_PIN_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}

/*
* Function: removePin -- remove pin from database
* @param {string} pinId
* This action dispatches additional actions as it executes:
*   REMOVE_PIN_REQUEST:
*     Initiates a spinner on the home page.
*   REMOVE_PIN_SUCCESS:
*     If pin successfully removed, hides spinner
*   REMOVE_PIN_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function removePin(token, pinId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/pin/remove/${pinId}`,
      method: "PUT",
      types: [
        REMOVE_PIN_REQUEST,
        REMOVE_PIN_SUCCESS,
        {
          type: REMOVE_PIN_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

/*
* Function: updateLikes -- updates likes (array of userIds) on a pin
* @param {string} userId
* @param {string} title
* This action dispatches additional actions as it executes:
*   UPDATE_PIN_OWNER_REQUEST:
*     Initiates a spinner on the home page.
*   UPDATE_PIN_OWNER_SUCCESS:
*     If pin successfully retrieved, hides spinner
*   UPDATE_PIN_OWNER_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function updateLikes(token, pinId, action) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/pin/${pinId}/likes?action=${action}`,
      method: "PUT",
      types: [
        UPDATE_LIKES_REQUEST,
        UPDATE_LIKES_SUCCESS,
        {
          type: UPDATE_LIKES_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}