import ListCard from "../../Components/ListCard/ListCard.js";
import CandidateCard from "../../Components/CandidateCard/candidateCard.js";
import ZeroItems from "../../Components/ZeroItems/ZeroItems.js";
import API from "../../src/TimcoApi.js";
import parseJwt from "../../src/utils/parseJWT.js";
import constants from "../../src/utils/constants.js";
import { timeFromNow } from "../../src/utils/timeHelper.js";
import currencyFormatter from "../../src/utils/currencyHelper.js";

let candidates = [];

const urlParams = new URLSearchParams(window.location.search);
const IsRecruiterLogged = API.IsRecruiterLogged();

const projectKey = urlParams.get("projectId");
const owned = !!urlParams.get("owned");
const usertype = urlParams.get("user");

const projectData = await API.GetProjectByID(projectKey);

const ProfilePicture = document.getElementById("profile-picture");

const ProjectLogo = document.querySelector(".overview__header__logo");
const ProjectState = document.querySelector(".overview__header__projectState");
const ProjectName = document.querySelector(".overview__header__projectName");
const ProjectType = document.querySelector(".overview__header__projectType");
const ProjectDescription = document.querySelector(
  ".overview__header__projectDescription"
);
const btnSignOut = document.getElementById("signOutButton");
const ProjectBudget = document.querySelector(".overview__header__budget");
const ProjectDeadline = document.querySelector(".overview__header__deadline");

const ProjectBrief = document.querySelector(".overview__body__projectBrief");
const ProjectBriefContainer = document.querySelector(
  ".container__body__projectBrief"
);
const ProjectRequirements = document.querySelector(
  ".overview__body__projectsRequirements"
);
const ProjectSkills = document.querySelector(".overview__body__skills");

const WebsiteButton = document.querySelector(".overview_website");
const LinkedInButton = document.querySelector(".overview_linkedin");

const DeliverButton = document.querySelector("#DeliverBtn");
const ApplyButton = document.querySelector("#ApplyBtn");

const DeliverModal = document.querySelector("#DeliverModal");
const ApplyModal = document.querySelector("#ApplyModal");
const AcceptDeliverModal = document.querySelector("#AcceptDeliverModal");
const ShowDeliverBtn = document.querySelector("#showDeliver");

const ApplyModalForm = document.getElementById("applyModalForm");

const SkillContainer = document.getElementById("skills__required__container");

const btnReturnToDashBoard = document.getElementById("btnReturnToDashboard");

btnReturnToDashBoard.addEventListener("click", () => {
  if (IsRecruiterLogged) {
    API.GoToRecruiterDashboard();
  } else {
    API.GoToStudentDashboard();
  }
});

const getUserData = () => {
  const token = localStorage.getItem("token");
  const userData = parseJwt(token);
  let userName = userData.data.name;
  let userDetail;

  if (API.IsRecruiterLogged()) {
    userDetail = "Recruiter";
    ProfilePicture.src = userData.data.profileImage;
  } else {
    userDetail = userData.data.area.name;
  }

  const userNameSideBar = document.getElementById("userCurrentName");
  const userDetailSideBar = document.getElementById("userCurrentDetail");

  userNameSideBar.innerHTML = userName;
  userDetailSideBar.innerHTML = userDetail;
};

const candidatesTitle = document.querySelector("#overview__candidates__title");
const AcceptDeliverBtn = document.querySelector("#AcceptDeliverBtn");
const candidatesContainer = document.querySelector(
  "#overview__candidates__container"
);

if (usertype != "recruiter") {
  if (candidatesTitle) candidatesTitle.remove();
  if (candidatesContainer) candidatesContainer.remove();
  if (
    projectData.state.stateId === constants.states.FINISHED_PROJECT_ID ||
    projectData.state.stateId === constants.states.UNASSIGNED_PROJECT_ID
  ) {
    if (DeliverButton) {
      // DeliverButton.disabled = true;
      DeliverButton.remove();
    }
  }
} else {
  if (DeliverButton) DeliverButton.remove();
  if (ApplyButton) ApplyButton.remove();

  switch (projectData.state.stateId) {
    case constants.states.UNASSIGNED_PROJECT_ID:
      if (ProjectBriefContainer) ProjectBriefContainer.remove();
      if (SkillContainer) SkillContainer.remove();
      break;

    default:
      if (candidatesTitle) candidatesTitle.remove();
      if (candidatesContainer) candidatesContainer.remove();
      break;
  }
}

