import React from 'react'

const errorPage = () => {
    return(
        <div style={{textAlign:'center', alignItems:'center', position: 'absolute', top:'50%', left: '50%', transform:'translate(-50%,-50%)'}}>
            <h1 style={{color:'white', fontSize:'90px', marginBottom:'0px'}}>
                OOooPPpsSs!
            </h1>
            <h1 style={{color:'white'}}>
                You are in a wrong route!
            </h1>
            <h2 style={{color:'white'}}>
                Please head back to Home.
            </h2>
        </div>
    )
}

export default errorPage