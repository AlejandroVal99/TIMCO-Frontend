import API from "../../src/TimcoApi.js";

const ListCard = (() => {
  const CreateProjectCard = ({
    project = {
      name: "project name",
      logoUri:
        "https://images.ctfassets.net/oggad6svuzkv/7znyJc3Y7SecEoKSYKWoaQ/4a24e9015c360799cfb072adcd92cc5e/P_G_Logo_RGB.svg",
      budget: 0,
      deadline: 3,
      priceTotal: 0,
      timelineDate: 0,
    },
    type = "student",
    projectTheme = "#F7863C",
    primaryBtn = { label: "primary", onclick: () => {}, visible: true },
    secondaryBtn = { label: "secondary", onclick: () => {}, visible: true },
  }) => {
    // debugger;
    const card = document.createElement("article");

    card.classList.add("listCard");

    const projectLogo = document.createElement("img");
    projectLogo.classList.add("listCard__image");
    if (type === "student") {
      projectLogo.src = project.logoUri;
    } else if (type === "recruiter") {
      projectLogo.src = project.company.profileImage;
    }
    card.appendChild(projectLogo);

    const informationSection = document.createElement("section");
    informationSection.classList.add("listCard__information");
    card.appendChild(informationSection);

    const projectTitle = document.createElement("h4");
    projectTitle.classList.add("listCard__information__title");
    projectTitle.textContent = project.name;
    informationSection.appendChild(projectTitle);

    const projectDetails = document.createElement("div");
    projectDetails.classList.add("listCard__information__information");
    informationSection.append(projectDetails);

    const companySpan = document.createElement("span");
    const companySpanIcon = document.createElement("img");
    companySpanIcon.src = API.GetStaticRoute(
      "Components/ListCard/resources/company.png"
    );

    companySpan.append(companySpanIcon);
    projectDetails.append(companySpan);

    const companyName = document.createElement("small");
    if (type === "recruiter") {
      companyName.textContent = project.company.name;
    }

    companySpan
      .appendChild(document.createElement("p"))
      .appendChild(companyName);

    const budgetSpan = document.createElement("span");
    const budgetSpanIcon = document.createElement("img");
    budgetSpanIcon.src = API.GetStaticRoute(
      "Components/ListCard/resources/budget.png"
    );
    budgetSpan.append(budgetSpanIcon);
    projectDetails.append(budgetSpan);

    const budgetAmount = document.createElement("small");
    budgetAmount.textContent = project.priceTotal;
    // budgetAmount.textContent = budget;
    budgetSpan
      .appendChild(document.createElement("p"))
      .appendChild(budgetAmount);

    const deadlineSpan = document.createElement("span");
    const deadlineSpanIcon = document.createElement("img");
    deadlineSpanIcon.src = API.GetStaticRoute(
      "Components/ListCard/resources/deadline.png"
    );

    deadlineSpan.append(deadlineSpanIcon);
    projectDetails.append(deadlineSpan);

    const deadlineTime = document.createElement("small");
    // deadlineTime.textContent = deadline + ' Semanas';
    deadlineTime.textContent = project.timelineDate;
    deadlineSpan
      .appendChild(document.createElement("p"))
      .appendChild(deadlineTime);

    const cardControls = document.createElement("section");
    cardControls.classList.add("listCard__controls");
    card.append(cardControls);

    //debugger;
    if (primaryBtn.visible) {
      const deliverBtn = document.createElement("button");

      deliverBtn.type = "button";
      deliverBtn.classList.add("cta_button", "--accented");
      deliverBtn.textContent = primaryBtn.label;

      cardControls.append(deliverBtn);

      if (project.hasOwnProperty("id") && project.hasOwnProperty("studentId")) {
        let { id, studentId } = project;
        deliverBtn.value = `${id}/${studentId}`;
        deliverBtn.addEventListener("click", function (e) {
          let value = e.target.value;
          value = value.split("/");
          return primaryBtn.onclick({
            candidateId: value[0],
            studentId: value[1],
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

      if (project.hasOwnProperty("id")) {
        let { id } = project;
        briefBtn.value = id;
        briefBtn.addEventListener("click", function (e) {
          let value = e.target.value;
          return secondaryBtn.onclick(value);
        });
      } else {
        briefBtn.onclick = secondaryBtn.onclick;
      }
    }

    return card;
  };

  return {
    CreateProjectCard,
  };
})();

export default ListCard;