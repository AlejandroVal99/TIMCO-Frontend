import API from "../../src/TimcoApi.js";
import {timeFromNow, formatMediumDate} from '../../src/utils/timeHelper.js';
import currencyFormatter from '../../src/utils/currencyHelper.js';

const ProjectCard = (() => {
  const Create = ({
    project = {
      name: "project name",
      owner: "project owner",
      logoUri:
        "https://images.ctfassets.net/oggad6svuzkv/7znyJc3Y7SecEoKSYKWoaQ/4a24e9015c360799cfb072adcd92cc5e/P_G_Logo_RGB.svg",
      priceTotal: 0,
      timelineDate: {when: 'past', unitOfTime: 0, time: 0},
    },
    projectTheme = "#F7863C",
    primaryBtn = { label: "primary", onclick: () => {} },
  }) => {
    // const projectTimeData = timeFromNow(project.timelineDate);
    // if(projectTimeData.when === 'past') return;

    const hasCompanyProperty = project.hasOwnProperty("company");

    const card = document.createElement("article");
    card.style.backgroundColor = projectTheme;
    card.classList.add("projectCard");

    const projectLogo = document.createElement("img");
    projectLogo.classList.add("projectCard__thumbnail");
    projectLogo.src = project.logoUri;
    card.appendChild(projectLogo);

    const projectOwner = document.createElement("p");
    projectOwner.classList.add("projectCard__owner");
    projectOwner.textContent = project.owner;
    card.append(projectOwner);

    const projectName = document.createElement("h5");
    projectName.classList.add("projectCard__title");
    projectName.textContent = project.name;

    if (hasCompanyProperty) {
      projectOwner.textContent = project.company.name;
      projectLogo.src = project.company.profileImage;
    }
    card.append(projectName);

    const budgetSection = document.createElement("div");
    budgetSection.classList.add("projectCard__budget");
    card.append(budgetSection);

    const budgetIcon = document.createElement("img");
    budgetIcon.src = API.GetStaticRoute(
      "Components/ProjectCard/resources/budget.png"
    );
    budgetSection.append(budgetIcon);

    const projectBudget = document.createElement("p");
    projectBudget.textContent = currencyFormatter(project.priceTotal);
    // projectBudget.textContent = `$ ${project.priceTotal}`;
    budgetSection.append(projectBudget);

    const deadlineSection = document.createElement("div");
    deadlineSection.classList.add("projectCard__deadline");
    card.append(deadlineSection);

    const deadlineIcon = document.createElement("img");
    deadlineIcon.src = API.GetStaticRoute(
      "Components/ProjectCard/resources/deadline.png"
    );
    deadlineSection.append(deadlineIcon);

    const projectDeadline = document.createElement("p");
    projectDeadline.textContent = formatMediumDate(project.timelineDate);
    // projectDeadline.textContent = `${projectTimeData.time} ${projectTimeData.unitOfTime}`;
    deadlineSection.append(projectDeadline);

    const ctaButton = document.createElement("button");
    ctaButton.value = project.projectId;
    ctaButton.onclick = primaryBtn.onclick;
    // ctaButton.addEventListener('click', function (e) {
    //   let value = e.target.value;
    //   return primaryBtn.onclick({
    //     projectId: value
    //   });
    // })
    ctaButton.type = "button";
    ctaButton.classList.add("cta_button");
    ctaButton.textContent = primaryBtn.label;
    card.append(ctaButton);

    return card;
  };

  return {
    Create,
  };
})();

export default ProjectCard;
