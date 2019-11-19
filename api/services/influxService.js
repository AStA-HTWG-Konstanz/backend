const InfluxDB = require('influx').InfluxDB;

class InfluxService {
  constructor(config) {
    this.config = config;
    this.influx = new InfluxDB({
      host: this.config.connection.host,
      port: this.config.connection.port
    });
  }

  async createDatabases() {
    return new Promise(resolve => {
      this.influx.getDatabaseNames().then(names => {
        if (this.config.databases.length > 0) {
          for (let i = 0; i < this.config.databases.length; i++) {
            if (!names.includes(this.config.databases[i])) {
              this.influx.createDatabase(this.config.databases[i]).catch(err => {
                console.error(err);
                process.exit(-1);
              });
            }
          }
        }
        resolve();
      })
    });
  }

  async logResponseTime(duration, path) {
    return new Promise(resolve => {
      this.influx.writePoints([
        {
          measurement: 'response_times',
          tags: {host: process.env.NODE_NAME},
          fields: {duration, path}
        }], {
        database: "response_times"
      }).then(() => {
        resolve();
      }).catch(err => {
        console.error(err);
        resolve();
      });
    });
  }
}

module.exports = InfluxService;
