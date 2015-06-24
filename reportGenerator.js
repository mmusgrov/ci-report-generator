var _ = require("underscore");
var q = require("q");

module.exports = function(jiraHost) {

    this.jiraHost = jiraHost;

    var generateReport = function(failures) {
        var deferred = q.defer();

        console.log("===== CI Report =====");

        var values = _.values(failures);
        for (var i = 0; i < values.length; i++) {
            if (values[i].jiraIssueKey != null) {
                var latestFailedBuild = _.max(values[i].builds, "timestamp");
                var latestDate = new Date(latestFailedBuild.timestamp);

                console.log(values[i].jiraIssueKey + " failed " + values[i].builds.length + " times");
                console.log("Issue description: "+ values[i].jiraIssueSummary);
                console.log("Issue URL: https://" + this.jiraHost + "/browse/" + values[i].jiraIssueKey);
                console.log("Latest failure at: " + latestDate.getDate() + "/" + (1 + latestDate.getMonth()) + "/" + latestDate.getFullYear());
                console.log("Laitest failed build URL: " + latestFailedBuild.url);
                console.log("-----");
            }
        }

        for (var i = 0; i < failures.other.builds.length; i++)  {
            console.log("Undocumented build: " + failures.other.builds[i].url);
        }

        deferred.resolve();

        return deferred.promise;
    }

    return generateReport;

}
