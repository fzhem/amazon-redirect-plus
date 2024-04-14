function findPlacementForWidget() {
  // the last two selectors are for mobile devices
  return document.querySelector(
    "#centerCol, #dp.ce_mobile, #productTitleGroupAnchor"
  );
}

// Function to find the product title
function productTitle() {
  return document.querySelector(
    "span#productTitle, span#title, #title_feature_div "
  ).innerText;
}

function productRegex() {
  // what's gp/dp?: https://401stblow.wordpress.com/2010/06/26/amazon-associates-links-made-simple/
  return /\/(dp|gp\/product)\/([A-Z0-9]{10})/;
}

// Function to check if the current page URL matches the specified format
function isProductPage() {
  // gp/product is older links?
  return productRegex().test(window.location.href);
}

function findoutOfStock() {
  // second selector is for mobile devices
  return document.querySelector(
    "#outOfStock, #pwAvailabilityExclusion_feature_div"
  );
}

// For placing the search butotn
function findbuybox() {
  // last two selectors are for mobile devices
  // #rightCol is easier to work with
  return document.querySelector("#buybox, #availability_feature_div");
}

function getAsin() {
  return window.location.href.match(productRegex()).at(-1);
}

function getgeneralProductOrDetailProduct() {
  return window.location.href.match(productRegex()).at(1);
}

function redirectionUrl(selectedFront) {
  const generalProductOrDetailProduct = getgeneralProductOrDetailProduct();
  const asin = getAsin();
  return `https://${selectedFront}/${generalProductOrDetailProduct}/${asin}`;
}

// Function to handle the redirection based on the selected option
function handleRedirection(selectedFront) {
  return function () {
    window.location.href = redirectionUrl(selectedFront);
  };
}

function findItemModelNumberFromProductDetailsList() {
  const ulElements = document.querySelectorAll(
    "#detailBullets_feature_div > ul, #detailBullets_secondary_view_div > div > ul"
  );
  for (const ulElement of ulElements) {
    const listItems = ulElement.querySelectorAll("li");
    for (const listItem of listItems) {
      const text = listItem.innerText;
      const regex = /Item\s*model\s*number\s*:\s*(.+)/i;
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  return null;
}

// Function to get Model Number/Part Number
function findModelNumberFromProdDetails() {
  const technicalSpecificationsSection = document.querySelector(
    "#technicalSpecifications_feature_div, #prodDetails, #productSpecifications, #productDetails_techSpec_sections"
  );
  if (technicalSpecificationsSection) {
    const tableRows = technicalSpecificationsSection.querySelectorAll("tr");
    let itemModelNumber = "";
    let modelNumber = "";
    let partNumber = "";
    tableRows.forEach((row) => {
      const th = row.querySelector("th");
      if (
        th &&
        th.textContent.trim().toLowerCase().includes("item model number")
      ) {
        const td = row.querySelector("td");
        if (td) {
          itemModelNumber = td.textContent.trim();
        }
      }
      if (th && th.textContent.trim().toLowerCase().includes("model number")) {
        const td = row.querySelector("td");
        if (td) {
          modelNumber = td.textContent.trim();
        }
      }
      if (th && th.textContent.trim().toLowerCase().includes("part number")) {
        const td = row.querySelector("td");
        if (td) {
          partNumber = td.textContent.trim();
        }
      }
    });
    return itemModelNumber || partNumber || modelNumber || null;
  }
  return null;
}

// Function to create the widget container
function createWidgetContainer() {
  const widget = document.createElement("div");
  widget.id = "amazonFrontWidget";
  widget.style.backgroundColor = "#ffffff";
  widget.style.display = "flex";
  widget.style.alignItems = "center";
  widget.style.justifyContent = "center"; // Center the widget content
  return widget;
}

// Function to create the dropdown menu
function createDropdownMenu(amazonFronts) {
  const dropdown = document.createElement("select");
  dropdown.style.padding = "4px";
  dropdown.style.marginRight = "1px";
  amazonFronts.forEach((front) => {
    const option = createDropdownOption(front);
    dropdown.appendChild(option);
  });

  // Set selected option based on current hostname
  const currentHostname = window.location.hostname;
  const selectedOption = dropdown.querySelector(
    `option[value="${currentHostname}"]`
  );
  if (selectedOption) {
    selectedOption.selected = true;
  }

  dropdown.addEventListener("change", function () {
    handleRedirection(dropdown.value)();
  });
  return dropdown;
}

// Function to create an option element for the dropdown menu
function createDropdownOption(front) {
  const option = document.createElement("option");
  option.textContent = front.name;
  option.value = front.hostname;
  return option;
}

// Function to create the widget and its components
function createWidget(amazonFronts) {
  if (!isProductPage()) return null; // Exit if not a product page
  const placementForWidget = findPlacementForWidget();
  const centerTable = document.querySelector("center > table");
  const divG = document.getElementById("g");
  const dogsofAmazonLink = divG
    ? divG.querySelector('a[href="/"], a[href="/dogsofamazon"]')
    : null;

  const widget = createWidgetContainer();

  const dropdown = createDropdownMenu(amazonFronts);

  widget.appendChild(dropdown);

  // if we can't find the selectors indicating a live product page it's most likely a 404 page
  if (!placementForWidget) {
    if (centerTable !== null) {
      centerTable.parentElement.insertBefore(widget, centerTable);
    } else if (dogsofAmazonLink !== null) {
      const parentElement = dogsofAmazonLink.parentElement;
      parentElement.parentNode.insertBefore(widget, parentElement);
    }
  } else {
    placementForWidget.prepend(widget);
  }
}

// Function to create the Google search button
function createSearchButton(modelNumber, preferredEngine, searchUrl) {
  const button = document.createElement("button");
  button.textContent = "Search " + preferredEngine;
  button.title = "Search for the product on " + preferredEngine;
  button.style.padding = "6px 12px";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => {
    const searchQuery = encodeURIComponent(modelNumber);
    const finalSearchUrl = searchUrl.replace("%s", `"${searchQuery}"`);
    window.open(finalSearchUrl, "_blank");
  });
  return button;
}

// Function to request the preferred search engine from the background script
async function requestPreferredSearchEngine() {
  return browser.runtime.sendMessage({ action: "getPreferences" });
}

// Function to handle the response from the background script
async function handlePreferredSearchEngineResponse(response) {
  if (response) {
    const preferences = response.preferences;
    const preferredEngine = Object.keys(preferences)[0];
    const searchUrl = preferences[preferredEngine];
    const outOfStockElement = findoutOfStock();
    // #rightCol works the best on desktop
    const buyboxElement = document.querySelector('#rightCol') || findbuybox();
    if (outOfStockElement) {
      const itemModelNumber =
        findItemModelNumberFromProductDetailsList() ||
        findModelNumberFromProdDetails() ||
        productTitle();
      if (itemModelNumber) {
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.marginTop = "5px";
        const searchButton = createSearchButton(
          itemModelNumber,
          preferredEngine,
          searchUrl
        );
        buttonContainer.appendChild(searchButton);
        buyboxElement.after(buttonContainer);
      }
    }
  }
}

async function init() {
  const amazonFronts = globalThis.getamazonFronts;
  createWidget(amazonFronts);
  const response = await requestPreferredSearchEngine();
  await handlePreferredSearchEngineResponse(response);
}

init();