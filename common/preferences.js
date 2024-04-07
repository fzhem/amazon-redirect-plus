export { getUserPreferences, savePreferences };

async function getUserPreferences() {
  const result = await browser.storage.local.get([
    "searchEngines",
    "customEngines",
    "selectedEngine",
  ]);
  return {
    searchEngines: result.searchEngines || {},
    customEngines: result.customEngines || {},
    selectedEngine: result.selectedEngine || null,
  };
}

async function savePreferences(
  preferences,
  showAlert = true,
  keysToAppend = []
) {
  try {
    let currentPreferences = preferences;
    if (keysToAppend.length > 0) {
      // Retrieve existing preferences from storage
      const result = await browser.storage.local.get();
      keysToAppend.forEach((key) => {
        if (preferences[key]) {
          currentPreferences[key] = {
            ...result[key],
            ...preferences[key],
          };
        }
      });
    }
    await browser.storage.local.set(currentPreferences);
    console.log("Preferences saved successfully! Refresh any open pages.");
    if (showAlert) {
      alert("Preferences saved successfully! Refresh any open pages.");
    }
  } catch (error) {
    console.error(`Error saving preferences: ${error}`);
    if (showAlert) {
      alert("Error saving preferences. Please try again.");
    }
  }
}
