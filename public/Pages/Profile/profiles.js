import ListCard from "../../Components/ListCard/ListCard.js";
import API from "../../src/TimcoApi.js";
import parseJwt from "../../src/utils/parseJWT.js";

const urlParams = new URLSearchParams(window.location.search);
const backBtn = document.querySelector("#backButton");
backBtn.addEventListener("click", () => {
  window.history.back();
});
let userData = {};
const profileId = urlParams.get("studentId");
const designSkills = ["Research", "UX design", "UI design", "Prototyping"];
const developmentSkills = ["HTML", "CSS", "Javascript", "Wordpress"];
const marketingSkills = [
  "Google Ads",
  "Facebook Ads",
  "Strategy",
  "SEM",
];

const reviewsData = [
  {
    title: "Sistema de Interfaces",
    date: "Julio 14/22 - Julio 27/22",
    raiting: 4,
    description:
      "Muy buen trabajo, creo que hay algunas cosas por mejorar pero cumplio con el tiempo adecuado y los requerimientos solicitados",
  },
  {
    title: "Sistema de Interfaces",
    date: "Julio 14/22 - Julio 27/22",
    raiting: 4.6,
    description:
      "Muy buen trabajo, creo que hay algunas cosas por mejorar pero cumplio con el tiempo adecuado y los requerimientos solicitados",
  },
  {
    title: "Sistema de Interfaces",
    date: "Julio 14/22 - Julio 27/22",
    raiting: 4.7,
    description:
      "Muy buen trabajo, creo que hay algunas cosas por mejorar pero cumplio con el tiempo adecuado y los requerimientos solicitados",
  },
];

const ProfileImage = document.querySelector(".overview__header__logo");
const ProfileName = document.querySelector(".overview__header__profileName");
const ProfileUniversity = document.querySelector(
  ".overview__header__university"
);
const ProfileType = document.querySelector(".overview__header__specialization");
const ProfileTypeIcon = document.querySelector(
  ".overview__header__specialization__icon"
);
const ProfileDescription = document.querySelector(
  ".overview__header__profileDescription"
);

const ReviewStars = document.querySelectorAll(".overview__review__star");
console.log(ReviewStars);
const ReviewSummary = document.querySelector(".overview__reviews__summary");

const ProfileBrief = document.querySelector(".overview__body__projectBrief");
const ProfileSkills = document.querySelector(".overview__body__skills");

const WebsiteButton = document.querySelector(".overview_website");
const LinkedInButton = document.querySelector(".overview_linkedin");

const experienceTitle = document.querySelector(
  ".overview__body__experience__title"
);

const experienceContainer = document.querySelector(
  ".overview__body__experience"
);
const experienceCard = document.querySelector(
  ".overview__body__experience__summary"
);

const RenderProfileData = async (key) => {
  if (!key) return;
  const profileData = await API.GetProfileByID(key);

  FillInformation(profileData);
};

const getUserData = () => {
  const token = localStorage.getItem("token");
  userData = parseJwt(token).data;
  let userName = userData.name;
  let userDetail;

  if (API.IsRecruiterLogged()) {
    userDetail = "Recruiter";
    console.log(userData);
    //ProfilePicture.src = userData.profileImage;
  } else {
    userDetail = userData.area.name;
  }

  const userNameSideBar = document.getElementById("userCurrentName");
  const userDetailSideBar = document.getElementById("userCurrentDetail");

  userNameSideBar.innerHTML = userName;
  //userDetailSideBar.innerHTML = userDetail;
};

const FillInformation = (profileData) => {
  console.log("NAME", profileData.data.area.name);
  if (!profileData) return;

  if (ProfileImage)
    ProfileImage.src = API.GetStaticRoute(
      `Components/Sidebar/resources/profilePicture1.png`
    );
  if (ProfileName) ProfileName.textContent = profileData.data.name;
  if (ProfileUniversity)
    ProfileUniversity.textContent = profileData.data.university.name;

  if (ProfileDescription)
    ProfileDescription.textContent = profileData.data.aboutMe;

  if (ProfileTypeIcon) {
    switch (profileData.data.area.areaId) {
      case 1:
        ProfileTypeIcon.src = API.GetStaticRoute(
          "Pages/Profile/resources/design.png"
        );
        break;

      case 2:
        ProfileTypeIcon.src = API.GetStaticRoute(
          "Pages/Profile/resources/development.png"
        );
        break;

      default:
        ProfileTypeIcon.src = API.GetStaticRoute(
          "Pages/Profile/resources/marketing.png"
        );
        break;
    }
  }

  if (ProfileSkills) {
    ProfileSkills.innerHTML = null;

    switch (profileData.data.area.areaId) {
      case 1:
        designSkills.forEach((move) => {
          const skill = document.createElement("p");
          skill.classList.add("overview__body__skill");
          skill.textContent = move;
          ProfileSkills.append(skill);
        });
        break;

      case 2:
        developmentSkills.forEach((move) => {
          const skill = document.createElement("p");
          skill.classList.add("overview__body__skill");
          skill.textContent = move;
          ProfileSkills.append(skill);
        });
        break;

      default:
        marketingSkills.forEach((move) => {
          const skill = document.createElement("p");
          skill.classList.add("overview__body__skill");
          skill.textContent = move;
          ProfileSkills.append(skill);
        });
        break;
    }
  }

  if (experienceTitle) experienceTitle.textContent = `Experiencia 3 proyectos`;
  //experienceTitle.textContent = `Experiencia (${profileData.abilities.length} proyectos)`;

  reviewsData.forEach((ability) => {
    const card = experienceCard.cloneNode(true);
    card.classList.remove("hidden");
    experienceContainer.appendChild(card);
    card.querySelector(".experienceTitle").textContent = ability.title;
    card.querySelector(".experienceDate").textContent = ability.date;
    card.querySelector(".experienceDescription").textContent =
      ability.description;
    //  let raitingText = (card.querySelector(".experienceRaiting").textContent =  ability.raiting);
    // let stars = card.querySelectorAll(".experienceRaitingStar");
    // let rating = map(380, 20, 400, 1, 5).toFixed(2);
    // stars.forEach((star, index) => {
    //   star.classList.remove("filled");
    //   raitingText.textContent = rating + " de 3 reseñas";
    //   if (index <= rating - 1) star.classList.add("filled");
    // });
  });

  if (ProfileType) ProfileType.textContent = profileData.data.area.name;
  if (WebsiteButton) WebsiteButton.href = profileData.portfolio;
  if (LinkedInButton) LinkedInButton.href = profileData.linkedin;

  const rating = map(380, 20, 400, 1, 5).toFixed(2);
  ReviewStars.forEach((star, index) => {
    star.classList.remove("filled");
    if (ReviewSummary) ReviewSummary.textContent = rating + " de 3 reseñas";
    if (index <= rating - 1) star.classList.add("filled");
  });
};

getUserData();
RenderProfileData(profileId);

const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