if (DeliverButton) {
  if (!owned) {
    DeliverButton.remove();
    if (DeliverModal) DeliverModal.remove();
  } else {
    DeliverButton.addEventListener("click", () => {
      DeliverModal.classList.remove("hidden");
    });
  }
}

if (ApplyButton) {
  if (owned) {
    ApplyButton.remove();
    if (ApplyModal) ApplyModal.remove();
  } else {
    ApplyButton.addEventListener("click", () => {
      ApplyModal.classList.remove("hidden");
    });
  }
}

if (DeliverModal) {
  DeliverModal.querySelector(".cancelBtn").addEventListener("click", () => {
    DeliverModal.classList.add("hidden");
  });

  DeliverModal.querySelector(".closeModal__btn").addEventListener(
    "click",
    () => {
      DeliverModal.classList.add("hidden");
    }
  );

  DeliverModal.addEventListener("click", (event) => {
    if (event.target != DeliverModal) return;

    DeliverModal.classList.add("hidden");
  });

  DeliverModal.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const Deliver = {};
    Deliver.projectId = projectData.projectId;
    Deliver.companyId = projectData.companyId;
    Deliver.serviceId = projectData.serviceId;
    Deliver.studentId = projectData.studentId;
    Deliver.stateId = constants.states.INREVIEW_PROJECT_ID;

    [...e.target.elements].forEach(
      (element, index) => (Deliver[element.name] = element.value)
    );

    debugger;
    if (await API.UploadProject(Deliver)) {
      alert("Proyecto entregado exitosamente");
      window.location.reload();
    }
  });
}
if (ApplyModal) {
  ApplyModal.querySelector(".cancelBtn").addEventListener("click", () => {
    ApplyModal.classList.add("hidden");
  });

  ApplyModal.querySelector(".closeModal__btn").addEventListener("click", () => {
    ApplyModal.classList.add("hidden");
  });

  ApplyModal.addEventListener("click", (event) => {
    if (event.target != ApplyModal) return;
    ApplyModal.classList.add("hidden");
  });

  ApplyModal.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userData = parseJwt(token);
    const Request = {};

    Request.studentId = userData.data.studentId;
    Request.companyId = projectData.companyId;
    Request.projectId = projectData.projectId;
    Request.stateId = constants.states.WAITING_PROJECT_ID;

    const candidate = await API.JoinProjectRequest(Request);
    if (candidate) {

      alert("Petición enviada exitosamente");
      ApplyButton.remove();
      ShowDeliverBtn.remove();
      ApplyModal.classList.add("hidden");
      //location.reload(true);
    }
  });
}

btnSignOut.addEventListener("click", () => {
  if (usertype == "recruiter") {
    API.SignOutRecruiter();
  } else {
    API.SignOutStudent();
  }
});

if(projectData.state.stateId === constants.states.FINISHED_PROJECT_ID &&usertype != "recruiter" ){

}else{
ShowDeliverBtn.remove();
}


