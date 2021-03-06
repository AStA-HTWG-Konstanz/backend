/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */
let scheduler = require('node-schedule');
let lsfService = require('../api/services/LsfService');
const fs = require('fs');
const path = require('path');
let CanteenService = require('../api/services/canteenService');


module.exports.bootstrap = async function (done) {

    // By convention, this is a good place to set up fake data during development.
    //
    // For example:
    // ```
    // // Set up fake development data (or if we already have some, avast)
    // if (await User.count() > 0) {
    //   return done();
    // }
    //
    // await User.createEach([
    //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
    //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
    //   // etc.
    // ]);
    // ```
    if (await EndlichtHours.count() === 0) {
        await  EndlichtHours.createEach([
            {weekday: "Monday"},
            {weekday: "Tuesday"},
            {weekday: "Wednesday"},
            {weekday: "Thursday"},
            {weekday: "Friday"}
        ]);
    }

    let canteenJob = scheduler.scheduleJob('0 22 * * 7', function () {
        sails.log.info('Canteen database cleanup');
        CanteenDate.destroy({}).then(function () {
            CanteenMeal.destroy({}).then(function () {
                sails.log.info('Canteen import started');
                CanteenService.importMenus(function (err, result) {
                    if (err) {
                        sails.log.error(err);
                    }
                    sails.log.info('Canteen import finished');
                });
            }).catch(function (err) {
                sails.log.error(err);
            });
        }).catch(function (err) {
            sails.log.error(err);
        });
    });

    let lsfJob = scheduler.scheduleJob('30 0 * * *', function () {
        sails.log.info("LSF database cleanup");
        LsfLectures.destroy({}).then(function () {
            LsfLectureDates.destroy({}).then(function () {
                sails.log.info("LSF import started");
                lsfService.importLectures(function (err, result) {
                    sails.log.info("LSF import finished");
                    // Clean directory
                    fs.readdir(sails.config.appPath + '/.tmp/ical', (err, files) => {
                        if (err) {
                            sails.log.error(err);
                        } else {
                            for (const file of files) {
                                fs.unlink(path.join(sails.config.appPath + '/.tmp/ical', file), err => {
                                    if (err) {
                                        sails.log.error(err);
                                    }
                                });
                            }
                        }
                    });
                });
            }).catch(function (err) {
                sails.log.error(err);
            });
        }).catch(function (err) {
            sails.log.error(err);
        });
    });
    return done();

};
