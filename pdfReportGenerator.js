var PDFDocument = require("pdfkit");
var fs = require("fs");
var _ = require("underscore");

function dateToString(date) {
    return date.getDate() + "/" + (1 + date.getMonth()) + "/" + date.getFullYear();
}

module.exports = function(failures) {

    var doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("report.pdf"));

    doc.fontSize(20);
    doc.text("CI Report " + dateToString(new Date()), {align: "center", underline: true});

    doc.moveDown().fontSize(10);

    var values = _.values(failures);
    for (var i = 0; i < values.length; i++) {
        if (values[i].jiraIssueKey != null) {
            var latestFailedBuild = _.max(values[i].builds, "timestamp");
            var jiraIssueUrl = "https://issues.jboss.org/browse/" + values[i].jiraIssueKey;

            doc.text(values[i].jiraIssueKey + ". " + values[i].jiraIssueSummary, {link: jiraIssueUrl, underline: true});
            doc.text("JIRA status: " + values[i].jiraIssueStatus);
            doc.text("Number of failures: " + values[i].builds.length
                    + ". Last failure on: " + dateToString(new Date(latestFailedBuild.timestamp)));
            doc.text("Last failed build: " + latestFailedBuild.url, {link: latestFailedBuild.url});
            doc.moveDown();
        }
    }

    doc.moveDown();
    doc.text("Undocumented builds", {underline: true});
    for (var i = 0; i < failures.other.builds.length; i++)  {
        doc.text(failures.other.builds[i].url, {link: failures.other.builds[i].url});
    }

    doc.end();
}
