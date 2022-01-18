import "cross-fetch/polyfill";
import { version } from "../../package.json";
import { isBrowser } from "browser-or-node";

export default class ApiClient {
  constructor() {
    this.token = null;
    this.apiKey = null;
    this.apiUrl = "https://dpb-api.instantencore.com/1";
  }

  /**
   * Client version
   *
   * @access public
   * @return {string} the semver version of the client
   */
  version() {
    return version;
  }

  setAuthToken = (token) => {
    this.token = token;
  };

  setEndPoint = (url) => {
    this.apiUrl = url;
  };

  setAPIKey = (key) => {
    this.apiKey = key;
  };

  /**
   * Set custom header.
   * Can be called multiple times.
   */
  setHeader = (key, value) => {
    if (key.startsWith("x-")) {
      this.headers = {
        ...this.headers,
        [key]: value,
      };
    } else {
      console.error("Custom header must start with x-");
    }
  };

  _testJSON = (str) => {
    try {
      let o = JSON.parse(str);
      if (o && typeof o === "object") {
        return o;
      }
    } catch (e) {
      return false;
    }

    return false;
  };

  _throwAnyErrors = (response) => {
    if (!response.ok || response.status > 399) {
      let body = response.json().catch(() => {
        return Promise.reject(
          new Error(`${response.status}: ${response.statusText}`)
        );
      });
      return body.then((json) => {
        let error;
        let message = json.hasOwnProperty("message") ? json.message : "";
        if (response.status === 500) {
          error = new Error("Service is Unavailable. Please try again later.");
        } else {
          error = new Error(message);
        }
        error.response = response;
        error.body = json;
        let jsonMessage = false;
        jsonMessage = this._testJSON(message);
        if (jsonMessage) {
          error.body.message = jsonMessage;
        }
        return Promise.reject(error);
      });
    }
    if (response.status === 204) {
      return Promise.resolve(null);
    }
    return Promise.resolve(response);
  };

  _fetch = (
    url,
    method = "GET",
    data = null,
    mimetype = "application/json"
  ) => {
    let config = {
      headers: {
        Accept: "application/json",
        "Content-Type": mimetype,
        "User-Agent": `Mozilla/5.0 (compatible; InstantEncore-Client/${version}; +https://instantencore.com/)`,
        ...this.headers,
      },
    };

    if (isBrowser && data instanceof FormData) {
      // console.info("data is FormData - removing header Content-Type to allow browser to set with boundary");
      delete config.headers["Content-Type"];
    }

    config.method = method;

    if (data && mimetype === "application/json") {
      config.body = JSON.stringify(data);
    } else if (data) {
      config.body = data;
    }

    if (this.apiKey) {
      config.headers["x-api-key"] = this.apiKey;
    }

    if (this.token) {
      // requires explicit Access-Control-Allow-Origin, no wildcard allowed
      // config.credentials = 'include'
      config.headers.Authorization = `Bearer ${this.token}`;
    }
    return fetch(url, config)
      .then(this._throwAnyErrors)
      .then((response) => (response ? response.json() : null));
  };

  _toQueryString = (obj, prefix) => {
    const query = Object.keys(obj).map((key) => {
      const value = obj[key];

      if (obj.constructor === Array) key = `${prefix}[]`;
      else if (obj.constructor === Object)
        key = prefix ? `${prefix}[${key}]` : key;

      if (typeof value === "object") return this._toQueryString(value, key);
      else return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    return [].concat.apply([], query).join("&");
  };

  login = (data) => this._fetch(`${this.apiUrl}/auth`, "POST", data);
  add = (resourceType, data, mimetype) =>
    this._fetch(`${this.apiUrl}/${resourceType}`, "POST", data, mimetype);
  update = (resourceType, id, data) =>
    this._fetch(`${this.apiUrl}/${resourceType}/${id}`, "POST", data);
  list = (resourceType) => this._fetch(`${this.apiUrl}/${resourceType}`);
  query = (resourceType, params) =>
    this._fetch(
      `${this.apiUrl}/${resourceType}?${this._toQueryString(params)}`
    );
  read = (resourceType, id) =>
    this._fetch(`${this.apiUrl}/${resourceType}${id ? `/${id}` : ""}`);
  delete = (resourceType, id) =>
    this._fetch(`${this.apiUrl}/${resourceType}/${id}`, "DELETE");
  create = (resourceType, id, data, mimetype) =>
    this._fetch(`${this.apiUrl}/${resourceType}/${id}`, "PUT", data, mimetype);
}
