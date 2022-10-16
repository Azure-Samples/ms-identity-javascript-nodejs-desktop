/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = require('axios');

/**
 * Makes an Authorization 'Bearer' request with the given accessToken to the given endpoint.
 * @param endpoint 
 * @param accessToken 
 */
async function callEndpointWithToken(endpoint, accessToken) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('Request made at: ' + new Date().toString());
    try {
        const response = await axios.get(endpoint, options);
        return response.data;
    } catch (error){
        if(error.response === 404){
            console.log(error.response.data);
        }else {
            console.log(error)
        }
        return null;
    }
}

module.exports = {
    callEndpointWithToken: callEndpointWithToken,
};
