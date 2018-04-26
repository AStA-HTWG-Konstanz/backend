let request = require('request');

module.exports = {


    friendlyName: 'Get LSF data',


    description: 'Fetches ical data from LSF and returns the result',


    inputs: {
        cookie: {
            type: 'string',
            description: 'Cookie for LSF login at HTWG Konstanz.',
            required: true
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Event data',
            outputDescription: 'Event data returned from LSF.'
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
        request.post({
            url: sails.config.custom.datacenter.printerBalance.loginEndpoint,
            form: {username: inputs.username, password: inputs.password, login: "Anmelden"}
        }, function (err, httpResponse, body) {
            if (err) {
                sails.log(err);
                return exits.errorOccured();
            }

            let setCookie = httpResponse.headers['set-cookie'];

            if (typeof setCookie === "undefined") {
                return exits.loginFailed();
            }

            let cookie = setCookie[0].split(' ')[0] + ' ' + setCookie[1].split(' ')[0];
            let headers = {
                'cookie': cookie
            };

            request.get({
                url: sails.config.custom.datacenter.printerBalance.balanceEndpoint,
                headers: headers
            }, function (err, res, body) {
                if (err) {
                    sails.log(err);
                    return exits.errorOccured();
                }

                const $ = cheerio.load(body);

                let balance = $('body > table > tbody > tr:nth-child(3) > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > b').text();

                return exits.success({balance: balance.replace(" ", "")});
            });
        });
    }
};
