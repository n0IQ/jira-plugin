import { FC, ReactNode } from "react";
import { css } from "@emotion/react";
import { projects } from "../sample-data/projects";
import axios from "axios";

interface Project {
  key: number;
  name: string;
  issue: number;
}

let projectsData: Project[] = [];

export const fetchProjectData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:2990/jira/rest/api/2/project"
    );

    // console.log(response);
    const projectsObj = response.data;
    // console.log("projectsObj", projectsObj);

    const projectDataObj = await Promise.all(
      projectsObj.map(async (project: Project) => {
        const issueResponse = await axios.get(
          "http://localhost:2990/jira/rest/api/2/search",
          {
            params: {
              jql: `project=${project.key}`,
            },
          }
        );

        const issueCount = issueResponse.data.total;

        return {
          key: project.key,
          name: project.name,
          issue: issueCount,
        };
      })
    );

    // console.log("projectDataObj:", projectDataObj);
    projectsData = projectDataObj;
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};

const nameWrapperStyles = css({
  display: "flex",
  alignItems: "center",
});

const NameWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <span {...css(nameWrapperStyles)}>{children}</span>
);

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: "project",
        content: "Project",
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: "issue",
        content: "Issue",
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: "action",
        content: "Action",
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = projects.map((project: Project, index: number) => {
  let isDeleting = false;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (confirmDelete) {
      isDeleting = true;
      try {
        await axios.delete(
          `http://localhost:2990/jira/rest/api/2/project/${project.key}`
        );

        // console.log("key: ", project.key);

        projectsData = projectsData.filter((item) => item.key !== project.key);
        // console.log("project data", projectsData);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
      isDeleting = false;
    }
  };

  return {
    key: `row-${index}-${project.name}`,
    isHighlighted: false,
    cells: [
      {
        key: project.name,
        content: (
          <NameWrapper>
            <a href="https://atlassian.design">{project.name}</a>
          </NameWrapper>
        ),
      },
      {
        key: project.issue,
        content: project.issue,
      },
      {
        key: "delete",
        content: (
          <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        ),
      },
    ],
  };
});
