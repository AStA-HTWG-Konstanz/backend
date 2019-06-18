let request = require('request');
var fs = require('fs');
var RateLimiter = require('request-rate-limiter');
var limiter = new RateLimiter({
    rate: 10,
    interval: 60,
    backoffCode: 429,
    backoffTime: 10,
    maxWaitingTime: 40
});

module.exports = {


    friendlyName: 'Get qisserver cookie',


    description: 'Fetches login cookie from qisserver and returns it',


    inputs: {
        username: {
            type: 'string',
            required: true,
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.'
        },
        password: {
            type: 'string',
            required: true,
            example: 'password1234',
            description: 'Password for datacenter login at HTWG Konstanz.'
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Cookie data',
            outputDescription: 'Cookie returned from qisserver.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch data',
            outputDescription: 'Fetching the cookie data was not possible.'
        },
        loginFailed: {
            outputFriendlyName: 'Failed to login',
            outputDescription: 'Failed to login with provided credentials.'
        },
    },


    fn: async function (inputs, exits) {

        limiter.request().then(function (backoff) {
            request({
                method: 'GET',
                url: sails.config.custom.datacenter.qisserver.loginPage,
                agentOptions: {
                    ca: fs.readFileSync('./assets/certificates/chain.pem')
                }
            }, function (err, response, body) {
                if (err) {
                    callback(err);
                } else if (response.statusCode === 429) {
                    backoff();
                } else {
                    let setCookieData = response.headers['set-cookie'];
                    let cookieData = setCookieData[0].split(' ')[0];
                    let headers = {
                        'cookie': cookieData
                    };

                    limiter.request().then(function (backoff) {
                        request.post({
                            url: sails.config.custom.datacenter.qisserver.loginEndpoint.replace("{sessionID}", cookieData.split("=")[1]),
                            headers: headers,
                            form: {username: inputs.username, password: inputs.password},
                            agentOptions: {
                                ca: fs.readFileSync('./assets/certificates/chain.pem')
                            }
                        }, function (error, res, bodyData) {
                            if (error) {
                                callback(error);
                            } else if (res.statusCode === 429) {
                                sails.log.info('Too many requests');
                                backoff();
                            } else if (res.statusCode !== 302) {
                                return exits.loginFailed();

                            } else {
                                let setCookie = res.headers['set-cookie'];

                                if (typeof setCookie === "undefined") {
                                    return exits.loginFailed();

                                }

                                let cookie = setCookie[0].split(' ')[0];
                                return exits.success({cookieLogin: cookie, cookieRequest: cookieData});
                            }
                        })
                    }).catch(function (error) {
                        sails.log.error(error);
                        return exits.errorOccured();
                    })
                }
            })
        }).catch(function (err) {
            sails.log.error(err);
            return exits.errorOccured();

        });
    }
};
