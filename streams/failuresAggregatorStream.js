var through = require("through2");
var _ = require("underscore");

var failures = {
    other: {
        jiraIssueKey: null,
        jiraIssueStatus: null,
        jiraIssueSummary: null,
        builds: []
    }
};

function transform(build, encoding, callback) {
    console.log("Aggregating " + build.jobName + " build " + build.number);

    if (!_.isString(build.jiraIssueKey)) {
        failures.other.builds.push(build);
    } else if (_.keys(failures).indexOf(build.jiraIssueKey) >= 0) {
        failures[build.jiraIssueKey].builds.push(build);
    } else {
        failures[build.jiraIssueKey] = {
            jiraIssueKey: build.jiraIssueKey,
            jiraIssueStatus: build.jiraIssueStatus,
            jiraIssueSummary: build.jiraIssueSummary,
            jiraIssuePriority: build.jiraIssuePriority,
            builds: [build]
        };
    }

    return callback();
}

function flush(callback) {
    this.push(failures);
    callback();
}

module.exports = through.obj(transform, flush);
