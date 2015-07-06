<html>
<head>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="page-header">
                    <h1>CI Report <small>Generated on {{ currentDate }}</small></h1>
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
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>JIRA key</th>
                            <th>JIRA summary</th>
                            <th>JIRA status</th>
                            <th>Number of failures</th>
                            <th>Last failed on</th>
                            <th>Failed builds</th>
                        </tr>
                    </thead>
                    {% for failure in documentedFailures %}
                        <tr>
                            <td>{{ failure.jiraIssueKey }}</td>
                            <td>{{ failure.jiraIssueSummary }}</td>
                            <td>{{ failure.jiraIssueStatus }}</td>
                            <td>{{ failure.builds.length }}</td>
                            {% if failure.isNew %}
                                <td>{{ failure.lastFailureDate }} <span class="label label-warning">New</span></td>
                            {% else %}
                                <td>{{ failure.lastFailureDate }}</td>
                            {% endif %}
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
                            {% if build.isNew %}
                                <td>{{ build.date }} <span class="label label-warning">New</span></td>
                            {% else %}
                                <td>{{ build.date }}</td>
                            {% endif %}
                            <td>
                                <a href="{{ build.url }}">{{ build.jobName }} {{ build.number }}</a>
                            </td>
                        </tr>
                    {% endfor %}
                </table>
            </div>
        </div>
    </div>
</body>
</html>