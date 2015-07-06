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

function addLastFailureDates(failures) {
    for (var i = 0; i < failures.length; i++) {
        var lastFailedBuild = _.max(failures[i].builds, "timestamp");
        failures[i].lastFailureDate = new Date(lastFailedBuild.timestamp).toDateString();
        failures[i].isNew = lastFailedBuild.timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return failures;
}

function addDateToBuilds(builds) {
    for (var i = 0; i < builds.length; i++) {
        builds[i].date = new Date(builds[i].timestamp).toDateString();
        builds[i].isNew = builds[i].timestamp > (new Date().getTime() - weekMilliseconds);
    }

    return builds;
}

module.exports = function(failuresMap) {
    var deferred = q.defer();
    var failuresArray = _.values(failuresMap);
    var documentedFailures = _.filter(failuresArray, function(failure) {
        return failure.jiraIssueKey !== null;
    });

    var options = {
        currentDate: new Date().toDateString(),
        documentedFailures: addLastFailureDates(documentedFailures),
        undocumentedBuilds: addDateToBuilds(failuresMap.other.builds)
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