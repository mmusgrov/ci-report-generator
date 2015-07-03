var through = require("through2");

module.exports = through.obj(function(build, encoding, callback) {

    // console.log("Extracting JIRA keys from description of " + build.jobName + " build " + build.number);

    if (!build.description) {
        build.jiraIssue = null;
        return callback(null, build);
    }

    var jiraIssues = build.description.match(/[A-Z]+-[0-9]+/g);
    if (jiraIssues === null) {
        return callback();
    }

    for (var i = 0; i < jiraIssues.length; i++) {
        var clone = Object.create(build);
        clone.jiraIssueKey = jiraIssues[i];
        this.push(clone);
    }

    return callback();
});
