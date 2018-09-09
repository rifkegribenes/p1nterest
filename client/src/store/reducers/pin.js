import update from "immutability-helper";

import { LOGOUT } from "../actions";
import {
  GET_ALL_PINS_REQUEST,
  GET_ALL_PINS_SUCCESS,
  GET_ALL_PINS_FAILURE,
  GET_PIN_BY_ID_REQUEST,
  GET_PIN_BY_ID_SUCCESS,
  GET_PIN_BY_ID_FAILURE,
  GET_USER_PINS_REQUEST,
  GET_USER_PINS_SUCCESS,
  GET_USER_PINS_FAILURE,
  SEARCH_IMAGE_REQUEST,
  SEARCH_IMAGE_SUCCESS,
  SEARCH_IMAGE_FAILURE,
  ADD_PIN_REQUEST,
  ADD_PIN_SUCCESS,
  ADD_PIN_FAILURE,
  UPDATE_LIKES_REQUEST,
  UPDATE_LIKES_SUCCESS,
  UPDATE_LIKES_FAILURE,
  UPDATE_PINLIST_SUCCESS,
  SET_SELECTED_PIN,
  HANDLE_INPUT,
  HANDLE_ADDPIN_OPEN,
  HANDLE_ADDPIN_CLOSE,
  CLEAR_FORM,
  SET_FLICKR
} from "../actions/apiPinActions";

const INITIAL_STATE = {
  loading: false,
  pins: [],
  imageSearchResults: [],
  currentPin: {
    _id: "",
    title: "",
    imageUrl: "",
    siteUrl: "",
    description: "",
    userId: "",
    userName: "",
    userAvatarUrl: "",
    createdAt: "",
    likes: [] // array of userIds
  },
  form: {
    keyword: "",
    imageUrl: "",
    siteUrl: "",
    title: "",
    description: "",
    dialogOpen: false,
    selectedPin: {},
    flickr: false
  },
  loggedInUserPins: [],
  error: null
};

function pin(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE;

    case SET_SELECTED_PIN:
      return update(state, {
        form: {
          selectedPin: { $set: { ...action.payload.selectedPin } }
        }
      });

    case SET_FLICKR:
      console.log(`set flickr: ${action.payload}`);
      return update(state, {
        form: {
          flickr: { $set: action.payload }
        }
      });

    case HANDLE_INPUT:
      return update(state, {
        form: {
          [action.payload.name]: { $set: action.payload.value }
        }
      });

    case HANDLE_ADDPIN_OPEN:
      return update(state, {
        form: {
          dialogOpen: { $set: true },
          selectedPin: { $set: { ...action.payload.selectedPin } }
        }
      });

    case HANDLE_ADDPIN_CLOSE:
      return update(state, {
        form: {
          dialogOpen: { $set: false },
          selectedPin: { $set: {} },
          flickr: { $set: false }
        }
      });

    case CLEAR_FORM:
      return update(state, {
        form: {
          keyword: { $set: "" },
          imageUrl: { $set: "" },
          siteUrl: { $set: "" },
          title: { $set: "" },
          description: { $set: "" },
          dialogOpen: { $set: false },
          selectedPin: { $set: {} },
          flickr: { $set: false }
        }
      });

    case GET_ALL_PINS_REQUEST:
    case GET_PIN_BY_ID_REQUEST:
    case GET_USER_PINS_REQUEST:
    case SEARCH_IMAGE_REQUEST:
    case ADD_PIN_REQUEST:
    case UPDATE_LIKES_REQUEST:
      return update(state, {
        loading: { $set: true },
        error: { $set: null }
      });

    case GET_ALL_PINS_SUCCESS:
    case UPDATE_PINLIST_SUCCESS:
      return update(state, {
        loading: { $set: false },
        pins: { $set: action.payload.pins },
        error: { $set: null }
      });

    case GET_USER_PINS_SUCCESS:
      return update(state, {
        loading: { $set: false },
        loggedInUserPins: { $set: action.payload.pins },
        error: { $set: null }
      });

    case SEARCH_IMAGE_SUCCESS:
      return update(state, {
        loading: { $set: false },
        imageSearchResults: { $set: action.payload.images },
        error: { $set: null }
      });

    case GET_PIN_BY_ID_SUCCESS:
    case ADD_PIN_SUCCESS:
    case UPDATE_LIKES_SUCCESS:
      return update(state, {
        loading: { $set: false },
        currentPin: { $set: action.payload.pin },
        error: { $set: null }
      });

    case GET_ALL_PINS_FAILURE:
    case GET_PIN_BY_ID_FAILURE:
    case GET_USER_PINS_FAILURE:
    case SEARCH_IMAGE_FAILURE:
    case ADD_PIN_FAILURE:
    case UPDATE_LIKES_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return update(state, {
        loading: { $set: false },
        error: { $set: error }
      });

    default:
      return state;
  }
}

export default pin;
