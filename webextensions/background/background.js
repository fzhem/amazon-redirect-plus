import { loadSearchEngines } from "/common/load.js";
import { getUserPreferences, savePreferences } from "/common/preferences.js";

// Listen for messages from content scripts
browser.runtime.onMessage.addListener(async function (request) {
  if (request.action === "getPreferences") {
    // Retrieve preferences from storage
    const result = await browser.storage.local.get("selectedEngine");
    const preferences = result.selectedEngine || {};
    // Send preferences back to content script
    return { preferences: preferences };
  }
});

// Save default search engine to storage when extension is installed or updated
browser.runtime.onInstalled.addListener(async function () {
  try {
    const engines = await loadSearchEngines();
    const defaultEngine = engines[0]; // Get the first search engine

    let { searchEngines, customEngines, selectedEngine } =
      await getUserPreferences();

    engines.forEach((engine) => {
      if (!searchEngines[engine.name]) {
        searchEngines[engine.name] = engine.url;
      }
    });
    selectedEngine = { [defaultEngine.name]: defaultEngine.url };
    // Save the default engine preference
    await savePreferences({ searchEngines, selectedEngine }, false);
  } catch (error) {
    console.error(`Error loading/searching engines: ${error}`);
  }
});
