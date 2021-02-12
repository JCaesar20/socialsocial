import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  loading: false,
};

export default function (state = initialState, actions) {
  switch (actions.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: actions.payload,
        loading: false,
      };
    case SET_SCREAM:
      return{
        ...state,
        scream: {
          ...actions.payload
        }
      }
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream._id === actions.payload.like.screamID
      );
      state.screams[index] = actions.payload.scream;
      if(state.scream._id === actions.payload.scream._id){
        state.scream = actions.payload.scream
      }
      return {
        ...state,
      };  
      case DELETE_SCREAM:
      let index2 = state.screams.findIndex(
          (scream) => scream._id === actions.payload._id
        );
        state.screams.splice(index2,1)
        return {
          ...state,
        };
      case POST_SCREAM:
       state.screams.push(actions.payload) 
        return {
          ...state
        };
      case SUBMIT_COMMENT:
        console.log(state.scream.comments)
        console.log(actions.payload)
        return{
          ...state, 
          scream: {
            ...state.scream,
            comments: [actions.payload,...state.scream.comments]
          }
        }
    default:
      return state;
  }
}
