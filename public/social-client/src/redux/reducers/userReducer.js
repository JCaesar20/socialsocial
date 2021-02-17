import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  FOLLOW_USER,
  UNFOLLOW_USER,
  FOLLOW_THEME,
  UNFOLLOW_THEME
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER: {
      return {
        authenticated: true,
        loading: false,
        credentials: { ...action.payload.credentials },
        likes: [ ...action.payload.likes ],
        notifications: [...action.payload.notifications]
      };
    }
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.userHandle,
            screamID: action.payload.like.screamID,
          },
        ],
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.screamID !== action.payload.like.screamID
        ),
      };
      case DELETE_SCREAM:
        return {
          ...state,
          likes: state.likes.filter(
            (like) => like.screamID !== action.payload._id
          ),
        };
      case MARK_NOTIFICATIONS_READ:
        state.notifications.forEach(not => not.read = true)
        return {
          ...state
        }
        
      case FOLLOW_USER: 
        return{
        ...state,
        credentials: { ...action.payload },
      }
      
      case UNFOLLOW_USER: 
        return{
        ...state,
        credentials: { ...action.payload },
      }

    default:
      return state;
  }
  
}
