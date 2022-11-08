import ListCard from "../../Components/ListCard/ListCard.js";
import ListCard from "../../Components/ListCard/ListCard.js";
import API from "../../src/TimcoApi.js";
import parseJwt from "../../src/utils/parseJWT.js";
import constants from "../../src/utils/constants.js";

let candidates = [];

const urlParams = new URLSearchParams(window.location.search);
const IsRecruiterLogged = API.IsRecruiterLogged();

const projectKey = urlParams.get("projectId");
const owned = !!urlParams.get("owned");
const usertype = urlParams.get("user");

const projectData = await API.GetProjectByID(projectKey);

const ProjectLogo = document.querySelector(".overview__header__logo");
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
  } else {
    userDetail = userData.data.area.name;
  }
  //projectKey.value = userName;

  const userNameSideBar = document.getElementById("userCurrentName");
  const userDetailSideBar = document.getElementById("userCurrentDetail");

  userNameSideBar.innerHTML = userName;

  userDetailSideBar.innerHTML = userDetail;
};

const candidatesTitle = document.querySelector("#overview__candidates__title");

const candidatesContainer = document.querySelector(
  "#overview__candidates__container"
);

if (usertype != "recruiter") {
  if (candidatesTitle) candidatesTitle.remove();
  if (candidatesContainer) candidatesContainer.remove();
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

    const Submission = {};

    [...e.target.elements].forEach(
      (element, index) => (Submission[element.name] = element.value)
    );
    if (await API.SubmitProject(Submission)) {
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
    Request.stateId = 4;

    const candidate = await API.JoinProjectRequest(Request);
    if (candidate) {
      // alert("Petición enviada exitosamente");
      window.location.reload();
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

const RenderProjectData = async (key) => {
  if (!key) return;
  FillInformation(projectData);
};
const loadCandidates = async (projectKey) => {
  const candidatesData = await API.GetCandidatesByProjectId(projectKey);
  candidates = candidatesData;
  console.log("LOAD CANDIDATES DATA", candidates);
  drawCandidateCard(candidatesData, projectKey);
};

const drawCandidateCard = (candidates, projectId) => {
  // let candidateId,
  let companyId,
    studentId = 0;

  candidates.forEach((candidate) => {
    // candidateId = candidate.candidateId;
    companyId = candidate.companyId;
    studentId = candidate.student.studentId;

    const card = ListCard.CreateProjectCard({
      project: {
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
        // onclick: () =>
        //   onRejectCandidate({ candidateId, companyId, projectId, studentId }),
        visible: true,
      },
    });
    candidatesContainer.appendChild(card);
  });
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
  }, );

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

const FillInformation = (projectData) => {
  if (!projectData) return;

  ProjectRequirements.innerHTML = null;
  //   if (ProjectLogo) ProjectLogo.src = projectData.sprites.front_default;
  if (ProjectName) ProjectName.textContent = projectData.name;
  if (ProjectType) ProjectType.textContent = projectData.service.name;
  if (ProjectDescription)
    ProjectDescription.textContent = projectData.description;

  if (ProjectBudget) ProjectBudget.textContent = projectData.priceTotal;
  if (ProjectDeadline) ProjectDeadline.textContent = projectData.timelineDate;

  if (ProjectBrief) ProjectBrief.textContent = projectData.description;

  if (ProjectRequirements) {
    ProjectRequirements.textContent = projectData.deliverables;
    ProjectSkills.innerHTML = null;

    const { skills } = projectData.service;

    skills.map((skill) => {
      if (!ProjectSkills) return;

      const skillName = document.createElement("p");
      skillName.classList.add("overview__body__skill");
      skillName.textContent = skill.name;
      ProjectSkills.append(skillName);
    });
  }

  if (candidatesContainer) {
  }

  if (WebsiteButton) WebsiteButton.href = projectData.species.url;
  if (LinkedInButton)
    LinkedInButton.href = projectData.location_area_encounters;

  if (WebsiteButton) WebsiteButton.href = projectData.species.url;
  if (LinkedInButton)
    LinkedInButton.href = projectData.location_area_encounters;


};

RenderProjectData(projectKey);
getUserData();
loadCandidates(projectKey);
