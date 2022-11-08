document.querySelectorAll(".currencyInput").forEach(input => {
    let inputNumber;
    let inputSlider;
    let min = 0;
    let max = Number.MAX_SAFE_INTEGER;

    inputNumber = input.querySelector('input[type="number"]');
    inputSlider = input.querySelector('input[type="range"]');


    min = Number(inputNumber.getAttribute("min"));
    max = Number(inputNumber.getAttribute("max"));

    inputSlider.setAttribute("min", min.toString());
    inputSlider.setAttribute("max", max.toString());


    inputNumber.addEventListener('change', e => {

        inputSlider.value = inputNumber.value;
        inputNumber.value = inputNumber.value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    })

    inputSlider.addEventListener('input', e => {

        inputNumber.value = inputSlider.value;
    })
})