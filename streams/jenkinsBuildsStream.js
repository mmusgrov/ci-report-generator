var through = require("through2");

module.exports = through.obj(function(job, encoding, callback) {

    var jenkins = require("jenkins")(job.baseUrl);
    var self = this;

    jenkins.job.get(job.name, function(error, data) {
        // console.log("Getting builds of " + job.name);

        if (error) {
            return callback(error);
        }

        for (var i = 0; i < data.builds.length; i++) {
            data.builds[i].jobName = job.name;
            data.builds[i].baseUrl = job.baseUrl;
            self.push(data.builds[i]);
        }

        callback();
    });
});
