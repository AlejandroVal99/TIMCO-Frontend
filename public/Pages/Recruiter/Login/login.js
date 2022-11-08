import API from "./../../../src/TimcoApi.js";
console.log("Existo");
document.querySelector(".login__form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const recruiter = {
    email: e.target[0].value,
    password: e.target[1].value,
  };
  const res = await AttemptLogin(recruiter);
  if (res.status === "error") {
    console.error(res.message);

    switch (res.message) {
      case "auth/company-not-found" || "auth/invalid-password":
        activeFeedbackMessage();
        break;

      case "auth/invalid-password":
        activeFeedbackMessage();
        break;
      default:
        break;
    }
  }
});
const activeFeedbackMessage = () => {
  let inputEmail = document.getElementById("recruiterEmail");
  let inputPassword = document.getElementById("recruiterPassword");

  let labelEmail = document.getElementById("login-recruiter-email-label");
  let labelPassword = document.getElementById("login-recruiter-password-label");

  let errEmailWrong = document.getElementById("email-password-error");
  errEmailWrong.style.display = "block";
  errEmailWrong.style.color = "red";
  labelEmail.style.color = "red";
  inputEmail.style.borderColor = "red";
  labelPassword.style.color = "red";
  inputPassword.style.borderColor = "red";
};
const AttemptLogin = (recruiter) => {
  return API.LogInRecruiter(recruiter);
};
