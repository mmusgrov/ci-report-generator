var through = require("through2");
var JiraClient = require('jira-connector');

module.exports = function(host) {
    var jira = new JiraClient({host: host});

    return through.obj(function(build, encoding, callback) {
        // console.log("Getting JIRA info of " + build.jobName + " build " + build.number);

        if (!build.jiraIssueKey) {
            build.jiraIssueUrl = null;
            build.jiraIssueKey = null;
            build.jiraIssueStatus = null;
            build.jiraIssueSummary = null;
            build.jiraIssuePriority = null;

            return callback(null, build);
        }

        jira.issue.getIssue({issueKey: build.jiraIssueKey}, function(error, issue) {
            if (error) {
                console.error("Got an error while getting issue info: " + error);
                callback(error);
            }

            build.jiraIssueUrl = "https://" + host + "/browse/" + build.jiraIssueKey;
            build.jiraIssueStatus = issue.fields.status.name;
            build.jiraIssueSummary = issue.fields.summary;
            build.jiraIssuePriority = issue.fields.priority.name;

            callback(null, build);
        });
    });
};
