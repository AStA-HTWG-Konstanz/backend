module.exports = async function (req, res, proceed) {
  const InfluxService = require("../services/influxService");
  let settings = require("../../config/custom");
  let influxService = new InfluxService(settings.custom.influxDB);
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    influxService.logResponseTime(duration, req.path).catch(err => {
      console.error(err);
    });
  });
  proceed();
};
