let request = require('request');
const cheerio = require('cheerio');

module.exports = {


    friendlyName: 'Get printer balance',


    description: 'Performs authorization against datacenter backend and fetches printer balance',


    inputs: {
        username: {
            type: 'string',
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.',
            required: true
        },
        password: {
            type: 'string',
            example: 'password1234',
            description: 'Password for datacenter login at HTWG Konstanz.',
            required: true
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Balance data',
            outputDescription: 'Balance data returned from the datacenter backend.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch data',
            outputDescription: 'Fetching the printer balance was not possible.'
        },
        loginFailed: {
            outputFriendlyName: 'Failed to login',
            outputDescription: 'Failed to login with provided credentials.'
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
