class DQHttpRequest {
  static async generateRequest(
    method = "POST",
    url = "",
    data = {},
    headers = {}
  ) {
    if (headers == {}) {
      headers = new Headers({
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      });
    }
    let requestOptions = {
      method: method, // GET, *POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // default, *no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: headers,
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // *no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };
    if (data) {
      requestOptions.body = JSON.stringify(data); // body data type must match "Content-Type" header
    }
    // Default options are marked with *
    const request = new Request(url, requestOptions);
    return request;
  }
  static async executeFetch(request) {
    try {
      await this.showLoader();
      const response = await fetch(request);
      await this.hideLoader();
      //console.log(response);
      if (!response.ok) {
        switch (response.status) {
          case 401:
            console.error("Unauthorized request !");
          case 403:
            console.error("Forbidend request !");
          case 404:
            console.error("Requested resource not found !");
          default:
            console.error("Network response was not OK");
        }
      }
      const contentType = response.headers.get("content-type");
      //console.log(contentType)
      if (!contentType) {
        //throw new TypeError("Oops, there is a problem with the content type of the response!");
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
    } catch (err) {
      console.log(err);
      await this.hideLoader();
      throw err;
    }
  }

  static async postData(url = "", data = {}, headers = {}) {
    const request = await this.generateRequest("POST", url, data, headers);
    return await this.executeFetch(request);
  }
  static async getData(url = "", headers = {}) {
    const request = await this.generateRequest("GET", url, null, headers);
    return await this.executeFetch(request);
  }
  static async putData(url = "", data = {}, headers = {}) {
    const request = await this.generateRequest("PUT", url, data, headers);
    return await this.executeFetch(request);
  }
  static async uploadData(url = "", data = new FormData(), headers = {}) {
    const request = await this.generateRequest("PUT", url, data, headers);
    return await this.executeFetch(request);
  }

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
      styleSheetElement.type = "text/css";

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
          styleSheet.rules[i].selectorText &&
          styleSheet.rules[i].selectorText.toLowerCase() ==
            selector.toLowerCase()
        ) {
          styleSheet.rules[i].style.cssText = style;
          return;
        }
      }

      styleSheet.addRule(selector, style);
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

  static createLoader() {
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
    loaderDiv.innerHTML =
      loaderDiv.innerHTML + '<div class="blob blob-0"></div>';
    loaderDiv.innerHTML =
      loaderDiv.innerHTML + '<div class="blob blob-1"></div>';
    loaderDiv.innerHTML =
      loaderDiv.innerHTML + '<div class="blob blob-2"></div>';
    loaderDiv.innerHTML =
      loaderDiv.innerHTML + '<div class="blob blob-3"></div>';
    loaderDiv.innerHTML =
      loaderDiv.innerHTML + '<div class="blob blob-4"></div>';
    loaderDiv.innerHTML =
      loaderDiv.innerHTML + '<div class="blob blob-5"></div>';
    return document.body.appendChild(loaderDiv);
  }
  static showLoader() {
    var parentWindow = parent || {};
    if (typeof loLoadingDiv == undefined) window.loLoadingDiv = {};
    if (!window.loLoadingDiv) {
      window.loLoadingDiv = this.createLoader();
    }
    if (window.loLoadingDiv.style.display !== "block") {
      window.loLoadingDiv.style.display = "block";
    }
  }
  static hideLoader() {
    var parentWindow = parent || {};
    if (window.loLoadingDiv) {
      window.loLoadingDiv.style.display = "none";
    }
  }
}
