import API from "../../src/TimcoApi.js";
import { timeFromNow, formatMediumDate } from "../../src/utils/timeHelper.js";
import currencyFormatter from "../../src/utils/currencyHelper.js";

const CandidateCard = (() => {
  const CreateCandidateCard = ({
    candidate = {
      name: "project name",
      logoUri:
        "https://images.ctfassets.net/oggad6svuzkv/7znyJc3Y7SecEoKSYKWoaQ/4a24e9015c360799cfb072adcd92cc5e/P_G_Logo_RGB.svg",
      id: 0,
      studentId: 3,
      name: 0,
    },
    studentData = {
      university,
      area,
    },
    projectTheme = "#F7863C",
    primaryBtn = { label: "primary", onclick: () => {}, visible: true },
    secondaryBtn = { label: "secondary", onclick: () => {}, visible: true },
  }) => {
    // const projectTimeData = timeFromNow(project.timelineDate);
    // if(projectTimeData.when === 'past') return;

    const card = document.createElement("article");
    card.classList.add("candidateCard");

    const candidateLogo = document.createElement("img");
    candidateLogo.classList.add("candidateCard__image");

    candidateLogo.src = candidate.logoUri;

    card.appendChild(candidateLogo);

    const informationSection = document.createElement("section");
    informationSection.classList.add("candidateCard__information");
    card.appendChild(informationSection);

    const headerContainer = document.createElement("div");
    headerContainer.classList.add("candidateCard__information__header");
    informationSection.appendChild(headerContainer);

    const candidateTitle = document.createElement("h5");
    candidateTitle.classList.add("candidateCard__information__title");
    candidateTitle.textContent = candidate.name;
    headerContainer.appendChild(candidateTitle);

    const candidateGoToProfile = document.createElement("a");
    candidateGoToProfile.innerHTML = "Ver perfil";
    candidateGoToProfile.classList.add(
      "candidateCard__information__linkToProfile"
    );
    candidateGoToProfile.href = API.GetStaticRoute(
      `Pages/Profile/profiles.html?studentId=${candidate.studentId}`
    );
    headerContainer.appendChild(candidateGoToProfile);

    const candidateDetails = document.createElement("div");
    candidateDetails.classList.add("candidateCard__information__information");
    informationSection.append(candidateDetails);

    const universitySpan = document.createElement("span");
    const universitySpanIcon = document.createElement("img");
    universitySpanIcon.src = API.GetStaticRoute(
      "Components/candidateCard/resources/University.png"
    );

    universitySpan.append(universitySpanIcon);

    const universityName = document.createElement("small");

    universityName.textContent = studentData.university;

    universitySpan
      .appendChild(document.createElement("p"))
      .appendChild(universityName);

    candidateDetails.append(universitySpan);

    const areaSpan = document.createElement("span");
    const areaSpanIcon = document.createElement("img");
    areaSpanIcon.src = API.GetStaticRoute(
      "Components/CandidateCard/resources/Area.png"
    );
    areaSpan.append(areaSpanIcon);
    const areaName = document.createElement("small");

    areaName.textContent = studentData.area;
//debugger;
    areaSpan.appendChild(document.createElement("p")).appendChild(areaName);

    candidateDetails.append(areaSpan);

    const cardControls = document.createElement("section");
    cardControls.classList.add("listCard__controls");
    card.append(cardControls);

    if (primaryBtn.visible) {
      const deliverBtn = document.createElement("button");

      deliverBtn.type = "button";
      deliverBtn.classList.add("cta_button", "--accented");
      deliverBtn.textContent = primaryBtn.label;

      cardControls.append(deliverBtn);

      if (
        candidate.hasOwnProperty("id") &&
        candidate.hasOwnProperty("studentId")
      ) {
        let { id, studentId, name } = candidate;
        deliverBtn.value = `${id}/${studentId}/${name}`;
        deliverBtn.addEventListener("click", function (e) {
          let value = e.target.value;
          value = value.split("/");
          return primaryBtn.onclick({
            candidateId: value[0],
            studentId: value[1],
            candidateName: value[2],
          });
        });
      } else {
        deliverBtn.onclick = primaryBtn.onclick;
      }
    }

    if (secondaryBtn.visible) {
      const briefBtn = document.createElement("button");

      briefBtn.type = "button";
      briefBtn.classList.add("cta_button");
      briefBtn.textContent = secondaryBtn.label;
      cardControls.append(briefBtn);

      // briefBtn.onclick = secondaryBtn.onclick;

      if (candidate.hasOwnProperty("id")) {
        let { id, name } = candidate;
        // briefBtn.value = id;
        briefBtn.value = `${id}/${name}`;
        briefBtn.addEventListener("click", function (e) {
          let value = e.target.value;
          value = value.split("/");
          return secondaryBtn.onclick({
            candidateId: value[0],
            candidateName: value[1],
          });
        });
      } else {
        briefBtn.onclick = secondaryBtn.onclick;
      }
    }

    return card;
  };

  return {
    CreateCandidateCard,
  };
})();

export default CandidateCard;
