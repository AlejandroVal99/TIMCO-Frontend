import ListCard from "../../Components/ListCard/ListCard.js";
import API from "../../src/TimcoApi.js";

const urlParams = new URLSearchParams(window.location.search);

const profileId = urlParams.get("profileId");


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
  const profileData = await API.GetProfileByID("1b14bcb9-1c05-44e6-8bcb-c0136b333d9c");

  FillInformation(profileData);
};

const FillInformation = (profileData) => {
  console.log("NAME",profileData.data.aboutMe)
  if (!profileData) return;

  if (ProfileImage) ProfileImage.src = API.GetStaticRoute(`Components/Sidebar/resources/profilePicture.png`);
  if (ProfileName) ProfileName.textContent = profileData.data.name;
  if (ProfileUniversity)
    ProfileUniversity.textContent = profileData.data.university.name;
  //if (ProfileTypeIcon) ProfileTypeIcon.src = profileData.sprites.front_default;

  if (ProfileDescription) ProfileDescription.textContent = profileData.data.aboutMe;

  if (ProfileBrief) ProfileBrief.textContent = profileData.pokedex;

  if (ProfileSkills) {
    ProfileSkills.innerHTML = null;
    profileData.moves.forEach((move) => {
      const skill = document.createElement("p");
      skill.classList.add("overview__body__skill");
      skill.textContent = move.move.name;
      ProfileSkills.append(skill);
    });
  }

  if (experienceTitle)
    experienceTitle.textContent = `Experiencia (${profileData.abilities.length} proyectos)`;

  profileData.abilities.forEach((ability) => {
    const card = experienceCard.cloneNode(true);
    card.classList.remove("hidden");
    experienceContainer.appendChild(card);
    card.querySelector(".experienceTitle").textContent = ability.ability.name;
  });

  if (ProfileType) ProfileType.textContent = profileData.types[0].type.name;
  if (WebsiteButton) WebsiteButton.href = profileData.species.url;
  if (LinkedInButton)
    LinkedInButton.href = profileData.location_area_encounters;

  const rating = map(profileData.base_experience, 20, 400, 1, 5).toFixed(2);
  ReviewStars.forEach((star, index) => {
    star.classList.remove("filled");
    if (ReviewSummary) ReviewSummary.textContent = rating + " de 16 reseñas";
    if (index <= rating - 1) star.classList.add("filled");
  });
};

RenderProfileData(profileId);

const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
