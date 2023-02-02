class DQHTTP {
  static async request(url, method = "GET", headers = {}, body) {
    this.showSpinner();
    if (JSON.stringify(headers) === "{}") {
      headers = new Headers({
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      });
    } else {
      headers = new Headers(headers);
    }

    let options = {
      method: method,
      headers: headers,
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // default, *no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // *no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };

    if (body) {
      options.body = body;
    }

    try {
      // console.log(options);
      const response = await fetch(url, options);
      this.hideSpinner();
      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error("Unauthorized request! " + response.status);
          case 403:
            throw new Error("Forbidend request! " + response.status);
          case 404:
            throw new Error("Requested resource not found! " + response.status);
          default:
            throw new Error("Network response was not OK! " + response.status);
        }
      }
      const contentType = response.headers.get("content-type");
      // console.log(contentType)
      if (!contentType) {
        console.error(
          "Oops, there is a problem with the content type of the response!"
        );
        return response.json();
      }
      if (contentType.includes("application/json")) {
        return response.json(); // parses JSON response into native JavaScript objects
      }
      if (contentType.includes("text/plain")) {
        return response.blob(); // parses response into a blob
      }
      if (contentType.includes("image/png")) {
        return response.blob().then((data) => URL.createObjectURL(data)); // parses blob response into object url
      }
    } catch (error) {
      this.hideSpinner();
      console.error(error);
      return { error: error.message };
    }
  }

  static showSpinner() {
    // Show a spinner
    if (typeof loaderDiv == undefined) window.loaderDiv = {};
    if (!window.loaderDiv) {
      window.loaderDiv = DQSpinner.createSpinner();
    }
    if (window.loaderDiv.style.display !== "block") {
      window.loaderDiv.style.display = "block";
    }
  }

  static hideSpinner() {
    // Hide the spinner
    if (window.loaderDiv) {
      window.loaderDiv.style.display = "none";
    }
  }

  static get(url, headers = {}) {
    return this.request(url, "GET", headers);
  }

  static post(url, headers = {}, body) {
    return this.request(url, "POST", headers, body);
  }

  static put(url, headers = {}, body) {
    return this.request(url, "PUT", headers, body);
  }

  static patch(url, headers = {}, body) {
    return this.request(url, "PATCH", headers, body);
  }

  static delete(url, headers = {}) {
    return this.request(url, "DELETE", headers);
  }

  static upload(url, headers = {}, body) {
    return this.request(url, "PUT", headers, body);
  }
}

class DQSpinner {
  static createCSSSelector(selector, style) {
    if (!document.styleSheets) {
      return;
    }

    if (document.getElementsByTagName("head").length == 0) {
      return;
    }

    var styleSheet;
    var mediaType;
    if (document.styleSheets.length > 0) {
      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          continue;
        }
        var media = document.styleSheets[i].media;
        mediaType = typeof media;

        if (mediaType == "string") {
          if (media == "" || media.indexOf("screen") != -1) {
            styleSheet = document.styleSheets[i];
          }
        } else if (mediaType == "object") {
          if (
            media.mediaText == "" ||
            media.mediaText.indexOf("screen") != -1
          ) {
            styleSheet = document.styleSheets[i];
          }
        }

        if (typeof styleSheet != "undefined") {
          break;
        }
      }
    }

    if (typeof styleSheet == "undefined") {
      var styleSheetElement = document.createElement("style");

      document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          continue;
        }
        styleSheet = document.styleSheets[i];
      }

      var media = styleSheet.media;
      mediaType = typeof media;
    }

    if (mediaType == "string") {
      for (var i = 0; i < styleSheet.rules.length; i++) {
        if (
          styleSheet.cssRules[i].selectorText &&
          styleSheet.cssRules[i].selectorText.toLowerCase() ==
            selector.toLowerCase()
        ) {
          styleSheet.cssRules[i].style.cssText = style;
          return;
        }
      }

      styleSheet.insertRule(selector, style);
    } else if (mediaType == "object") {
      for (var i = 0; i < styleSheet.cssRules.length; i++) {
        if (
          styleSheet.cssRules[i].selectorText &&
          styleSheet.cssRules[i].selectorText.toLowerCase() ==
            selector.toLowerCase()
        ) {
          styleSheet.cssRules[i].style.cssText = style;
          return;
        }
      }

      styleSheet.insertRule(
        selector + "{" + style + "}",
        styleSheet.cssRules.length
      );
    }
  }

  static createSpinner() {
    // create the style sheets
    this.createCSSSelector(
      "@-webkit-keyframes spin",
      "0% { transform: rotate(0); } 100% { transform: rotate(360deg); }"
    );
    //this.createCSSSelector('@-moz-keyframes spin', '0% { -moz-transform: rotate(0); } 100% { -moz-transform: rotate(360deg); }');
    this.createCSSSelector(
      "@keyframes spin",
      "0% { transform: rotate(0); } 100% { transform: rotate(360deg); }"
    );

    this.createCSSSelector(
      ".spinner",
      "position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 1070;overflow: hidden;"
    );
    this.createCSSSelector(
      ".spinner div:first-child",
      "display: block;position: relative;left: 50%;top: 50%;width: 150px;height: 150px;margin: -75px 0 0 -75px;border-radius: 50%;box-shadow: 0 3px 3px 0 rgba(255, 56, 106, 1);transform: translate3d(0, 0, 0);animation: spin 2s linear infinite;"
    );
    this.createCSSSelector(
      ".spinner div:first-child:after, .spinner div:first-child:before",
      'content: "";position: absolute;border-radius: 50%;'
    );
    this.createCSSSelector(
      ".spinner div:first-child:before",
      "top: 5px;left: 5px;right: 5px;bottom: 5px;box-shadow: 0 3px 3px 0 rgb(255, 228, 32);-webkit-animation: spin 3s linear infinite;animation: spin 3s linear infinite;"
    );
    this.createCSSSelector(
      ".spinner div:first-child:after",
      "top: 15px;left: 15px;right: 15px;bottom: 15px;box-shadow: 0 3px 3px 0 rgba(61, 175, 255, 1);animation: spin 1.5s linear infinite;"
    );
    // create a new div element
    const loaderDiv = document.createElement("div");
    loaderDiv.id = "dqhttprequest_loader";
    loaderDiv.className = "spinner";
    loaderDiv.innerHTML = "";
    loaderDiv.innerHTML += '<div class="blob blob-0"></div>';
    loaderDiv.innerHTML += '<div class="blob blob-1"></div>';
    loaderDiv.innerHTML += '<div class="blob blob-2"></div>';
    loaderDiv.innerHTML += '<div class="blob blob-3"></div>';
    loaderDiv.innerHTML += '<div class="blob blob-4"></div>';
    loaderDiv.innerHTML += '<div class="blob blob-5"></div>';
    return document.body.appendChild(loaderDiv);
  }
}
