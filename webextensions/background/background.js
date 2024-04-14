import { loadSearchEngines } from "/common/load.js";
import { getUserPreferences, savePreferences } from "/common/preferences.js";

const api_namespace = typeof browser !== "undefined" ? browser : chrome;

// Listen for messages from content scripts

api_namespace.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.action === "getPreferences") {
    // Retrieve preferences from storage
    api_namespace.storage.local.get("selectedEngine", function (result) {
      const preferences = result.selectedEngine || {};
      // Send preferences back to content script
      sendResponse({ preferences: preferences });
    });
    return true;
  }
});

// Save default search engine to storage when extension is installed or updated
api_namespace.runtime.onInstalled.addListener(async function () {
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