if(AcceptDeliverBtn){
  AcceptDeliverBtn.addEventListener("click", () => {
    AcceptDeliverModal.classList.remove("hidden");
  });
}
const deliverOptions = () => {


  if (usertype != "recruiter") {
   
    if(ShowDeliverBtn){
      ShowDeliverBtn.href = projectData.urlDelivery;
      
    }
    AcceptDeliverBtn.remove();

    
  } else {
   


    if(projectData.state.stateId === constants.states.INREVIEW_PROJECT_ID){
      if(ShowDeliverBtn){
        ShowDeliverBtn.href = projectData.urlDelivery;
        
      }
      

      if(AcceptDeliverModal){
        AcceptDeliverModal.querySelector(".cancelBtn").addEventListener("click", () => {
          AcceptDeliverModal.classList.add("hidden");
        });
      
        AcceptDeliverModal.querySelector(".closeModal__btn").addEventListener(
          "click",
          () => {
            AcceptDeliverModal.classList.add("hidden");
          }
        );
      
        AcceptDeliverModal.addEventListener("click", (event) => {
          if (event.target != AcceptDeliverModal) return;
      
          AcceptDeliverModal.classList.add("hidden");
        });
      
        AcceptDeliverModal.querySelector("form").addEventListener("submit", async (e) => {
          e.preventDefault();
      
          const Submission = {};
          Submission.projectId = projectData.projectId;
          Submission.companyId = projectData.companyId;
          Submission.serviceId = projectData.serviceId;
          Submission.studentId = projectData.studentId;
          Submission.stateId = constants.states.FINISHED_PROJECT_ID;
      
          [...e.target.elements].forEach(
            (element, index) => (Submission[element.name] = element.value)
          );
      
          debugger;
          if (await API.UploadProject(Submission)) {
            alert("Proyecto aceptado exitosamente");
            window.location.reload();
          }
        });
      }
    }else if (projectData.state.stateId === constants.states.FINISHED_PROJECT_ID){
      AcceptDeliverBtn.remove();
      if(ShowDeliverBtn){
        ShowDeliverBtn.href = projectData.urlDelivery;
        
      }
    }else{
      ShowDeliverBtn.remove();
      AcceptDeliverBtn.remove();

    };
    }
  }
  

  

const RenderProjectData = async (key) => {
  if (!key) return;
  FillInformation(projectData);
};

const loadCandidates = async (projectKey) => {
  candidates = await API.GetCandidatesByProjectId(projectKey);
  drawCandidateCard(candidates);
};

const drawCandidateCard = (candidates) => {
  let studentId = 0;
  let companyId = 0;
  debugger;

  if (!candidates || candidates.length === 0) {
    candidatesContainer.appendChild(
      ZeroItems.CreateZeroItemsCard({
        label: "candidatos",
        labelDetail: `para este proyecto.`,
        showState: false,
      })
    );
    return;
  }

  // New candidate Card component
  candidates.forEach((candidate) => {
    debugger;
    companyId = candidate.companyId;
    studentId = candidate.student.studentId;

    const card = CandidateCard.CreateCandidateCard({
      candidate: {
        id: candidate.candidateId,
        studentId: studentId,
        name: candidate.student.name || "student name",
        logoUri: candidate.student.profileImage || "pic",
      },
      primaryBtn: {
        label: "Aceptar",
        onclick: ({ candidateId, studentId }) => {
          onAcceptCandidate({ candidateId, studentId });
        },
        visible: true,
      },
      secondaryBtn: {
        label: "Rechazar",
        onclick: (candidateId) => {
          onRejectCandidate(candidateId);
        },
        visible: true,
      },
      student:{
        university: candidate.student.name,
        area: candidate.student.area.name
      }
    });

    candidatesContainer.appendChild(card);
  });

  //Old Candidate Card Component

  // candidates.forEach((candidate) => {
  //   // candidateId = candidate.candidateId;
  //   companyId = candidate.companyId;
  //   studentId = candidate.student.studentId;

  //   const card = ListCard.CreateProjectCard({
  //     project: {
  //       id: candidate.candidateId,
  //       studentId: studentId,
  //       name: candidate.student.name || "student name",
  //       logoUri: candidate.student.profileImage || "pic",
  //     },
  //     primaryBtn: {
  //       label: "Aceptar",
  //       onclick: ({ candidateId, studentId }) => {
  //         onAcceptCandidate({ candidateId, studentId });
  //       },
  //       visible: true,
  //     },
  //     secondaryBtn: {
  //       label: "Rechazar",
  //       onclick: (candidateId) => {
  //         onRejectCandidate(candidateId);
  //       },
  //       // onclick: () =>
  //       //   onRejectCandidate({ candidateId, companyId, projectId, studentId }),
  //       visible: true,
  //     },
  //   });

  //   candidatesContainer.appendChild(card);
  // });
};

