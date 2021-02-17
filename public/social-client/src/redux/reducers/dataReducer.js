import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
  POST_THEME,
  EDIT_SCREAM,
  DELETE_COMMENT,
  EDIT_COMMENT,
  FOLLOW_THEME,
  UNFOLLOW_THEME,
  FOLLOW_USER,
  UNFOLLOW_USER,
  DELETE_THEME

} from "../types";

const initialState = {
  screams: [],
  scream: {},
  theme: {},
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

      case EDIT_SCREAM: {
        console.log(actions.payload)
        let index = state.screams.findIndex(
          (scream) => scream._id === actions.payload._id
        );
        state.screams[index]= actions.payload;
        return {
          ...state,
        };  
      }

      case DELETE_SCREAM:
      let index2 = state.screams.findIndex(
          (scream) => scream._id === actions.payload._id
        );
        state.screams.splice(index2,1)
        return {
          ...state,
        };

      case POST_SCREAM:
    
      /* 
       state.screams.push(actions.payload)  */
       return{
        ...state,
        screams: [
            actions.payload,
            ...state.screams
        ]
    }

       case POST_THEME:
         console.log(actions.payload)
         return{
        ...state,
        theme: {
          ...actions.payload
        }}

      case DELETE_THEME:  
      return{
        ...state,
        theme: {},
        screams: {}
      }

      case DELETE_COMMENT:
      let comments = state.scream.comments.filter(
          (comment) => comment._id !== actions.payload._id
        );
        let indexx2 = state.screams.findIndex(
          (scream) => scream._id === actions.payload.screamID
        );
        const commentCount = --state.screams[indexx2].commentCount;

        let scream = state.screams[indexx2]
        scream.commentCount = commentCount;
        state.screams[indexx2] = {...scream};

        console.log(state.screams[indexx2])
        return {
          ...state,
          scream : {
            ...state.scream,
            commentCount,
            comments
          }
        };

        case EDIT_COMMENT: 
        console.log( actions.payload)


        let indexx4 = state.scream.comments.findIndex(
          (comment) => comment._id === actions.payload._id
        )

        state.scream.comments[indexx4] = actions.payload;

        return {
          ...state,
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
