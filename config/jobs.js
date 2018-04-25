
module.exports.jobs = {

  // Where are jobs files
  "jobsDirectory": "api/jobs",

  // agenda configuration.
  // for more details about configuration,
  // check https://github.com/rschmukler/agenda
  "db": {
    "address"    : "@localhost:3306/jobs",
    "collection" : "agendaJobs"
  },
  "name": "process name",
  "processEvery": "10 Minutes",
  "maxConcurrency": 20,
  "defaultConcurrency": 5,
  "defaultLockLifetime": 10000
};