const onAcceptCandidate = async ({ candidateId, studentId }) => {
  const data = {
    studentId,
    projectId: projectData.projectId,
    candidateId: parseInt(candidateId),
  };

  await API.PutCandidateProject({
    candidateId: data.candidateId,
    stateId: constants.states.APPROVE_PROJECT_ID,
  });

  await API.UploadProject({
    projectId: data.projectId,
    studentId: data.studentId,
    stateId: constants.states.ACTIVE_PROJECT_ID,
  });

  location.reload();
};

const onRejectCandidate = async (candidateId) => {
  const data = {
    candidateId: parseInt(candidateId),
    stateId: constants.states.REJECT_PROJECT_ID,
  };
  await API.PutCandidateProject(data);
  location.reload();
};

const setProjectBadgeState = (label, color, stateClass) => {
  ProjectState.textContent = label;
  ProjectState.style.backgroundColor = color;
  ProjectState.classList.add(stateClass);
};

const FillInformation = (projectData) => {
  if (!projectData) return;

  ProjectRequirements.innerHTML = null;
  if (ProjectLogo) ProjectLogo.src = projectData.company.profileImage;
  if (ProjectName) ProjectName.textContent = projectData.name;
  if (ProjectType) ProjectType.textContent = projectData.service.name;
  if (ProjectDescription)
    ProjectDescription.textContent = projectData.description;

  switch (projectData.state.stateId) {
    case constants.states.FINISHED_PROJECT_ID:
      setProjectBadgeState("Proyecto Finalizado", "#00d380", "finishState");
      break;
    case constants.states.ACTIVE_PROJECT_ID:
      setProjectBadgeState(
        "Proyecto en progreso",
        "#8ac2dd",
        "inProgressState"
      );
      break;
    case constants.states.WAITING_PROJECT_ID:
      setProjectBadgeState("Proyecto a la espera", "#e0fe68", "waitingState");
      break;
    case constants.states.REJECT_PROJECT_ID:
      setProjectBadgeState("Rechazado", "#f7863c", "rejectState");
      break;
    case constants.states.INREVIEW_PROJECT_ID:
      setProjectBadgeState("Proyecto en revisión", "#C5B5F1", "rejectState");
      break;
    default:
      setProjectBadgeState("Proyecto a la espera", "#e0fe68", "waitingState");
      break;
  }

  if (ProjectBudget)
    ProjectBudget.textContent = currencyFormatter(projectData.priceTotal);
  if (ProjectDeadline) {
    const projectTimeData = timeFromNow(projectData.timelineDate);
    switch (projectTimeData.when) {
      case "past":
        ProjectDeadline.textContent = `Finalizo hace ${projectTimeData.time} ${projectTimeData.unitOfTime}`;
        break;
      case "future":
        const timelineDate = new Date(projectData.timelineDate);
        ProjectDeadline.textContent = timelineDate.toLocaleDateString("es-CO", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        // ProjectDeadline.textContent = projectData.timelineDate;
        // ProjectDeadline.textContent = `${projectTimeData.time} ${projectTimeData.unitOfTime}`;
        break;
      default:
        ProjectDeadline.textContent = projectData.timelineDate;
        break;
    }
  }

  if (ProjectBrief) ProjectBrief.textContent = projectData.description;

  if (ProjectRequirements) {
    ProjectSkills.innerHTML = null;

    if (
      projectData.deliverables === null ||
      projectData.deliverables === undefined
    ) {
      ProjectRequirements.textContent =
        "El reclutador aún no adjuntado entregables.";
    } else {
      ProjectRequirements.textContent = projectData.deliverables;
    }

    const { skills } = projectData.service;

    skills.map((skill) => {
      if (!ProjectSkills) return;

      const skillName = document.createElement("p");
      skillName.classList.add("overview__body__skill");
      skillName.textContent = skill.name;
      ProjectSkills.append(skillName);
    });
  }

  if (candidatesContainer && usertype === "recruiter") {
    loadCandidates(projectKey);
  }

  // if (WebsiteButton) WebsiteButton.href = projectData.species.url;
  // if (LinkedInButton)
  //   LinkedInButton.href = projectData.location_area_encounters;
};

RenderProjectData(projectKey);
getUserData();
deliverOptions();
// loadCandidates(projectKey);
