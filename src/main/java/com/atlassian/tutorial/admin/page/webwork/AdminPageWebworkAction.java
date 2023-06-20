package com.atlassian.tutorial.admin.page.webwork;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.atlassian.jira.web.action.JiraWebActionSupport;

public class AdminPageWebworkAction extends JiraWebActionSupport {
    private static final Logger log = LoggerFactory.getLogger(AdminPageWebworkAction.class);

    @Override
    public String execute() throws Exception {
        return "Admin Page";
    }
}
