let request = require('request');
var fs = require('fs');

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
        console.log('Hallo')
        request.get({
            url: sails.config.custom.datacenter.qisserver.loginPage,
            agentOptions: {
                ca: fs.readFileSync('./assets/certificates/chain.pem')
            }
        }, function (err, result, bodyData) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            let setCookieData = result.headers['set-cookie'];
            let cookieData = setCookieData[0].split(' ')[0];
            let headers = {
                'cookie': cookieData
            };
            
            request.post({
                url: sails.config.custom.datacenter.qisserver.loginEndpoint.replace("{sessionID}", cookieData.split("=")[1]),
                headers: headers,
                form: {username: inputs.username, password: inputs.password}
            }, function (err, httpResponse, body) {
                if (err) {
                    sails.log.error(err);
                    return exits.errorOccured();
                }

                if(httpResponse.statusCode !== 302) {
                    return exits.loginFailed();
                }

                let setCookie = httpResponse.headers['set-cookie'];

                if (typeof setCookie === "undefined") {
                    return exits.loginFailed();
                }

                let cookie = setCookie[0].split(' ')[0];
                return exits.success({cookieLogin: cookie, cookieRequest: cookieData});
            });
        });
    }
};
