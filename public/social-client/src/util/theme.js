export default {
  palette: {
    primary: {
      light: '#892cdc',
      main: '#350b40',
      dark: '#892cdc',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#f8a1d1',
      dark: '#892cdc',
      contrastText: '#fff'
    }
    },
  typography: {
    useNextVariants: true,
    backgroundColor: '#fff'
  },
  form: {
    textAlign: 'center',
    color: '#fff !important'
  },
  image: {
    margin: '20px auto 20px auto',
    width: '150px'
  },
  pageTitle: {
    margin: '10px auto 10px auto',
    color: '#fff'
  },
  textField: {
    margin: '10px auto 10px auto',
    color: '#fff',
    borderColor: '#fff',
    
  
    '& .MuiInputBase-root': {
      color: 'white',
    },
    
    '& .MuiInputBase-input-273': {
          color: '#fff'
          
        }, 
        '& .MuiInput-underline-254:before' : {
          borderColor: '#fff'
        },
        '& .MuiInput-underline-254:hover' : {
          borderBottom: '1px solid #fff !important'
        },
      '& .MuiFormLabel-root-243':{
          color: '#fff'
        } 
  },
  button: {
    marginTop: 20,
    position: 'relative'
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10
  },
  progress: {
    position: 'absolute'
  },
  invisibleSeparator: {
    border: 'none',
    margin: 4
  },
  visibleSeparator: {
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    marginBottom: 20
  },
  paper: {
    padding: 10
  },
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%'
      }
    },
    '& .profile-image': {
      width: 200,
      height: 200,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%'
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle'
      },
      '& a': {
        color: '#00bcd4'
      }
    },
    '& hr': {
      border: 'none',
      margin: '0 0 10px 0'
    },
    '& svg.button': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    }
  },
  invisibleSeparater: {
    border:'none',
    margin: 4
},
visibleSeparator: {
  width: '100%',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  marginBottom: 20
}
,
/* overrides: {
  MuiInputLabel: { // Name of the component ⚛️ / style sheet
    root: { // Name of the rule
      color: "white",
      "&$focused": { // increase the specificity for the pseudo class
        color: "#892cdc"
      }
    }
  }}
};   */ }
