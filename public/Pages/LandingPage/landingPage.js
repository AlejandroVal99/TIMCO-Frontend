import API from "./../../src/TimcoApi.js";



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