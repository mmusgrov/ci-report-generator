var through = require("through2");
var JiraClient = require('jira-connector');

module.exports = function(host) {
    var jira = new JiraClient({host: host});

    return through.obj(function(build, encoding, callback) {
        // console.log("Getting JIRA info of " + build.jobName + " build " + build.number);

        if (!build.jiraIssueKey) {
            build.jiraIssueKey = null;
            build.jiraIssueStatus = null;
            build.jiraIssueSummary = null;
            build.jiraIssuePriority = null;

            return callback(null, build);
        }

        // TODO keeps getting the same issue, if multiple issues were on the same build
        jira.issue.getIssue({issueKey: build.jiraIssueKey}, function(error, issue) {
            if (error) {
                console.error("Got an error while getting issue info: " + error);
                callback(error);
            }

            build.jiraIssueStatus = issue.fields.status.name;
            build.jiraIssueSummary = issue.fields.summary;
            build.jiraIssuePriority = issue.fields.priority.name;

            callback(null, build);
        });
    });
};
