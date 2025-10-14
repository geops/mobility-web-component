/**
 * Return an url as a string from a template and a list of parameters.
 * Example:
 * template: "https://example.com/{{z}}/{{x}}/{{y}}.png"
 * params: {z: "10", x: "512", y: "512"}
 * return: "https://example.com/10/512/512.png"
 *
 * If a parameter is missing, the template is not replaced.
 *
 * @param template - The url template containing parameters in the form {{param}}
 * @param params - An object containing the parameters to replace in the template
 * @returns The url with the parameters replaced
 */
function getUrlFromTemplate(template: string, params: URLSearchParams): string {
  let tpl = template || "";
  params?.forEach((value, key) => {
    tpl = tpl.replace(`{{${key}}}`, value);
  });
  if (tpl.startsWith("#")) {
    tpl = `${window.location.href.split("#")[0]}${tpl}`;
  } else if (tpl.startsWith("?") || !tpl) {
    const existingParams = new URLSearchParams(window.location.search);

    // Set current values of the template parameters
    const tplParams = new URLSearchParams(tpl);
    tplParams.forEach((value, key) => {
      existingParams.set(key, value);
    });

    // Remove duplicated parameters if the template already includes them
    if (template?.includes("{{x}}") && template?.includes("{{y}}")) {
      existingParams.delete("center");
    }
    if (template?.includes("{{z}}")) {
      existingParams.delete("zoom");
    }

    let str = existingParams.toString();
    if (!str.startsWith("?") && tpl.length) {
      str = `?${str}`;
    }
    tpl = `${window.location.href.split("?")[0]}${str}${window.location.hash}`;
  }
  return tpl;
}

export default getUrlFromTemplate;
