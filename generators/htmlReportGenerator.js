var json2html = require('node-json2html');
var _ = require("underscore");
var fs = require("fs");
var q = require("q");

var weekMilliseconds = 604800000;
var distPath = __dirname + "/../dist";
var reportPath = distPath + "/report.html";

function dateToString(date) {
    return date.getDate() + "/" + (1 + date.getMonth()) + "/" + date.getFullYear();
}

function isClosed(status) {
    return status.toLowerCase() === "closed" || status.toLowerCase() === "resolved";
}

function getColour(failure) {
    if (isClosed(failure.jiraIssueStatus)) {
        return "#DF0101";
    } else if (failure.timestamp > (new Date().getTime() - weekMilliseconds)) {
        return "#F7FE2E";
    }

    return "#FFFFFF";
}

function getFailedBuildsTags(builds) {
    var tags = [];

    for (var i = 0; i < builds.length; i++) {
        var tag = {
            "tag": "a",
            "href": builds[i].url,
            "html": builds[i].jobName + " " + builds[i].number
        };

        tags.push(tag);
    }

    return tags;
}

function createDir(path) {
    var deferred = q.defer();

    fs.mkdir(path, function(error) {
        if (error) {
            throw new Error(error);
        }

        deferred.resolve();
    });

    return deferred.promise;
}

function writeToFile(path, content) {
    var deferred = q.defer();

    fs.writeFile(path, content, function(error) {
        if(error) {
            throw new Error(error);
        }

        deferred.resolve("Report was generated");
    });

    return deferred.promise;
}

module.exports = function(failures) {
    var structure = {"tag": "table", "border": 1, "children": [
        {"tag": "tr", "children": [
            {"tag": "th", "width": "50px", "html": "JIRA"},
            {"tag": "th", "width": "100px", "html": "Summary"},
            {"tag": "th", "width": "100px", "html": "Status"},
            {"tag": "th", "width": "100px", "html": "Failures Count"},
            {"tag": "th", "width": "100px", "html": "Last Failure Date"},
            {"tag": "th", "width": "100px", "html": "Failed Builds"}
        ]}
    ]};

    var values = _.values(failures);
    for (var i = 0; i < values.length; i++) {
        if (values[i].jiraIssueKey !== null) {
            var latestFailedBuild = _.max(values[i].builds, "timestamp");
            var jiraIssueUrl = "https://issues.jboss.org/browse/" + values[i].jiraIssueKey;

            var row = {
                "tag": "tr",
                "children": [
                    {"tag": "td", "children": [
                        {"tag": "a", "href": jiraIssueUrl, "html": values[i].jiraIssueKey}
                    ]},
                    {"tag": "td", "html": values[i].jiraIssueSummary},
                    {"tag": "td", "html": values[i].jiraIssueStatus},
                    {"tag": "td", "html": values[i].builds.length},
                    {"tag": "td", "bgcolor": getColour(latestFailedBuild), "html": dateToString(new Date(latestFailedBuild.timestamp))},
                    {"tag": "td", class: "failedBuilds", "children": getFailedBuildsTags(values[i].builds)}
                ]
            };

            structure.children.push(row);
        }
    }

    for (var ii = 0; ii < failures.other.builds.length; ii++)  {
        var row2 = {
            "tag": "tr",
            "children": [
                {"tag": "td", "html": "-"},
                {"tag": "td", "html": "-"},
                {"tag": "td", "html": "-"},
                {"tag": "td", "html": "-"},
                {"tag": "td", "html": dateToString(new Date(failures.other.builds[ii].timestamp))},
                {"tag": "td", "children": [
                    {"tag": "a", "href": failures.other.builds[ii].url,
                        "html": failures.other.builds[ii].jobName + " " + failures.other.builds[ii].number}
                ]}
            ]
        };

        structure.children.push(row2);
    }

    var html = json2html.transform({}, structure);

    createDir(distPath)
        .then(writeToFile(reportPath, html))
        .then(function(message) {
            console.log(message);
        });
};
