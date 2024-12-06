/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
function applyPermalinkParameters(wc) {
  const params = new URLSearchParams(window.location.search);

  // Apply fullscreen mode
  if (params.get("fullscreen") === "true") {
    wc.parentElement.removeChild(wc);
    wc.className = "absolute w-full h-full inset-0";
    document.body.appendChild(wc);
    document.body.style = "padding:0;";
  } else {
    const doc = document.querySelectorAll("#doc");
    doc.forEach((d) => {
      return (d.style.display = "block");
    });
  }

  // Apply x,y,z
  if (
    params.get("permalink") === "true" &&
    params.get("x") &&
    params.get("y")
  ) {
    wc.setAttribute("center", `${params.get("x")},${params.get("y")}`);
    params.delete("x");
    params.delete("y");
  }

  if (params.get("permalink") === "true" && params.get("z")) {
    wc.setAttribute("zoom", params.get("z"));
    params.delete("z");
  }

  // Apply all url parameters as attribute of the web component and fill the input fields.
  params.forEach((value, key) => {
    wc.setAttribute(key, value);
    const input = document.querySelector(`[name=${key}]`);
    if (input) {
      if (input.type === "checkbox") {
        input.checked = value !== "false";
      } else {
        input.value = value;
      }
    }
  });

  // Get an apikey if there is none defined
  if (!wc.getAttribute("apikey")) {
    fetch("https://backend.developer.geops.io/publickey")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data && data.success) {
          wc.setAttribute("apikey", data.key);
        }
      });
  }
}

// Generates a HTML table with all attributes of a web component
function generateAttributesTable(wc, attrs) {
  let innerHMTL = `<table class="table-auto w-full" >
    <thead>
      <tr>
        <th class="border px-4 py-2">Name</th>
        <!--th class="border px-4 py-2">Default</th>
        <th class="border px-4 py-2">Description</th-->
        <th class="border px-4 py-2">Value</th>
      </tr>
    </thead>
    <tbody>`;
  innerHMTL += attrs
    .sort()
    .map((key) => {
      return `
    <tr>
      <td class="border px-4 py-2">${key}</td>
      <!--td class="border px-4 py-2"></td>
      <td class="border px-4 py-2"></td-->
      <td class="border px-4 py-2">
      <div class="flex gap-4">
        <input
          type="text"
          class="border"
          name="${key}"
          value="${wc.getAttribute(key) || ""}" />
        <button onclick="document.querySelector('${wc.localName}').setAttribute('${key}', this.previousElementSibling.value);onAttributeUpdate(document.querySelector('${wc.localName}'),this.previousElementSibling.name, this.previousElementSibling.value);">Update</button>
      </div>
        </td>
    </tr>
  `;
    })
    .join("");

  innerHMTL += `</tbody>
  </table>`;
  return innerHMTL;
}

// Generates a code text for the web component
function generateCodeText(
  wc,
  attrs,
  pkgSrc = "https://www.unpkg.com/@geops/mobility-web-component",
) {
  let codeText = "";
  codeText = `&lt;script\n\ttype="module"\n\tsrc="${pkgSrc}"&gt;
&lt;/script&gt;
&lt;${wc.localName}`;

  attrs.forEach((key) => {
    const attributeValue = wc.getAttribute(key);
    const inputValue = document.querySelector(`[name=${key}]`).value;
    if (attributeValue !== null && attributeValue === inputValue) {
      codeText += `\n\t${[key, '"' + wc.getAttribute(key) + '"'].join("=")}`;
    }
  });

  return codeText + `&gt;\n&lt;/${wc.localName}&gt;`;
}

// Generates a HTML table with all events of a web component
function generateEventsTable(wc, events) {
  let innerHMTL = `<table class="table-auto w-full" >
    <thead>
      <tr>
        <th class="border px-4 py-2">Name</th>
        <th class="border px-4 py-2">Last data received</th>
      </tr>
    </thead>
    <tbody>`;
  innerHMTL += events
    .sort()
    .map((key) => {
      wc.addEventListener(key, (event) => {
        document.querySelector(`[name='${key}']`).value = JSON.stringify(
          event,
          undefined,
          4,
        );
      });
      return `
        <tr>
          <td class="border px-4 py-2">${key}</td>
          <td class="border px-4 py-2">
            <div class="flex gap-4">
              <textarea
                type="text"
                class="border w-full h-300"
                style="height:300px;"
                name="${key}"
              ></textarea>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  innerHMTL += `</tbody>
  </table>`;

  return innerHMTL;
}

// Update url on attributes update via inputs
function onAttributeUpdate(wc, key, value) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  wc.setAttribute(key, value);
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
}
