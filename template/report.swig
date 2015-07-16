<html>
<head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.3/css/theme.bootstrap.min.css"/>

    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.3/js/jquery.tablesorter.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.3/js/jquery.tablesorter.widgets.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.3/js/parsers/parser-date.min.js"></script>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="page-header">
                    <h1>CI Report <small>Generated on {{ currentDate | date("d/m/Y") }}</small></h1>
                    <p>Monitoring <a href="http://albany.eng.hst.ams2.redhat.com/view/Narayana/">http://albany.eng.hst.ams2.redhat.com/view/Narayana/</a></p>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-5">
                <h2>Documented failures</h2>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <table id="documented-failures" class="table table-bordered">
                    <thead>
                        <tr>
                            <th>JIRA key</th>
                            <th>JIRA summary</th>
                            <th>JIRA status</th>
                            <th>JIRA priority</th>
                            <th>Number of failures</th>
                            <th>Last failed on</th>
                            <th>Failed builds</th>
                        </tr>
                    </thead>
                    {% for failure in documentedFailures %}
                        <tr>
                            <td>
                                <a href="{{ failure.jiraIssueUrl }}">{{ failure.jiraIssueKey }}</a>
                            </td>
                            <td>{{ failure.jiraIssueSummary }}</td>
                            <td>{{ failure.jiraIssueStatus }}</td>
                            <td>{{ failure.jiraIssuePriority }}</td>
                            <td>{{ failure.builds.length }}</td>
                            <td>{{ failure.lastFailureDate | date("d/m/Y") }}
                                {% if failure.isNew %}
                                    <span class="label label-warning">New</span>
                                {% endif %}
                            </td>
                            <td>
                                {% for build in failure.builds %}
                                    <div>
                                        <a href="{{ build.url }}">{{ build.jobName }} {{ build.number }}</a>
                                    </div>
                                {% endfor %}
                            </td>
                        </tr>
                    {% endfor %}
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-5">
                <h2>Undocumented failures</h2>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Failed on</th>
                            <th>Build URL</th>
                        </tr>
                    </thead>
                    {% for build in undocumentedBuilds %}
                        <tr>
                            <td>{{ build.date.toString() | date("d/m/Y") }}
                                {% if build.isNew %}
                                    <span class="label label-warning">New</span>
                                {% endif %}
                            </td>
                            <td>
                                <a href="{{ build.url }}">{{ build.jobName }} {{ build.number }}</a>
                            </td>
                        </tr>
                    {% endfor %}
                </table>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            $("#documented-failures").tablesorter({
                theme: "bootstrap",
                headerTemplate : "{content} {icon}",
                widthFixed: true,
                widgets: ["uitheme"],
                dateFormat: "ddmmyyyy",
                sortList: [[5, 1]]
            });
        });
    </script>
</body>
</html>