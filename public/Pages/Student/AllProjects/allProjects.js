import ProjectCard from "../../../Components/ProjectCard/ProjectCard.js";
import API from "./../../../src/TimcoApi.js";
import parseJwt from "./../../../src/utils/parseJWT.js";
import constants from "../../../src/utils/constants.js";

const token = localStorage.getItem("token");
const userData = parseJwt(token).data;

const vacancyContainer = document.querySelector("#dashboard__vacancies");
const backBtn = document.querySelector("#btnReturnToDashboard");
const btnSignOut = document.getElementById("signOutButton");

let projects = [];
let candidateProjects = [];

backBtn.addEventListener("click", ()=>{
    window.history.back();
})
btnSignOut.addEventListener("click", () => {
      API.SignOutStudent();
  });

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

  const OnProjectClicked = ({ id = 0, owner = true }) => {
    if (!owner) {
      window.location.href = `./../../Projects/overview.html?projectId=${id}`;
    } else {
      window.location.href = `./../../Projects/overview.html?projectId=${id}&owned=${owner}`;
    }
  };

  getUserData();
  LoadVacancies();