const config = {
  dev: {
      runtime: {
          port: 3000,
      },
      database: {
          host: "localhost",
          port: 5432,
          user: process.env.DBUSER,
          pass: process.env.DBPASS
      },
      seezeit: {
          canteen: {
              deEndpoint: "http://www.max-manager.de/daten-extern/seezeit/xml/mensa_htwg/speiseplan.xml",
              enEndpoint: "http://www.max-manager.de/daten-extern/seezeit/xml/mensa_htwg/speiseplan_en.xml"
          }
      },
      ldap: {
          url: "ldaps://ldap.htwg-konstanz.de:636",
          searchBase: "ou=users,dc=fh-konstanz,dc=de",
          searchFilter: "uid={{username}}",
          rejectUnauthorized: false
      }

  }
};

module.exports = function (mode) {
    return config[mode || process.argv[2] || 'dev'];
};
