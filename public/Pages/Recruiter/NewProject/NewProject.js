import API from "../../../src/TimcoApi.js";
import parseJwt from "../../../src/utils/parseJWT.js";
import currencyFormatter from "../../../src/utils/currencyHelper.js";
const companyData = localStorage.getItem("loggedRecruiter");

console.log("Go")

document
  .querySelectorAll('input[type="date"]')
  .forEach((input) => (input.min = new Date().toISOString().split("T")[0]));

const project = {};

const form = {};

const screens = [];

const projectNameHTML = document.querySelector("#summary_projectName");
const projectBudgetHTML = document.querySelector("#summary_projectBudget");
const projectDeadlineHTML = document.querySelector("#summary_projectDeadline");
const minPriceRangeP= document.querySelector("#minPriceRange");
const sliderPriceP = document.querySelector('#projectBudget');
const sliderPriceInput = document.querySelector('#projectBudgetInput');



console.log(sliderPriceInput);

const studentSemesterRadio = document.querySelectorAll("#studentSemester");

studentSemesterRadio.forEach((e)=>{

  e.addEventListener("click", (change)=>{
    console.log("TARGET", change.target.value);
    switch (change.target.value){
        case "5to7":
        console.log("5 a 7");
        minPriceRangeP.innerHTML = "$100.000";
        sliderPriceP.min=100000;
        sliderPriceInput.min = 100000;
        break;

        case "7to9":
            console.log("7 a 9");
       
            minPriceRangeP.innerHTML = "$300.000";
            sliderPriceP.min=300000;
            sliderPriceInput.min=300000;
        break;

        default:
          console.log("Both");
       
          minPriceRangeP.innerHTML = "$500.000";
          sliderPriceP.min=500000;
          sliderPriceInput.min=500000;
        break;

    }

})
});


console.log(studentSemesterRadio);



document.querySelectorAll(".top__tab__navbar>button").forEach((button, key) => {
  button.addEventListener("click", () => {
    SetCurrentScreen(key);
  });
});

document.querySelectorAll(".details").forEach((screen, key) => {
  screens.push(screen);
  form[key] = [];

  screen.querySelectorAll(".details__forms").forEach((section) => {
    form[key].push(section);

    const formInSection = section.querySelector(".details__forms__form");
    if (formInSection)
      formInSection.addEventListener("submit", (e) => {
        e.preventDefault();

        [...e.target.elements].forEach((element) => {
          if (element.name && element.value) {
            project[element.name] = element.value;
          }
        });
        FillProjectSummary();
        NextSection();
      });
  });
});

let currentScreen = 0;
let currentSection = 0;

const SetCurrentScreen = (value) => {
  screens[currentScreen].classList.add("hidden");

  currentScreen = value;
  if (form[currentScreen])
    currentSection = form[currentScreen].findIndex(
      (section) => !section.classList.contains("hidden")
    );

  let nextScreen = screens[currentScreen];

  if (nextScreen) {
    screens[currentScreen].classList.remove("hidden");
  } else FinishForm();
};

const NextSection = () => {
  form[currentScreen][currentSection].classList.add("hidden");
  currentSection++;

  let nextSection = form[currentScreen][currentSection];

  if (nextSection) nextSection.classList.remove("hidden");
  else {
    form[currentScreen][currentSection - 1].classList.remove("hidden");
    SetCurrentScreen(currentScreen + 1);
  }
};

window.PreviousSection = () => {
  form[currentScreen][currentSection].classList.add("hidden");
  
  currentSection--;

  let nextSection = form[currentScreen][currentSection];

  if (nextSection) nextSection.classList.remove("hidden");
  else {
    form[currentScreen][currentSection + 1].classList.remove("hidden");
    SetCurrentScreen(currentScreen - 1);
  }
};

const FinishForm = async () => {

  project.stateId = 1;
  const token = localStorage.getItem("token");
  const currentUser = parseJwt(token);
  project.companyId = currentUser.data.companyId;
  console.log(project);
 await API.createProject(project, token);
 API.GoToRecruiterDashboardNewProject();
};

const FillProjectSummary = () => {
  if (project.name && projectNameHTML)
    projectNameHTML.textContent = project.name;
  if (project.priceTotal && projectBudgetHTML)
    projectBudgetHTML.textContent = currencyFormatter(project.priceTotal);
  if (project.timelineDate && projectDeadlineHTML)
    projectDeadlineHTML.textContent = project.timelineDate;
}; //Closes FillProjecSummary method

