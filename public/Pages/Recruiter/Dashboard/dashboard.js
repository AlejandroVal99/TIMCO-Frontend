import ListCard from "../../../Components/ListCard/ListCard.js";
import ProjectCard from "../../../Components/ProjectCard/ProjectCard.js";
import constants from "../../../src/utils/constants.js";
import API from "./../../../src/TimcoApi.js";
import codedecJwt from "./../../../src/utils/parseJWT.js";

let projects = [];

document.getElementById("signOutButton").addEventListener("click", () => {
  SignOut();
});

// const vacancyContainer = document.querySelector("#dashboard__vacancies");
let myProjectsContainer = document.querySelector("#dashboard__vacancies");
const activeTabEle = document.getElementById("active-tab");
const finishedTabEle = document.getElementById("finished-tab");
const waitingTabEle = document.getElementById("waiting-tab");

const getUserData = () => {
  const token = localStorage.getItem("token");
  const userData = codedecJwt(token);
  let userName = userData.data.name;
  let userDetail;

  if (API.IsRecruiterLogged) {
    userDetail = userData.data.companyName;
  } else {
    userDetail = userData.data.area.name;
  }

  const userNameSideBar = document.getElementById("userName");
  const userDetailSideBar = document.getElementById("userDetail");
  const helloUserNameTitle = document.getElementById("helloUserName");

  userNameSideBar.innerHTML = userName;
  helloUserNameTitle.innerHTML = userName;
  userDetailSideBar.innerHTML = userDetail;
};

const loadNewProjectButton = () => {
  const newProjectContainer = document.querySelector(
    ".dashboard_new__projects__nav"
  );
  newProjectContainer.innerHTML = `<a href="${API.GetStaticRoute(
    "Pages/Recruiter/NewProject/NewProject.html"
  )}">
      <article class="projectCard new" "><img
              class=" projectCard__thumbnail" src="./resources/newProject icon.png">
          <p class="projectCard__owner">Crear un nuevo proyecto</p>
      </article>
    </a>
    `;
};

const LoadProjects = async () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const company = codedecJwt(token).data;
    projects = await API.GetActiveProjects({
      entityId: company.companyId,
      entityType: "company",
    });
    if (projects.data.length === 0) return;
    projects = projects.data;
    drawProjectsByState(constants.states.ACTIVE_PROJECT_ID);
  }
}; //Closes LoadVacancies method

const drawProjectsByState = (state) => {
  let projectsFilter;
  if (state === 4) {
    projectsFilter = projects.filter(
      (project) =>
        project.state.stateId === state || project.state.stateId === 1
    );
  } else {
    projectsFilter = projects.filter(
      (project) => project.state.stateId === state
    );
  }

  drawProjects({ projects: projectsFilter });
};

const drawProjects = ({ projects = [] }) => {
  if (!myProjectsContainer) return;
  myProjectsContainer.innerHTML = null;
  projects.forEach((project) => {
    const card = ListCard.CreateProjectCard({
      project,
      primaryBtn: {
        label: "Revisar",
        onclick: () => OnProjectClicked(project),
        visible: true,
      },
      secondaryBtn: {
        visible: false,
      },
    });
    if (!card) return;
    myProjectsContainer.appendChild(card);
  });
};

const SignOut = () => {
  API.SignOutRecruiter();
};

const OnProjectClicked = ({ projectId }) => {
  window.location.href = `./../../Projects/overview.html?projectId=${projectId}&owned=true&user=recruiter`;
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

// LoadVacancies();
getUserData();
LoadProjects();
loadNewProjectButton();
