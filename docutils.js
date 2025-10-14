const activateAttrUrlParameters = true;

function onLoad(wc, attributes, events, pkgSrc) {
  /* Show private attributes for dev purpose */
  const showPrivate =
    new URLSearchParams(window.location.search).get("private") === "true";

  /* Attributes */
  const attrs = Object.keys(attributes);
  const booleanAttrs = Object.entries(attributes)
    .filter(([, attr]) => attr.type === "boolean")
    .map(([key]) => key);
  const booleanTrueByDefault = booleanAttrs.filter(
    (key) => attributes[key].defaultValue === "true",
  );
  const reloadAttrs = Object.entries(attributes)
    .filter(([key, attr]) => !!attr.reload)
    .map(([key]) => key);

  const descriptionByAttr = Object.entries(attributes)
    .filter(([key, attr]) => {
      if (showPrivate) {
        return true;
      }
      return attr.public;
    })
    .reduce((acc, [key, attr]) => {
      acc[key] = attr.description;
      return acc;
    }, {});

  const defaultValueByAttr = Object.entries(attributes).reduce(
    (acc, [key, attr]) => {
      acc[key] = attr.defaultValue;
      return acc;
    },
    {},
  );

  /* Events */
  const evts = Object.keys(events);
  const descriptionByEvent = Object.entries(events)
    .filter(([key, attr]) => {
      if (showPrivate) {
        return true;
      }
      return attr.public;
    })
    .reduce((acc, [key, attr]) => {
      acc[key] = attr.description;
      return acc;
    }, {});

  /* Build HTML */
  const attrsContent = generateAttributesTable(
    wc,
    attrs,
    booleanAttrs,
    booleanTrueByDefault,
    descriptionByAttr,
    defaultValueByAttr,
    reloadAttrs,
  );

  if (attrsContent) {
    document.querySelector("#attributes").innerHTML = attrsContent;
  } else {
    document.querySelector("#attributesDoc").remove();
  }

  const evtsContent = generateEventsTable(wc, evts, descriptionByEvent);
  if (evtsContent) {
    document.querySelector("#events").innerHTML = evtsContent;
  } else {
    document.querySelector("#eventsDoc").remove();
  }

  document.querySelector("#code").innerHTML = generateCodeText(
    wc,
    attrs,
    pkgSrc,
  );
  wc.addEventListener("mwc:attribute", (event) => {
    document.querySelector("#code").innerHTML = generateCodeText(
      wc,
      attrs,
      pkgSrc,
    );
  });
  applyPermalinkParameters(wc, attributes);
  evts.forEach((eventName) => {
    wc.addEventListener(eventName, (event) => {
      console.log(`${eventName} event`, event);
    });
  });
}

function applyPermalinkParameters(wc, attributes) {
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
  if (activateAttrUrlParameters) {
    params.forEach((value, key) => {
      if (!(key in attributes)) {
        return;
      }
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
  }

  // Get an apikey if there is none defined
  if (!wc.getAttribute("apikey") && !attributes.apikey.defaultValue) {
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
function generateAttributesTable(
  wc,
  attrs,
  booleanAttrs = [],
  booleanTrueByDefault = [],
  descriptionByAttr = {},
  defaultValueByAttr = {},
  reloadAttrs = [],
) {
  if (!attrs.filter((key) => descriptionByAttr[key])?.length) {
    return null;
  }
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
    .filter((key) => descriptionByAttr[key])
    .map((key) => {
      const isBoolean = booleanAttrs.includes(key);
      const defaultChecked = booleanTrueByDefault.includes(key)
        ? "checked"
        : "";
      const currValue = wc.getAttribute(key);
      let checked = currValue === "true" ? "checked" : "";
      if (currValue !== "true" && currValue !== "false") {
        checked = defaultChecked;
      }
      return `
    <tr>
      <td class="border px-4 py-2">${key}</td>
      <!--td class="border px-4 py-2"></td>
      <td class="border px-4 py-2"></td-->
      <td class="border px-4 py-2">
      <div class="flex gap-4">
      ${
        isBoolean
          ? `<input
          type="checkbox"
          class="border"
          name="${key}"
          ${checked ? "checked" : ""}
          onchange="document.querySelector('${wc.localName}').setAttribute('${key}', this.checked);onAttributeUpdate(document.querySelector('${wc.localName}'),this.name, this.checked, '${reloadAttrs.join(",")}');"
          />`
          : `
        <input
          type="text"
          class="border"
          name="${key}"
          value="${wc.getAttribute(key) || defaultValueByAttr[key] || ""}" 
          />
        <button class="border p-2 bg-black hover:bg-gray-700 text-white" onclick="document.querySelector('${wc.localName}').setAttribute('${key}', this.previousElementSibling.value);onAttributeUpdate(document.querySelector('${wc.localName}'),this.previousElementSibling.name, this.previousElementSibling.value, '${reloadAttrs.join(",")}');">Update</button>`
      }
      </div>
      ${descriptionByAttr[key] ? `<div class="pt-2">${descriptionByAttr[key]}</div>` : ``}
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
&lt;${wc.localName}${wc.id ? '\n\tid="' + wc.id + '"' : ""}\n\tstyle="display:block;width:100%;height:500px;border:1px solid #e5e7eb;border-radius:16px;"`;

  attrs.forEach((key) => {
    const attributeValue = wc.getAttribute(key);
    const input = document.querySelector(`[name=${key}]`);
    const inputValue =
      input?.type === "checkbox" ? input.checked : input?.value;
    if (
      attributeValue !== null &&
      (attributeValue === inputValue ||
        (attributeValue === "true" && inputValue === true) ||
        (attributeValue === "false" && inputValue === false))
    ) {
      let separator = '"';
      const value = wc.getAttribute(key);
      if (value.includes(separator)) {
        separator = "'"; // for json stringify value
      }
      codeText += `\n\t${[key, separator + value + separator].join("=")}`;
    }
  });

  return codeText + `&gt;\n&lt;/${wc.localName}&gt;`;
}

// Generates a HTML table with all events of a web component
function generateEventsTable(wc, events, descriptionByEvent = {}) {
  if (!events?.length) {
    return null;
  }
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
        let stringify;
        try {
          stringify = JSON.stringify(event, undefined, 4);
        } catch (e) {
          stringify =
            "Object not stringifyable, open the console (F12) to see the object received.";
          console.log(key + " event", event);
        }
        if (key === "singleclick") {
          stringify = "event.data.lonlat:\n";
          stringify += JSON.stringify(event.data.lonlat, undefined, 4);
          stringify += "\n";
          stringify += "event.data.features:\n";
          stringify += JSON.stringify(event.data.features, undefined, 4);
        }

        document.querySelector(`[name='${key}']`).value = stringify.toString();
      });
      return `
        <tr>
          <td class="border px-4 py-2">${key}</td>
          <td class="border px-4 py-2">
            <div class="flex flex-col gap-4">
              <p>
              ${descriptionByEvent[key] || ""}
              </p>
              <p>
              Last event received:
              </p>
              <textarea
                type="text"
                class="border h-300 w-full"
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
function onAttributeUpdate(wc, key, value, reloadAttrs) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  if (reloadAttrs.split(",").includes(key)) {
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
    window.location.reload();
  } else {
    wc.setAttribute(key, value);
    if (activateAttrUrlParameters) {
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params}`,
      );
    }
  }
}
