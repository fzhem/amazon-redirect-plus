import { loadSearchEngines } from "/common/load.js";
import { getUserPreferences, savePreferences } from "/common/preferences.js";
import "/common/amazonFronts.js"; // provides globalThis.getamazonFronts

document.addEventListener("DOMContentLoaded", async function () {
  try {
    let { searchEngines, customEngines, selectedEngine, homeStore } =
      await getUserPreferences();

    const jsonEngines = await loadSearchEngines();

    // Update searchEngines object with engines from the JSON file
    jsonEngines.forEach((engine) => {
      if (!searchEngines[engine.name]) {
        searchEngines[engine.name] = engine.url;
      }
    });

    // Set selectedEngine to the first key-value pair of searchEngines if it's empty
    if (!selectedEngine && Object.keys(searchEngines).length > 0) {
      const firstEngineName = Object.keys(searchEngines)[0];
      selectedEngine = { [firstEngineName]: searchEngines[firstEngineName] };
    }

    const engines = [
      ...jsonEngines,
      ...Object.entries(customEngines).map(([name, url]) => ({ name, url })),
    ];

    const selectedEngineName = Object.keys(selectedEngine)[0];

    populateDropdown(engines, selectedEngineName);
    addStoredEnginesToDropdown({ searchEngines, customEngines });

    // ---- HOME STORE DROPDOWN ----
    const amazonFronts = globalThis.getamazonFronts || [];
    let selectedHomeStoreHost = "domain"; // default should be current domain

    if (homeStore && typeof homeStore === "object") {
      selectedHomeStoreHost = Object.values(homeStore)[0] || "domain";
    } else if (typeof homeStore === "string") {
      selectedHomeStoreHost = homeStore;
    }

    populateHomeStoreDropdown(amazonFronts, selectedHomeStoreHost);

    updateGoButtonInfoBoxState();
  } catch (error) {
    handleErrors(error);
  }

  document
    .getElementById("search-engine")
    .addEventListener("change", handleSearchEngineChange);

  document
    .getElementById("home-store")
    .addEventListener("change", updateGoButtonInfoBoxState);
  document
    .getElementById("search-engines-form")
    .addEventListener("submit", handleFormSubmission);
});

function populateDropdown(engines, selectedEngine) {
  const selectElement = document.getElementById("search-engine");

  selectElement.innerHTML = "";

  engines.forEach((engine) => {
    const option = createOptionElement(engine);
    selectElement.appendChild(option);

    if (engine.name === selectedEngine) {
      option.selected = true;
    }
  });

  removeCustomOption(selectElement);
  addCustomOption(selectElement);
}

function createOptionElement(engine) {
  const option = document.createElement("option");
  option.value = engine.url;
  option.textContent = engine.name;
  return option;
}

function removeCustomOption(selectElement) {
  const customOptions = selectElement.querySelectorAll(
    'option[value="custom"]'
  );
  customOptions.forEach((option) => option.remove());
}

function addCustomOption(selectElement) {
  const customOption = createOptionElement({ name: "Custom", url: "custom" });
  selectElement.appendChild(customOption);
}

function handleSearchEngineChange() {
  const selectElement = document.getElementById("search-engine");
  const selectedValue =
    selectElement.options[selectElement.selectedIndex].value;

  document.getElementById("custom-options").style.display =
    selectedValue === "custom" ? "block" : "none";
}

function updateGoButtonInfoBoxState() {
  const homeStoreSelect = document.getElementById("home-store");
  const infoBox = document.getElementById("go-button-info");

  if (homeStoreSelect.value === "domain") {
    infoBox.textContent =
      "ℹ️ No home store selected. You will see a dropdown on Amazon stores.";
  } else {
    infoBox.textContent =
      "ℹ️ Home store selected. You will see a 'Go to' button for your home store.";
  }
}

function handleFormSubmission(event) {
  event.preventDefault();

  const preferences = {};

  const selectElement = document.getElementById("search-engine");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedEngine = selectedOption.value;
  const selectedEngineName = selectedOption.textContent;

  // ---- HOME STORE SAVE ----
  const homeStoreSelect = document.getElementById("home-store");
  const homeStoreOption =
    homeStoreSelect.options[homeStoreSelect.selectedIndex];

  const homeStoreValue = homeStoreOption.value;
  const homeStoreName = homeStoreOption.textContent;


  if (homeStoreValue === "domain") {
    preferences.homeStore = { "🌍 Current Domain": "domain" };
  } else {
    preferences.homeStore = { [homeStoreName]: homeStoreValue };
  }


  if (selectedEngine === "custom") {
    const customPreferences = getCustomEnginePreferences();

    preferences.customEngines = { ...customPreferences };

    const customSelectedEngineName = Object.keys(preferences.customEngines)[0];
    const customSelectedEngine =
      preferences.customEngines[customSelectedEngineName];

    preferences.selectedEngine = {
      [customSelectedEngineName]: customSelectedEngine,
    };

    savePreferences(preferences, true, ["customEngines"]);
  } else {
    preferences.selectedEngine = { [selectedEngineName]: selectedEngine };
    savePreferences(preferences, true);
  }
}

function getCustomEnginePreferences() {
  const allOptions = document.querySelectorAll("#search-engine option");

  const customOptions = Array.from(allOptions).filter((option) => {
    const optionText = option.textContent.trim();
    return optionText.startsWith("Custom");
  });

  const suffixes = customOptions.map((option) => {
    const optionText = option.textContent.trim();
    return parseInt(optionText.replace("Custom", ""));
  });

  let suffixesNaNReplaced = suffixes.map(function (item) {
    return isNaN(item) ? 0 : item;
  });

  const maxSuffix = Math.max(...suffixesNaNReplaced);
  const nextCustomName = "Custom" + (maxSuffix + 1);

  const customName =
    document.getElementById("custom-name").value || nextCustomName;

  const customUrl = document.getElementById("custom-url").value;

  return { [customName]: customUrl };
}

function addStoredEnginesToDropdown(preferences) {
  const selectElement = document.getElementById("search-engine");
  const existingOptions = Array.from(selectElement.options).map(
    (option) => option.value
  );

  Object.entries(preferences.searchEngines).forEach(([name, url]) => {
    if (!existingOptions.includes(url)) {
      const option = createOptionElement({ name, url });
      selectElement.appendChild(option);
    } else {
      const existingOption = Array.from(selectElement.options).find(
        (option) => option.value === url
      );
      if (existingOption) {
        existingOption.textContent = name;
      }
    }
  });

  Object.entries(preferences.customEngines).forEach(([name, url]) => {
    if (!existingOptions.includes(url)) {
      const option = createOptionElement({ name, url });
      selectElement.appendChild(option);
    } else {
      const existingOption = Array.from(selectElement.options).find(
        (option) => option.textContent === name
      );
      if (existingOption) {
        existingOption.textContent = name;
      }
    }
  });
}

// ---- HOME STORE DROPDOWN ----
function populateHomeStoreDropdown(amazonFronts, selectedHost) {
  const selectElement = document.getElementById("home-store");
  selectElement.innerHTML = "";

  // Add special "domain" option
  const domainOption = document.createElement("option");
  domainOption.value = "domain";
  domainOption.textContent = "🌍 Current Domain";
  selectElement.appendChild(domainOption);

  // Add amazon fronts
  amazonFronts.forEach((front) => {
    const option = document.createElement("option");
    option.value = front.hostname;
    option.textContent = front.name;
    selectElement.appendChild(option);
  });

  selectElement.value = selectedHost || "domain";
}

function handleErrors(error) {
  console.error(`Error: ${error}`);
  alert(`Error: ${error}`);
}
