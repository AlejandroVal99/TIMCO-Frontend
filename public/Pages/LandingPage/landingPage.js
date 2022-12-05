import API from "./../../src/TimcoApi.js";

const userTypeModal = document.querySelector("#SelectUserModal");
const userTypeBtn = document.querySelector("#userTypeBtn");

userTypeBtn.addEventListener("click",()=>{
    userTypeModal.classList.remove("hidden");
    
})

if (userTypeModal) {
    // userTypeModal.querySelector(".cancelBtn").addEventListener("click", () => {
    //   userTypeModal.classList.add("hidden");
    // });
  
    userTypeModal.querySelector("#closeModal__btn").addEventListener(
      "click",
      () => {
        console.log("Entro");
        userTypeModal.classList.add("hidden");
      }
    );
  
    userTypeModal.addEventListener("click", (event) => {
      if (event.target != userTypeModal) return;
  
      userTypeModal.classList.add("hidden");
    });
  
 
    };


const landingRegisterRecruiterForm = document.querySelector(".landingPage__registration__form");


if (landingRegisterRecruiterForm) landingRegisterRecruiterForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const newRecruiter = {
        name: e.target[0].value,
        orgName: e.target[1].value,
        email: e.target[2].value,
        password: e.target[3].value,
    }


    API.SignUpRecruiter(newRecruiter);

});