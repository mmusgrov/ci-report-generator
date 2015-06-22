var Readable = require("stream").Readable;
var util = require("util");
var q = require("q");
var _ = require("underscore");

function JenkinsBuildsStream(options) {
    Readable.call(this, options);
    this._jenkins = require("jenkins")(options.baseUrl);
    this._jobNames = options.jobNames;
    this._loadingInitiated = false;

    var self = this;

    this._loadBuilds = function() {
        var promises = [];

        _.each(self._jobNames, function(jobName) {
            promises.push(self._loadBuildsForAJob(jobName));
        });

        return q.allSettled(promises)
            .then(function() {
                self.push(null);
            })
            .catch(function(error) {
                console.error(error);
                self.push(null);
            });
    }

    this._loadBuildsForAJob = function(jobName) {
        var deferred = q.defer();

        self._jenkins.job.get(jobName, function(error, data) {
            if (error) {
                return deferred.reject(new Error(error));
            }

            self.push(JSON.stringify(data.builds));
            return deferred.resolve();
        });

        return deferred.promise;
    }
}

util.inherits(JenkinsBuildsStream, Readable);

JenkinsBuildsStream.prototype._read = function() {
    if (!this._loadingInitiated) {
        this._loadingInitiated = true;
        this._loadBuilds();
    }
}

module.exports = JenkinsBuildsStream;
