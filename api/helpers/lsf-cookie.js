let request = require('request');

module.exports = {


    friendlyName: 'Get LSF cookie',


    description: 'Fetches login cookie from LSF and returns it',


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
            outputDescription: 'Cookie returned from LSF.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch data',
            outputDescription: 'Fetching the event data was not possible.'
        },
        loginFailed: {
            outputFriendlyName: 'Failed to login',
            outputDescription: 'Failed to login with provided cookie.'
        },
    },


    fn: async function (inputs, exits) {
        request.get({
            url: sails.config.custom.datacenter.lsf.loginPage,
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
                url: sails.config.custom.datacenter.lsf.loginEndpoint,
                headers: headers,
                form: {asdf: inputs.username, fdsa: inputs.password}
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
