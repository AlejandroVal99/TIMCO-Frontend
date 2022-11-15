import ListCard from "../../../Components/ListCard/ListCard.js";
import ProjectCard from "../../../Components/ProjectCard/ProjectCard.js";
import API from "./../../../src/TimcoApi.js";
import parseJwt from "./../../../src/utils/parseJWT.js";
import constants from "../../../src/utils/constants.js";

const token = localStorage.getItem("token");
const userData = parseJwt(token).data;

let projects = [];
let candidateProjects = [];

document.getElementById("signOutButton").addEventListener("click", () => {
  SignOut();
});

const vacancyContainer = document.querySelector("#dashboard__vacancies");
let myProjectsContainer = document.querySelector(
  "#dashboard_me__projects__container"
);

const activeTabEle = document.getElementById("active-tab");
const finishedTabEle = document.getElementById("finished-tab");
const waitingTabEle = document.getElementById("waiting-tab");

const getUserData = () => {
  if (userData !== null) {
    let userName = userData.name;
    let userDetail = userData.area.name;

    const userNameSideBar = document.getElementById("userName");
    const userDetailSideBar = document.getElementById("userDetail");
    const helloUserNameTitle = document.getElementById("helloUserName");

    userNameSideBar.innerHTML = userName;
    helloUserNameTitle.innerHTML = userName;
    userDetailSideBar.innerHTML = userDetail;
  }
};

const LoadVacancies = async () => {
  let candidateProjectsIds = [];
  let token = localStorage.getItem("token");
  let userData = parseJwt(token).data;

  const candidatesByStudent = await API.GetCandidatesByStudentId(
    userData.studentId
  );
  if (candidatesByStudent.length > 0) {
    candidateProjects = candidatesByStudent;
    candidateProjectsIds = candidatesByStudent.map(
      ({ projectId }) => projectId
    );
  }

  const projectsData = await API.GetActiveProjects({
    entityId: userData.studentId,
  });
  let projectsFilter = projectsData.data.filter((project) => {
    //debugger;
    if (!candidateProjectsIds.includes(project.projectId)) {
      return project.state.stateId === constants.states.UNASSIGNED_PROJECT_ID;
    }
  });
  console.log(projectsFilter);
  
  if (!projectsFilter) return;
  projectsFilter.forEach((project) => {
    console.log("Entro");
    const card = ProjectCard.Create({
      project,
      primaryBtn: {
        label: "Revisar",
        onclick: () =>
          OnProjectClicked({ id: project.projectId, owner: false }),
      },
    });
    if (!card) return;
    vacancyContainer.appendChild(card);
  });
};

const LoadMyProjects = async () => {
  if (!myProjectsContainer) return;
  myProjectsContainer.innerHTML = null;

  let token = localStorage.getItem("token");
  let userData = parseJwt(token).data;

  if (userData !== null) {
    projects = await API.GetActiveProjects({ entityId: userData.studentId });
    if (projects.data.length === 0) return;
    projects = projects.data;
    drawProjectsByState(constants.states.ACTIVE_PROJECT_ID);
  }
}; //Closes LoadVacancies method

const drawProjectsByState = (state) => {
  let projectsFilter = [];
  if (state === constants.states.WAITING_PROJECT_ID) {
    projectsFilter = candidateProjects.filter(
      (candidate) => candidate.stateId === state
    );
    projectsFilter = projectsFilter.map(({ project }, index) => {
      return { ...project, state: candidateProjects[index].state };
    });
  } else {
    projectsFilter = projects.filter(
      (project) => project.state.stateId === state
    );
  }

  drawProjects({ projects: projectsFilter });
};

const drawProjects = ({ projects = [] }) => {
  myProjectsContainer.innerHTML = null;

  projects.forEach((project) => {
    let card;
    switch (project.state.stateId) {
      case constants.states.ACTIVE_PROJECT_ID:
        card = ListCard.CreateProjectCard({
          project,
          primaryBtn: {
            label: "Entregar",
            visible: "true",
            onclick: () => OnProjectClicked({ id: project.projectId }),
          },
          secondaryBtn: {
            label: "Ver Brief",
            visible: "true",
            onclick: () => OnProjectClicked({ id: project.projectId }),
          },
        });

        break;
      case constants.states.FINISHED_PROJECT_ID:
        card = ListCard.CreateProjectCard({
          project,
          primaryBtn: {
            visible: false,
          },
          secondaryBtn: {
            label: "Ver Brief",
            visible: "true",
            onclick: () => OnProjectClicked({ id: project.projectId }),
          },
        });
        break;
      case constants.states.WAITING_PROJECT_ID:
        card = ListCard.CreateProjectCard({
          project,
          primaryBtn: {
            visible: false,
          },
          secondaryBtn: {
            label: "Ver Brief",
            visible: "true",
            onclick: () => OnProjectClicked({ id: project.projectId }),
          },
        });
        break;
    }

    if (!card) return;
    myProjectsContainer.appendChild(card);
  });
};

const OnProjectClicked = ({ id = 0, owner = true }) => {
  if (!owner) {
    window.location.href = `./../../Projects/overview.html?projectId=${id}`;
  } else {
    window.location.href = `./../../Projects/overview.html?projectId=${id}&owned=${owner}`;
  }
};

const SignOut = () => {
  API.SignOutStudent();
};

activeTabEle.addEventListener("click", function () {
  drawProjectsByState(constants.states.ACTIVE_PROJECT_ID);
});
finishedTabEle.addEventListener("click", function () {
  drawProjectsByState(constants.states.FINISHED_PROJECT_ID);
});
waitingTabEle.addEventListener("click", function () {
  drawProjectsByState(constants.states.WAITING_PROJECT_ID);
});

LoadVacancies();
LoadMyProjects();
getUserData();