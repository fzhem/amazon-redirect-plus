export { loadSearchEngines };

const api_namespace = typeof browser !== 'undefined' ? browser : chrome;

async function loadSearchEngines() {
  const response = await fetch(api_namespace.runtime.getURL("/common/searchEngines.json"));
  const data = await response.json();
  return data.engines;
}
