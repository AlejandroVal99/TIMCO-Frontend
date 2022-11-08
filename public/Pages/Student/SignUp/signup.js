import API from "./../../../src/TimcoApi.js";

document.querySelector(".login__form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newStudent = {
    name: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value,
    phone: null,
    career: "Desing",
    currentSemester: 1,
    aboutMe: "This is America",
    profileImage: null,
    universityId: 1,
    areaId: 1,
  };

  const res = await AttemptRegistration(newStudent);
  if (res.status === "error") {
    console.error(res.message);
    let inputEmail = document.getElementById("recruiterEmail");
    let labelEmail = document.getElementById("create-student-email-label");
    switch (res.message) {
      case "create/email-student-exists":
        let errEmailExistEle = document.getElementById("email-exists-err");
        errEmailExistEle.style.display = "block";
        errEmailExistEle.style.color = "red";
        labelEmail.style.color = "red";
        inputEmail.style.borderColor = "red";
        break;
      default:
        break;
    }
  }
});

const AttemptRegistration = (student) => {
  return API.SignUpStudent(student);
};
