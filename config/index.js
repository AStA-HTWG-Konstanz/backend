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
      }

  }
};

module.exports = function (mode) {
    return config[mode || process.argv[2] || 'dev'];
};
