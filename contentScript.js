// contentScript.js

// Function to find the product title
function findTitle() {
  return document.querySelector(
    "div#centerCol, div#dp.ce_mobile, div#productTitleGroupAnchor"
  );
}

// Function to check if the current page URL matches the specified format
function isProductPage() {
  return /\/dp\/[A-Z0-9]{10}/.test(window.location.href);
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

// Function to create the widget and its components
function createWidget() {
  if (!isProductPage()) return; // Exit if not a product page
  const productTitle = findTitle();
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

  if (!productTitle) {
    if (centerTable !== null) {
      centerTable.parentElement.insertBefore(widget, centerTable);
    } else if (dogsofAmazonLink !== null) {
      const parentElement = dogsofAmazonLink.parentElement;
      parentElement.parentNode.insertBefore(widget, parentElement);
    }
  } else {
    productTitle.prepend(widget);
  }
}

// Call the function to create the widget
document.addEventListener("DOMContentLoaded", createWidget());
