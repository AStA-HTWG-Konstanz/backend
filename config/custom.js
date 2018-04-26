/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

    /***************************************************************************
     *                                                                          *
     * Any other custom config this Sails app should use during development.    *
     *                                                                          *
     ***************************************************************************/
    ldap: {
        url: 'ldaps://ldap.htwg-konstanz.de:636',
        searchBase: 'ou=users,dc=fh-konstanz,dc=de',
        searchFilter: 'uid={{username}}',
        rejectUnauthorized: false
    },
    seezeit: {
        canteen: {
            deEndpoint: "http://www.max-manager.de/daten-extern/seezeit/xml/mensa_htwg/speiseplan.xml",
            enEndpoint: "http://www.max-manager.de/daten-extern/seezeit/xml/mensa_htwg/speiseplan_en.xml"
        }
    },
    datacenter: {
        printerBalance: {
            loginEndpoint: "https://login.rz.htwg-konstanz.de/index.spy",
            balanceEndpoint: "https://login.rz.htwg-konstanz.de/userprintacc.spy?activeMenu=Druckerkonto"
        },
        lsf: {
            loginEndpoint: "https://lsf.htwg-konstanz.de/qisserver/rds?state=user&type=1&category=auth.login&startpage=portal.vm&breadCrumbSource=portal",
            loginPage: "https://lsf.htwg-konstanz.de/qisserver/rds?state=user&type=0&breadCrumbSource=portal&topitem=functions"
        }
    }
};
