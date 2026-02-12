import { loadSearchEngines } from "/common/load.js";
import { getUserPreferences, savePreferences } from "/common/preferences.js";

const api_namespace = typeof browser !== "undefined" ? browser : chrome;

// Listen for messages from content scripts

api_namespace.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    api_namespace.tabs.create({
      url: api_namespace.runtime.getURL("startup.html"),
    });
  }
});

api_namespace.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPreferences") {
    api_namespace.storage.local.get(null, (result) => {
      sendResponse({ preferences: result });
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
