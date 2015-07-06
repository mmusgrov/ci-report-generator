var _ = require("underscore");
var swig  = require('swig');
var fs = require("fs");
var q = require("q");

var reportPath = __dirname + "/../dist/report.html";
var templatePath = __dirname + "/../template/report.swig";
var weekMilliseconds = 604800000;

function writeToFile(path, content) {
    var deferred = q.defer();

    fs.writeFile(path, content, function(error) {
        if(error) {
            throw new Error(error);
        }

        deferred.resolve();
    });

    return deferred.promise;
}

function addLastFailureInfo(failures) {
    for (var i = 0; i < failures.length; i++) {
        var lastFailedBuild = _.max(failures[i].builds, "timestamp");
        failures[i].lastFailureDate = new Date(lastFailedBuild.timestamp);
        failures[i].isNew = lastFailedBuild.timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return failures;
}

function addBuildInfo(builds) {
    for (var i = 0; i < builds.length; i++) {
        builds[i].date = new Date(builds[i].timestamp);
        builds[i].isNew = builds[i].timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return builds;
}

function documentedFailuresFilter(failure) {
    return failure.jiraIssueKey !== null;
}

module.exports = function(failuresMap) {
    var deferred = q.defer();
    var failuresArray = _.values(failuresMap);
    var documentedFailures = _.sortBy(addLastFailureInfo(_.filter(failuresArray, documentedFailuresFilter)), "lastFailureDate").reverse();
    var undocumentedBuilds = _.sortBy(addBuildInfo(failuresMap.other.builds), "timestamp").reverse();

    var options = {
        currentDate: new Date(),
        documentedFailures: documentedFailures,
        undocumentedBuilds: undocumentedBuilds
    };

    swig.renderFile(templatePath, options, function(error, content) {
        if (error) {
            throw new Error(error);
        }

        writeToFile(reportPath, content)
            .then(function() {
                deferred.resolve();
            });
    });

    return deferred.promise;
};