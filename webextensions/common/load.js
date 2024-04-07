export { loadSearchEngines };

async function loadSearchEngines() {
  const response = await fetch(browser.runtime.getURL("/common/searchEngines.json"));
  const data = await response.json();
  return data.engines;
}
