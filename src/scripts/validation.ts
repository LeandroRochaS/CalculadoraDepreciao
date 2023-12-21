export function validaInputs() {
  console.log("validaInputs");
  const inputs = document.querySelectorAll("input");
  const select = document.querySelectorAll("select");

  const campos = [...inputs, ...select];

  campos.forEach((input) => {
    if (input.value === "" || input.value == null || input.value == "0") {
      input.style.border = "1px solid red";
    } else {
      input.style.border = "1px solid green";
    }
  });
}
