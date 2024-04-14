function createWarehouseButtonContainer() {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "warehouseButtonContainer";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.marginBottom = "5px";
  return buttonContainer;
}

function createWarehouseButton(selectedFront) {
  const checkWarehouseButton = document.createElement("button");
  checkWarehouseButton.id = "warehouseButton";
  checkWarehouseButton.textContent = "Check Warehouse";
  checkWarehouseButton.title = "Check for warehouse deals";
  checkWarehouseButton.style.padding = "6px 12px";
  checkWarehouseButton.style.fontSize = "14px";
  checkWarehouseButton.style.cursor = "pointer";

  const warehouseIdPath = `/?m=${selectedFront.warehouseId}`;

  if (window.location.href.includes(warehouseIdPath)) {
    // If it does, return null to indicate that the button should not be created
    checkWarehouseButton.textContent = "Check Main Store";
    checkWarehouseButton.title = "Go back to main store";
    checkWarehouseButton.addEventListener("click", () => {
      const redirectUrl = redirectionUrl(selectedFront.hostname);
      window.open(redirectUrl, "_blank");
    });
    return checkWarehouseButton;
  }

  checkWarehouseButton.addEventListener("click", () => {
    const redirectUrl =
      redirectionUrl(selectedFront.hostname) +
      `/?m=${selectedFront.warehouseId}`;
    window.open(redirectUrl, "_blank");
  });

  return checkWarehouseButton;
}

async function handleWarehouseButton(selectedFront) {
  if (!selectedFront.warehouseId) return null;
  const warehouseButtonContainer = createWarehouseButtonContainer();
  const warehouseButton = createWarehouseButton(selectedFront);

  if (warehouseButton) {
    warehouseButtonContainer.appendChild(warehouseButton);

    // Check for placement for the button
    const desktopPlacementForButton = document.querySelector("#rightCol");

    if (desktopPlacementForButton) {
      desktopPlacementForButton.prepend(warehouseButtonContainer);
    } else {
      const buyboxElement = findbuybox();
      if (buyboxElement) {
        buyboxElement.before(warehouseButtonContainer);
      }
    }
  }
}

// You would need to define findPlacementForButton function according to your specific requirements

const amazonFronts = globalThis.getamazonFronts;
const currentHostname = window.location.hostname;
const selectedFront = amazonFronts.find(
  (front) => front.hostname === currentHostname
);
let previousUrl = "";
let observer = new MutationObserver(function (mutations) {
  if (window.location.href !== previousUrl) {
    previousUrl = location.href;
    const previousButtonContainer = document.getElementById(
      "warehouseButtonContainer"
    );
    if (previousButtonContainer) {
      previousButtonContainer.remove();
    }
    handleWarehouseButton(selectedFront);
  }
});

const config = { attributes: true, childList: true, subtree: true };
observer.observe(document, config);
