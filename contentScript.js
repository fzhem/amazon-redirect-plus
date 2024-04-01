// contentScript.js

// Function to find the product title
function findPlacementForWidget() {
  // the last two selectors are for mobile devices
  return document.querySelector(
    "div#centerCol, div#dp.ce_mobile, div#productTitleGroupAnchor"
  );
}

function productTitle() {
  return document.querySelector("span#productTitle").innerText;
}

// Function to check if the current page URL matches the specified format
function isProductPage() {
  return /\/dp\/[A-Z0-9]{10}/.test(window.location.href);
}

function findoutOfStock() {
  // second selector is for mobile devices
  return document.querySelector(
    "div#outOfStock, div#pwAvailabilityExclusion_feature_div"
  );
}

function findbuybox() {
  // second selector is for mobile devices
  return document.querySelector(
    "div#buybox, div#pwAvailabilityExclusion_feature_div"
  );
}

// Function to check if the current page URL matches the specified format
function isProductPage() {
  return /\/dp\/[A-Z0-9]{10}/.test(window.location.href);
}

function findItemModelNumberFromProductDetailsList() {
  const ulElements = document.querySelectorAll(
    "#detailBullets_feature_div > ul"
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
    "#technicalSpecifications_feature_div, #prodDetails"
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
  return dropdown;
}

// Function to create an option element for the dropdown menu
function createDropdownOption(front) {
  const option = document.createElement("option");
  option.textContent = front.name;
  option.value = front.hostname;
  return option;
}

// Function to create the button element
function createButton() {
  const button = document.createElement("button");
  button.textContent = ">";
  button.title = "Go to Other Amazon Front";
  button.style.padding = "8px 8px";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";
  return button;
}

// Function to handle the button click event
function handleButtonClick(dropdown) {
  return function () {
    const selectedHostname = dropdown.value;
    const asin = window.location.href.match(/\/dp\/([A-Z0-9]{10})/)[1];
    const redirectUrl = `https://${selectedHostname}/dp/${asin}/`;
    window.location.href = redirectUrl;
  };
}

function createGoogleSearchButton(modelNumber) {
  const button = document.createElement("button");
  button.textContent = "Search on Google";
  button.title = "Search for the product on Google";
  button.style.padding = "6px 12px";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => {
    const searchUrl = `https://www.google.com/search?q="${modelNumber}"`;
    window.open(searchUrl, "_blank");
  });
  return button;
}

function addGoogleSearch() {
  const outOfStockElement = findoutOfStock();
  if (outOfStockElement) {
    const buyboxElement = findbuybox();
    if (buyboxElement) {
      // it's difficult to scrape model number on non-english pages, hence using the product title instead
      // Also if there is no number specified we fallback to the product title
      const itemModelNumber =
        findItemModelNumberFromProductDetailsList() ||
        findModelNumberFromProdDetails() ||
        productTitle();
      if (itemModelNumber) {
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.marginTop = "5px";
        const googleSearchButton = createGoogleSearchButton(itemModelNumber);
        buttonContainer.appendChild(googleSearchButton);
        buyboxElement.after(buttonContainer);
      }
    }
  }
}

// Function to create the widget and its components
function createWidget() {
  if (!isProductPage()) return; // Exit if not a product page
  const placementForWidget = findPlacementForWidget();
  const amazonFronts = [
    { name: "🇨🇦 CA", hostname: "www.amazon.ca" },
    { name: "🇯🇵 CO.JP", hostname: "www.amazon.co.jp" },
    { name: "🇬🇧 CO.UK", hostname: "www.amazon.co.uk" },
    { name: "🇺🇸 COM", hostname: "www.amazon.com" },
    { name: "🇦🇺 COM.AU", hostname: "www.amazon.com.au" },
    { name: "🇧🇷 COM.BR", hostname: "www.amazon.com.br" },
    { name: "🇲🇽 COM.MX", hostname: "www.amazon.com.mx" },
    { name: "🇩🇪 DE", hostname: "www.amazon.de" },
    { name: "🇪🇸 ES", hostname: "www.amazon.es" },
    { name: "🇫🇷 FR", hostname: "www.amazon.fr" },
    { name: "🇮🇳 IN", hostname: "www.amazon.in" },
    { name: "🇮🇹 IT", hostname: "www.amazon.it" },
    { name: "🇳🇱 NL", hostname: "www.amazon.nl" },
    { name: "🇸🇪 SE", hostname: "www.amazon.se" },
    { name: "🇸🇬 SG", hostname: "www.amazon.sg" },
  ];
  const centerTable = document.querySelector("center > table");
  const divG = document.getElementById("g");
  const dogsofAmazonLink = divG
    ? divG.querySelector('a[href="/"], a[href="/dogsofamazon"]')
    : null;

  const widget = createWidgetContainer();

  const dropdown = createDropdownMenu(amazonFronts);

  const button = createButton();
  button.addEventListener("click", handleButtonClick(dropdown));

  widget.appendChild(dropdown);
  widget.appendChild(button);

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

// Call the function to create the widget
document.addEventListener("DOMContentLoaded", createWidget());
document.addEventListener("DOMContentLoaded", addGoogleSearch());
