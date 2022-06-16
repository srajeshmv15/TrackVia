/*
 How would you call this API in JavaScript / Node?
 A: Via node lambda
 What objects or services would you create to expedite iterative development?
 A: using axios library 
 What considerations come to mind for security and scalability of your solution?
 A: a) Security: I prefer custom authorizer integration with API Gateway
    b) Scalability: Lambda function no need scalability  

 Flow: API gateway (x-api-key) -> custom authorizer lambda (to verify token is valid) -> lambda execution   
 */     

const axios = require("axios");

exports.handler = async(event) => {

    if (event.httpMethod != "GET" || !event.queryStringParameters || !event.queryStringParameters.apiKey || event.queryStringParameters.apiKey == '' ||
        !event.queryStringParameters.function || event.queryStringParameters.function == '' || !event.queryStringParameters.from_currency || event.queryStringParameters.from_currency ||
        !event.queryStringParameters.to_currency || event.queryStringParameters.to_currency == '') {
            const error = {
                message: 'Invalid request missing mandatory parameters',
                details: [
                    {
                        location: '/query',
                        hint: 'Pass valid values'
                    }
                ]
            }
            return {
                statusCode: 400,
                body: error
            }
    } else {
            axios.get('https://www.alphavantage.co/query', { params: event.queryStringParameters })
            .then(response => {
                return {
                    statusCode: 200,
                    body: response
                }
            })
            .catch(err => {
                const error = {
                    message: 'Internal API Failure',
                    details: [
                        {
                            location: '/query',
                            hint: 'Please retry',
                            error: err.response.data
                        }
                    ]
                }
                return  {
                    statusCode: err.response.status,
                    body: error
                }
            });
    }

}

