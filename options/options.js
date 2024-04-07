import { loadSearchEngines } from "/common/load.js";
import { getUserPreferences, savePreferences } from "/common/preferences.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    let { searchEngines, customEngines, selectedEngine } =
      await getUserPreferences(); // Retrieve user preferences
    const jsonEngines = await loadSearchEngines(); // Load search engines data

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

    populateDropdown(engines, selectedEngineName); // Populate dropdown with search engines
    addStoredEnginesToDropdown({ searchEngines, customEngines }); // Add stored engines to the dropdown
  } catch (error) {
    handleErrors(error); // Handle errors
  }

  document
    .getElementById("search-engine")
    .addEventListener("change", handleSearchEngineChange); // Add event listener for search engine selection change
  document
    .getElementById("search-engines-form")
    .addEventListener("submit", handleFormSubmission); // Add event listener for form submission
});

// async function loadSearchEngines() {
//   const response = await fetch("searchEngines.json");
//   const data = await response.json();
//   return data.engines;
// }

function populateDropdown(engines, selectedEngine) {
  const selectElement = document.getElementById("search-engine");
  let customOptionAdded = false;

  selectElement.innerHTML = ""; // Clear existing options

  engines.forEach((engine) => {
    const option = createOptionElement(engine);
    selectElement.appendChild(option);

    if (engine.name === selectedEngine) {
      option.selected = true;
      customOptionAdded = !engine.name.startsWith("Custom");
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

function isEngineSelected(engine, preferences) {
  return preferences.hasOwnProperty(engine.name);
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

function handleFormSubmission(event) {
  event.preventDefault();
  const selectElement = document.getElementById("search-engine");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedEngine = selectedOption.value;
  const selectedEngineName = selectedOption.textContent;

  const preferences = {
    selectedEngine: selectedEngineName,
  };

  if (selectedEngine === "custom") {
    const customPreferences = getCustomEnginePreferences();
    preferences.customEngines = { ...customPreferences };
    const customSelectedEngineName = Object.keys(preferences.customEngines)[0];
    const customSelectedEngine =
      preferences.customEngines[customSelectedEngineName];
    preferences.selectedEngine = {
      [customSelectedEngineName]: customSelectedEngine,
    };
    savePreferences(preferences, true, ["customEngines"]); // Pass 'customEngines' as an array to indicate appending
  } else {
    preferences.selectedEngine = { [selectedEngineName]: selectedEngine };
    savePreferences(preferences, true);
  }
}

function getCustomEnginePreferences() {
  // Get all options within the select element
  const allOptions = document.querySelectorAll("#search-engine option");

  // Filter out options that start with "Custom"
  const customOptions = Array.from(allOptions).filter((option) => {
    const optionText = option.textContent.trim();
    return optionText.startsWith("Custom");
  });

  // Initialize an array to store the integer suffixes of existing custom options
  const suffixes = customOptions.map((option) => {
    const optionText = option.textContent.trim();
    return parseInt(optionText.replace("Custom", ""));
  });

  let suffixesNaNReplaced = suffixes.map(function (item) {
    return isNaN(item) ? 0 : item;
  });
  // Find the maximum integer value among the suffixes
  const maxSuffix = Math.max(...suffixesNaNReplaced);

  // Increment the max suffix for the next Custom option
  const nextCustomName = "Custom" + (maxSuffix + 1);

  // Get the custom name and url from the input fields
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

  // Add engines from the searchEngines object
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

  // Add engines from the customEngines object
  Object.entries(preferences.customEngines).forEach(([name, url]) => {
    if (!existingOptions.includes(url)) {
      const option = createOptionElement({ name, url });
      selectElement.appendChild(option);
    } else {
      const existingOption = Array.from(selectElement.options).find(
        (option) => option.textContent === name // Check if the name matches
      );
      if (existingOption) {
        existingOption.textContent = name;
      }
    }
  });
}

function handleErrors(error) {
  console.error(`Error: ${error}`);
  alert(`Error: ${error}`);
}
