import ListCard from "../../../Components/ListCard/ListCard.js";
import ZeroItems from "../../../Components/ZeroItems/ZeroItems.js";
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
    const userNameSideBar = document.getElementById("userName");
    // const userPicSideBar = document.getElementById("profile-picture");
    const userDetailSideBar = document.getElementById("userDetail");
    const helloUserNameTitle = document.getElementById("helloUserName");

    userNameSideBar.innerHTML = userData.name;
    // userPicSideBar.src = userData.profileImage;
    helloUserNameTitle.innerHTML = userData.name;
    userDetailSideBar.innerHTML = userData.area.name;
  }
};

const LoadVacancies = async () => {
  let candidateProjectsIds = [];

  const candidatesByStudent = await API.GetCandidatesByStudentId(
    userData.studentId
  );

  if (candidatesByStudent.length > 0) {
    candidateProjects = candidatesByStudent;
    candidateProjectsIds = candidatesByStudent.map(
      ({ projectId }) => projectId
    );
  }

  const projectsData = await API.GetVacancyAvailableByArea();
  let projectsFilter = projectsData.filter((project) => {
    if (!candidateProjectsIds.includes(project.projectId)) {
      return project.stateId === constants.states.UNASSIGNED_PROJECT_ID;
    }
  });

  if (!projectsFilter) return;
  projectsFilter.forEach((project) => {
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
    projects = projects.data;
    if (projects.length === 0) {
      const zeroDataEle = ZeroItems.CreateZeroItemsCard({
        state: constants.states.ACTIVE_PROJECT_ID,
      });
      myProjectsContainer.appendChild(zeroDataEle);
      return;
    }
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
  } else if (state === constants.states.FINISHED_PROJECT_ID) {
    projectsFilter = projects.filter(
      (project) =>
        project.state.stateId === state ||
        project.state.stateId === constants.states.REJECT_PROJECT_ID
    );
  } else {
    projectsFilter = projects.filter(
      (project) => project.state.stateId === state
    );
  }

  if (projectsFilter.length === 0) {
    myProjectsContainer.innerHTML = null;
    const zeroDataEle = ZeroItems.CreateZeroItemsCard({ state });
    myProjectsContainer.appendChild(zeroDataEle);
    return;
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
          type: "recruiter",
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
          type: "recruiter",
        });
        break;
      case constants.states.REJECT_PROJECT_ID:
        card = ListCard.CreateProjectCard({
          project: project.project,
          primaryBtn: {
            visible: false,
          },
          secondaryBtn: {
            label: "Ver Brief",
            visible: "true",
            onclick: () => OnProjectClicked({ id: project.projectId }),
          },
          type: "recruiter",
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
          type: "recruiter",
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
  activeTabEle.classList.add("selected");
  finishedTabEle.classList.remove("selected");
  waitingTabEle.classList.remove("selected");
  drawProjectsByState(constants.states.ACTIVE_PROJECT_ID);
});
finishedTabEle.addEventListener("click", function () {
  finishedTabEle.classList.add("selected");
  activeTabEle.classList.remove("selected");
  waitingTabEle.classList.remove("selected");
  drawProjectsByState(constants.states.FINISHED_PROJECT_ID);
});
waitingTabEle.addEventListener("click", function () {
  waitingTabEle.classList.add("selected");
  activeTabEle.classList.remove("selected");
  finishedTabEle.classList.remove("selected");
  drawProjectsByState(constants.states.WAITING_PROJECT_ID);
});

LoadVacancies();
LoadMyProjects();
getUserData();
