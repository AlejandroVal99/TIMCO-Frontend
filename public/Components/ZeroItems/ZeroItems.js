import enums from "../../src/utils/enums.js";

const ZeroItems = (() => {
  const CreateZeroItemsCard = ({
    label = "proyectos",
    state = 1,
    showState = true,
  }) => {
    let card = document.querySelector(".zeroItemsCard");
    if (card === null) {
      card = document.createElement("p");
      card.classList.add("zeroItemsCard");
    }

    showState
      ? (card.textContent = `No hay ${label} ${enums.pluralStates[state]}`)
      : (card.textContent = `Aún no hay ${label}`);

    return card;
  };

  return {
    CreateZeroItemsCard,
  };
})();

export default ZeroItems;
