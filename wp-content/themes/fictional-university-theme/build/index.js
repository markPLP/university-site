/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/style.scss */ "./css/style.scss");
/* harmony import */ var _modules_MobileMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/MobileMenu */ "./src/modules/MobileMenu.js");
/* harmony import */ var _modules_HeroSlider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/HeroSlider */ "./src/modules/HeroSlider.js");
/* harmony import */ var _modules_GoogleMap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/GoogleMap */ "./src/modules/GoogleMap.js");
/* harmony import */ var _modules_Search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/Search */ "./src/modules/Search.js");
/* harmony import */ var _modules_MyNotes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/MyNotes */ "./src/modules/MyNotes.js");
/* harmony import */ var _modules_Like__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/Like */ "./src/modules/Like.js");


// Our modules / classes



// import Search from './modules/SearchBak';




// Instantiate a new object using our modules/classes
const mobileMenu = new _modules_MobileMenu__WEBPACK_IMPORTED_MODULE_1__["default"]();
const heroSlider = new _modules_HeroSlider__WEBPACK_IMPORTED_MODULE_2__["default"]();
const googleMap = new _modules_GoogleMap__WEBPACK_IMPORTED_MODULE_3__["default"]();
const search = new _modules_Search__WEBPACK_IMPORTED_MODULE_4__["default"]();
const myNotes = new _modules_MyNotes__WEBPACK_IMPORTED_MODULE_5__["default"]();
const like = new _modules_Like__WEBPACK_IMPORTED_MODULE_6__["default"]();
// const search = Search; // Instantiate the Search module
// search.init(); // Initialize the search component

/***/ }),

/***/ "./src/modules/GoogleMap.js":
/*!**********************************!*\
  !*** ./src/modules/GoogleMap.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class GMap {
  constructor() {
    document.querySelectorAll(".acf-map").forEach(el => {
      this.new_map(el);
    });
  }
  new_map($el) {
    var $markers = $el.querySelectorAll(".marker");
    var args = {
      zoom: 16,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map($el, args);
    map.markers = [];
    var that = this;

    // add markers
    $markers.forEach(function (x) {
      that.add_marker(x, map);
    });

    // center map
    this.center_map(map);
  } // end new_map

  add_marker($marker, map) {
    var latlng = new google.maps.LatLng($marker.getAttribute("data-lat"), $marker.getAttribute("data-lng"));
    var marker = new google.maps.Marker({
      position: latlng,
      map: map
    });
    map.markers.push(marker);

    // if marker contains HTML, add it to an infoWindow
    if ($marker.innerHTML) {
      // create info window
      var infowindow = new google.maps.InfoWindow({
        content: $marker.innerHTML
      });

      // show info window when marker is clicked
      google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });
    }
  } // end add_marker

  center_map(map) {
    var bounds = new google.maps.LatLngBounds();

    // loop through all markers and create bounds
    map.markers.forEach(function (marker) {
      var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      bounds.extend(latlng);
    });

    // only 1 marker?
    if (map.markers.length == 1) {
      // set center of map
      map.setCenter(bounds.getCenter());
      map.setZoom(16);
    } else {
      // fit to bounds
      map.fitBounds(bounds);
    }
  } // end center_map
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GMap);

/***/ }),

/***/ "./src/modules/HeroSlider.js":
/*!***********************************!*\
  !*** ./src/modules/HeroSlider.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _glidejs_glide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @glidejs/glide */ "./node_modules/@glidejs/glide/dist/glide.esm.js");

class HeroSlider {
  constructor() {
    if (document.querySelector(".hero-slider")) {
      // count how many slides there are
      const dotCount = document.querySelectorAll(".hero-slider__slide").length;

      // Generate the HTML for the navigation dots
      let dotHTML = "";
      for (let i = 0; i < dotCount; i++) {
        dotHTML += `<button class="slider__bullet glide__bullet" data-glide-dir="=${i}"></button>`;
      }

      // Add the dots HTML to the DOM
      document.querySelector(".glide__bullets").insertAdjacentHTML("beforeend", dotHTML);

      // Actually initialize the glide / slider script
      var glide = new _glidejs_glide__WEBPACK_IMPORTED_MODULE_0__["default"](".hero-slider", {
        type: "carousel",
        perView: 1,
        autoplay: 3000
      });
      glide.mount();
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HeroSlider);

/***/ }),

/***/ "./src/modules/Like.js":
/*!*****************************!*\
  !*** ./src/modules/Like.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Like {
  constructor() {
    // alert(asdfasdf);
  }
  events() {}

  // methods
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Like);

/***/ }),

/***/ "./src/modules/MobileMenu.js":
/*!***********************************!*\
  !*** ./src/modules/MobileMenu.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class MobileMenu {
  constructor() {
    this.menu = document.querySelector(".site-header__menu");
    this.openButton = document.querySelector(".site-header__menu-trigger");
    this.events();
  }
  events() {
    this.openButton.addEventListener("click", () => this.openMenu());
  }
  openMenu() {
    this.openButton.classList.toggle("fa-bars");
    this.openButton.classList.toggle("fa-window-close");
    this.menu.classList.toggle("site-header__menu--active");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MobileMenu);

/***/ }),

/***/ "./src/modules/MyNotes.js":
/*!********************************!*\
  !*** ./src/modules/MyNotes.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

class MyNotes {
  constructor() {
    // wrap in if statement - run events in #my-notes DOM only
    if (document.querySelector('#my-notes')) {
      this.myNoteWrapper = document.querySelector('#my-notes');
      this.deleteBtns = document.querySelectorAll('.delete-note');
      this.editBtns = document.querySelectorAll('.edit-note');
      this.updateBtns = document.querySelectorAll('.update-note');
      this.createBtn = document.querySelector('.submit-note');
      this.newNoteTitleField = document.querySelector('.new-note-title');
      this.newNoteBodyField = document.querySelector('.new-note-body');
      this.noteLimitMessage = document.querySelector('.note-limit-message');
      this.noteEmptyMessage = document.querySelector('.note-empty-message');
      this.events();
    }
  }

  // EVENTS will go here
  events() {
    // Event delegation to manage actions
    this.myNoteWrapper.addEventListener('click', e => {
      const element = e.target;
      if (element.classList.contains('edit-note') || e.target.classList.contains('fa-trash-o')) this.editNote(e); // use this.editNote to refer to the class method
      if (element.classList.contains('delete-note') || e.target.classList.contains('fa-pencil') || e.target.classList.contains('fa-times')) this.deleteNote(e);
      if (element.classList.contains('update-note') || e.target.classList.contains('fa-arrow-right')) this.updateNote(e);
    });
    this.createBtn.addEventListener('click', this.createNote.bind(this));
  }

  // METHODS will go here
  editNote(e) {
    const thisNote = e.target.parentElement;
    thisNote.dataset.id;
    //  console.log(thisNote.dataset.id);
    this.noteEmptyMessage.classList.remove('active');
    this.noteLimitMessage.classList.remove('active');
    if (thisNote.getAttribute('data-editable') === 'true') {
      this.makeNoteReadonly(thisNote); // use param 'thisNote' to use the global selector
    } else {
      this.makeNoteEditable(thisNote); // use param 'thisNote' to use the global selector
    }
  }
  makeNoteEditable(thisNote) {
    // const thisNote = e.currentTarget.parentElement;
    thisNote.classList.add('link-list--active');
    const cancelLink = thisNote.querySelector('.edit-note');
    if (cancelLink) {
      cancelLink.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Cancel`;
    }
    // set fields to be editable
    ['note-title-field', 'note-body-field'].forEach(className => {
      const field = thisNote.querySelector(`.${className}`);
      field.removeAttribute('readonly');
      field.setAttribute('read', '');
    });
    thisNote.setAttribute('data-editable', 'true');
  }
  makeNoteReadonly(thisNote) {
    // const thisNote = e.currentTarget.parentElement;
    thisNote.classList.remove('link-list--active');
    const cancelLink = thisNote.querySelector('.edit-note');
    if (cancelLink) {
      cancelLink.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i> Edit`;
    }
    // set to read-only
    ['note-title-field', 'note-body-field'].forEach(className => {
      const field = thisNote.querySelector(`.${className}`);
      field.removeAttribute('readonly');
      field.setAttribute('readonly', 'readonly');
    });
    thisNote.setAttribute('data-editable', 'false');
  }

  // async/await - deletenote function
  async deleteNote(e) {
    this.noteEmptyMessage.classList.remove('active');
    this.noteLimitMessage.classList.remove('active');
    const thisNote = e.target.parentElement;
    const thisNoteID = thisNote.dataset.id;
    const url = universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID;
    try {
      const response = await axios__WEBPACK_IMPORTED_MODULE_0___default()["delete"](url, {
        // method: 'DELETE', // only use this if you're not using axios
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce // nonce is required here for authentication
        }
      });

      // ONLY USE THIS IF NOT USING AXIOS
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      // Add class and await the delay before removing the element
      thisNote.classList.add('link-list__list--slide-up');
      document.querySelector('.note-limit-message').classList.remove('active');
      await new Promise(resolve => setTimeout(resolve, 400));
      thisNote.remove();

      // console.log('Item deleted successfully', await response.json());
      /* eslint-disable */
      console.log(...oo_oo(`3330191350_128_6_128_46_4`, 'Item deleted successfully'));
    } catch (error) {
      /* eslint-disable */console.error(...oo_tx(`3330191350_130_6_130_51_11`, 'Delete request failed', error));
    }
  }

  // async/await - updateNote function
  async updateNote(e) {
    const thisNote = e.target.parentElement;
    const thisNoteID = thisNote.dataset.id;
    const url = universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID;

    // get the updated title and content
    let ourUpdatedPost = {
      title: thisNote.querySelector('.note-title-field').value,
      content: thisNote.querySelector('.note-body-field').value
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ourUpdatedPost),
        // Pass the update data in the body and stringify it
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce // nonce is required here for authentication
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.makeNoteReadonly(thisNote);
      /* eslint-disable */
      console.log(...oo_oo(`3330191350_161_6_161_69_4`, 'Item updated successfully', await response.json()));
    } catch (error) {
      /* eslint-disable */console.error(...oo_tx(`3330191350_163_6_163_51_11`, 'update request failed', error));
    }
  }

  // async/await - createNote function

  async createNote(e) {
    e.preventDefault();
    const url = universityData.root_url + '/wp-json/wp/v2/note/';
    //   this.noteEmptyMessage.classList.remove('active');
    this.noteEmptyMessage.classList.remove('active');
    const showMessage = document.querySelector('.note-empty-message');
    if (!this.newNoteTitleField.value || !this.newNoteBodyField.value) {
      showMessage.classList.add('active');
      // alert('Please fill in the title field');
      return;
    }
    const ourUpdatedPost = {
      title: this.newNoteTitleField.value,
      content: this.newNoteBodyField.value,
      status: 'private' // by default this is draft
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ourUpdatedPost),
        // Pass the update data in the body and stringify it
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce // nonce is required here for authentication
        }
      });
      const contentType = response.headers.get('Content-Type');

      // log this as text for unknown error/data format
      const responseText = await response.text(); // Get the response as text
      const showMessage = document.querySelector('.note-limit-message');
      // Check if the response text is the note limit message
      if (responseText === 'You have reached your note limit') {
        showMessage.classList.add('active');
        throw new Error(responseText); // Stop further processing
      }

      // Proceed to parse if it's JSON
      if (contentType && contentType.includes('application/json')) {
        const responseData = JSON.parse(responseText); // Parse JSON

        showMessage.classList.remove('active');
        const noteContent = responseData.content.rendered.replace(/<\/?p>/g, '');
        const newListNote = document.createElement('li');
        newListNote.dataset.id = responseData.id;
        let titleReplace = responseData.title.rendered;
        if (titleReplace.startsWith('Private: ')) {
          titleReplace = titleReplace.replace('Private: ', '');
        }
        newListNote.innerHTML = `
                <input readonly="" class="note-title-field" value="${titleReplace}">
                <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                <textarea readonly class="note-body-field">${noteContent}</textarea>
                <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
            `;
        this.myNoteWrapper.prepend(newListNote);

        // Clear the input fields after prepending
        this.newNoteTitleField.value = '';
        this.newNoteBodyField.value = '';
      } else {
        // If not JSON, treat it as a plain text error
        /* eslint-disable */
        console.error(...oo_tx(`3330191350_239_8_239_68_11`, 'Unexpected non-JSON response:', responseText));
        throw new Error(responseText);
      }
    } catch (error) {
      /* eslint-disable */console.error(...oo_tx(`3330191350_243_6_243_68_11`, 'Create request failed', error.message || error));
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyNotes);
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */
;
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x3d40(_0x42c408,_0x1687bd){var _0x2a707f=_0x2a70();return _0x3d40=function(_0x3d4044,_0x56e842){_0x3d4044=_0x3d4044-0x87;var _0x253dda=_0x2a707f[_0x3d4044];return _0x253dda;},_0x3d40(_0x42c408,_0x1687bd);}var _0x451048=_0x3d40;(function(_0x286a4e,_0x426f1f){var _0x369c54=_0x3d40,_0x4d7d73=_0x286a4e();while(!![]){try{var _0x36b423=parseInt(_0x369c54(0x11a))/0x1*(-parseInt(_0x369c54(0xc7))/0x2)+parseInt(_0x369c54(0xda))/0x3*(parseInt(_0x369c54(0x122))/0x4)+-parseInt(_0x369c54(0xb4))/0x5+-parseInt(_0x369c54(0xd4))/0x6+parseInt(_0x369c54(0xa7))/0x7*(parseInt(_0x369c54(0x170))/0x8)+-parseInt(_0x369c54(0xaa))/0x9*(parseInt(_0x369c54(0x10f))/0xa)+parseInt(_0x369c54(0x16f))/0xb*(parseInt(_0x369c54(0x138))/0xc);if(_0x36b423===_0x426f1f)break;else _0x4d7d73['push'](_0x4d7d73['shift']());}catch(_0x345424){_0x4d7d73['push'](_0x4d7d73['shift']());}}}(_0x2a70,0xb5cc6));var K=Object[_0x451048(0xc6)],Q=Object['defineProperty'],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x451048(0x17d)],te=Object['getPrototypeOf'],ne=Object[_0x451048(0xec)][_0x451048(0x143)],re=(_0x98bfb5,_0x34d902,_0x32d0f7,_0x71ab72)=>{var _0x21fc19=_0x451048;if(_0x34d902&&typeof _0x34d902==_0x21fc19(0x105)||typeof _0x34d902==_0x21fc19(0xf9)){for(let _0x1202a5 of ee(_0x34d902))!ne['call'](_0x98bfb5,_0x1202a5)&&_0x1202a5!==_0x32d0f7&&Q(_0x98bfb5,_0x1202a5,{'get':()=>_0x34d902[_0x1202a5],'enumerable':!(_0x71ab72=G(_0x34d902,_0x1202a5))||_0x71ab72[_0x21fc19(0xa0)]});}return _0x98bfb5;},V=(_0x3de2cc,_0x29c45e,_0x3ec42b)=>(_0x3ec42b=_0x3de2cc!=null?K(te(_0x3de2cc)):{},re(_0x29c45e||!_0x3de2cc||!_0x3de2cc[_0x451048(0x12b)]?Q(_0x3ec42b,'default',{'value':_0x3de2cc,'enumerable':!0x0}):_0x3ec42b,_0x3de2cc)),Z=class{constructor(_0x23af2e,_0x3e6118,_0x4c5b80,_0x532e7e,_0x2186d6,_0x344f92){var _0x3b3bff=_0x451048,_0x5926d3,_0x9355bb,_0x5bd177,_0x28a2d7;this['global']=_0x23af2e,this[_0x3b3bff(0x169)]=_0x3e6118,this[_0x3b3bff(0x95)]=_0x4c5b80,this[_0x3b3bff(0xae)]=_0x532e7e,this[_0x3b3bff(0xcb)]=_0x2186d6,this['eventReceivedCallback']=_0x344f92,this['_allowedToSend']=!0x0,this[_0x3b3bff(0xc5)]=!0x0,this[_0x3b3bff(0x150)]=!0x1,this[_0x3b3bff(0xe4)]=!0x1,this[_0x3b3bff(0x12c)]=((_0x9355bb=(_0x5926d3=_0x23af2e['process'])==null?void 0x0:_0x5926d3[_0x3b3bff(0x9b)])==null?void 0x0:_0x9355bb[_0x3b3bff(0x14a)])===_0x3b3bff(0x110),this[_0x3b3bff(0xe0)]=!((_0x28a2d7=(_0x5bd177=this['global'][_0x3b3bff(0xef)])==null?void 0x0:_0x5bd177[_0x3b3bff(0x17e)])!=null&&_0x28a2d7[_0x3b3bff(0x13c)])&&!this['_inNextEdge'],this[_0x3b3bff(0x142)]=null,this[_0x3b3bff(0xa9)]=0x0,this[_0x3b3bff(0x90)]=0x14,this[_0x3b3bff(0xd2)]=_0x3b3bff(0x8d),this[_0x3b3bff(0x14b)]=(this['_inBrowser']?_0x3b3bff(0xd0):'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20')+this[_0x3b3bff(0xd2)];}async[_0x451048(0x141)](){var _0x2a3e50=_0x451048,_0x3f02fa,_0x445663;if(this[_0x2a3e50(0x142)])return this[_0x2a3e50(0x142)];let _0x16711e;if(this[_0x2a3e50(0xe0)]||this[_0x2a3e50(0x12c)])_0x16711e=this[_0x2a3e50(0xf5)][_0x2a3e50(0xb9)];else{if((_0x3f02fa=this[_0x2a3e50(0xf5)][_0x2a3e50(0xef)])!=null&&_0x3f02fa[_0x2a3e50(0x8a)])_0x16711e=(_0x445663=this[_0x2a3e50(0xf5)][_0x2a3e50(0xef)])==null?void 0x0:_0x445663[_0x2a3e50(0x8a)];else try{let _0x52ee16=await import(_0x2a3e50(0x97));_0x16711e=(await import((await import('url'))['pathToFileURL'](_0x52ee16[_0x2a3e50(0x10c)](this[_0x2a3e50(0xae)],_0x2a3e50(0x15a)))[_0x2a3e50(0x130)]()))['default'];}catch{try{_0x16711e=require(require(_0x2a3e50(0x97))['join'](this[_0x2a3e50(0xae)],'ws'));}catch{throw new Error(_0x2a3e50(0x12a));}}}return this[_0x2a3e50(0x142)]=_0x16711e,_0x16711e;}['_connectToHostNow'](){var _0x26ba8c=_0x451048;this[_0x26ba8c(0xe4)]||this[_0x26ba8c(0x150)]||this[_0x26ba8c(0xa9)]>=this[_0x26ba8c(0x90)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x26ba8c(0xe4)]=!0x0,this[_0x26ba8c(0xa9)]++,this[_0x26ba8c(0x16e)]=new Promise((_0x58a758,_0x55d5e9)=>{var _0x10cc33=_0x26ba8c;this['getWebSocketClass']()[_0x10cc33(0xa3)](_0x307ec8=>{var _0x10bab6=_0x10cc33;let _0x19f3e9=new _0x307ec8(_0x10bab6(0x8b)+(!this[_0x10bab6(0xe0)]&&this[_0x10bab6(0xcb)]?_0x10bab6(0x88):this['host'])+':'+this['port']);_0x19f3e9[_0x10bab6(0xbf)]=()=>{var _0x2c4671=_0x10bab6;this[_0x2c4671(0x116)]=!0x1,this[_0x2c4671(0xc8)](_0x19f3e9),this[_0x2c4671(0x147)](),_0x55d5e9(new Error(_0x2c4671(0xd9)));},_0x19f3e9['onopen']=()=>{var _0x23625a=_0x10bab6;this[_0x23625a(0xe0)]||_0x19f3e9[_0x23625a(0x131)]&&_0x19f3e9['_socket'][_0x23625a(0xed)]&&_0x19f3e9[_0x23625a(0x131)]['unref'](),_0x58a758(_0x19f3e9);},_0x19f3e9[_0x10bab6(0x155)]=()=>{var _0x4e0266=_0x10bab6;this[_0x4e0266(0xc5)]=!0x0,this[_0x4e0266(0xc8)](_0x19f3e9),this[_0x4e0266(0x147)]();},_0x19f3e9[_0x10bab6(0xb2)]=_0x51000a=>{var _0x4084b7=_0x10bab6;try{if(!(_0x51000a!=null&&_0x51000a['data'])||!this[_0x4084b7(0xb5)])return;let _0x42142e=JSON[_0x4084b7(0x159)](_0x51000a[_0x4084b7(0x151)]);this[_0x4084b7(0xb5)](_0x42142e[_0x4084b7(0xd1)],_0x42142e[_0x4084b7(0x168)],this[_0x4084b7(0xf5)],this['_inBrowser']);}catch{}};})[_0x10cc33(0xa3)](_0x418077=>(this[_0x10cc33(0x150)]=!0x0,this[_0x10cc33(0xe4)]=!0x1,this[_0x10cc33(0xc5)]=!0x1,this['_allowedToSend']=!0x0,this['_connectAttemptCount']=0x0,_0x418077))[_0x10cc33(0x15d)](_0x2aa232=>(this[_0x10cc33(0x150)]=!0x1,this[_0x10cc33(0xe4)]=!0x1,console[_0x10cc33(0xfc)](_0x10cc33(0xd8)+this[_0x10cc33(0xd2)]),_0x55d5e9(new Error(_0x10cc33(0x16a)+(_0x2aa232&&_0x2aa232[_0x10cc33(0x135)])))));}));}['_disposeWebsocket'](_0x334f8f){var _0x44c482=_0x451048;this[_0x44c482(0x150)]=!0x1,this[_0x44c482(0xe4)]=!0x1;try{_0x334f8f['onclose']=null,_0x334f8f[_0x44c482(0xbf)]=null,_0x334f8f[_0x44c482(0x94)]=null;}catch{}try{_0x334f8f[_0x44c482(0x14c)]<0x2&&_0x334f8f['close']();}catch{}}[_0x451048(0x147)](){var _0xc8d992=_0x451048;clearTimeout(this[_0xc8d992(0x16c)]),!(this['_connectAttemptCount']>=this['_maxConnectAttemptCount'])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x3c45b3=_0xc8d992,_0x3720fc;this[_0x3c45b3(0x150)]||this['_connecting']||(this[_0x3c45b3(0x13f)](),(_0x3720fc=this[_0x3c45b3(0x16e)])==null||_0x3720fc['catch'](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0xc8d992(0x16c)][_0xc8d992(0xed)]&&this[_0xc8d992(0x16c)]['unref']());}async[_0x451048(0x163)](_0x1c61df){var _0x504051=_0x451048;try{if(!this[_0x504051(0x116)])return;this[_0x504051(0xc5)]&&this[_0x504051(0x13f)](),(await this['_ws'])[_0x504051(0x163)](JSON[_0x504051(0xb6)](_0x1c61df));}catch(_0xd5459b){console[_0x504051(0xfc)](this[_0x504051(0x14b)]+':\\x20'+(_0xd5459b&&_0xd5459b['message'])),this[_0x504051(0x116)]=!0x1,this[_0x504051(0x147)]();}}};function q(_0x266c5b,_0x4603a0,_0x1f24cc,_0x16a558,_0x1bd09d,_0x72b80e,_0x2a3f25,_0x1e9981=ie){var _0x224724=_0x451048;let _0x41b157=_0x1f24cc[_0x224724(0x140)](',')[_0x224724(0x100)](_0x47e497=>{var _0x4d039e=_0x224724,_0x55b4fb,_0x320617,_0x777820,_0x5632c6;try{if(!_0x266c5b[_0x4d039e(0xfe)]){let _0x79bc1a=((_0x320617=(_0x55b4fb=_0x266c5b[_0x4d039e(0xef)])==null?void 0x0:_0x55b4fb[_0x4d039e(0x17e)])==null?void 0x0:_0x320617['node'])||((_0x5632c6=(_0x777820=_0x266c5b[_0x4d039e(0xef)])==null?void 0x0:_0x777820[_0x4d039e(0x9b)])==null?void 0x0:_0x5632c6[_0x4d039e(0x14a)])==='edge';(_0x1bd09d===_0x4d039e(0xc2)||_0x1bd09d===_0x4d039e(0x175)||_0x1bd09d===_0x4d039e(0x12e)||_0x1bd09d===_0x4d039e(0xdb))&&(_0x1bd09d+=_0x79bc1a?_0x4d039e(0xe7):_0x4d039e(0x136)),_0x266c5b[_0x4d039e(0xfe)]={'id':+new Date(),'tool':_0x1bd09d},_0x2a3f25&&_0x1bd09d&&!_0x79bc1a&&console['log']('%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20'+(_0x1bd09d[_0x4d039e(0xde)](0x0)['toUpperCase']()+_0x1bd09d[_0x4d039e(0x128)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)',_0x4d039e(0x164));}let _0x3ef58c=new Z(_0x266c5b,_0x4603a0,_0x47e497,_0x16a558,_0x72b80e,_0x1e9981);return _0x3ef58c[_0x4d039e(0x163)]['bind'](_0x3ef58c);}catch(_0xa9a168){return console['warn']('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0xa9a168&&_0xa9a168[_0x4d039e(0x135)]),()=>{};}});return _0x5aef02=>_0x41b157[_0x224724(0x9d)](_0x2dad3b=>_0x2dad3b(_0x5aef02));}function ie(_0x27b204,_0x34b1f5,_0x31c6ab,_0x1e9d57){var _0x53cf09=_0x451048;_0x1e9d57&&_0x27b204==='reload'&&_0x31c6ab[_0x53cf09(0x177)]['reload']();}function B(_0x12e76d){var _0x1155aa=_0x451048,_0x4bc5e9,_0x6b55a9;let _0x5d86b1=function(_0xce5f3f,_0x2bd206){return _0x2bd206-_0xce5f3f;},_0x18bf29;if(_0x12e76d[_0x1155aa(0x161)])_0x18bf29=function(){var _0x27a7ff=_0x1155aa;return _0x12e76d[_0x27a7ff(0x161)]['now']();};else{if(_0x12e76d[_0x1155aa(0xef)]&&_0x12e76d['process'][_0x1155aa(0xf6)]&&((_0x6b55a9=(_0x4bc5e9=_0x12e76d[_0x1155aa(0xef)])==null?void 0x0:_0x4bc5e9[_0x1155aa(0x9b)])==null?void 0x0:_0x6b55a9['NEXT_RUNTIME'])!=='edge')_0x18bf29=function(){var _0x419b63=_0x1155aa;return _0x12e76d[_0x419b63(0xef)][_0x419b63(0xf6)]();},_0x5d86b1=function(_0xafde2f,_0x1fb9ff){return 0x3e8*(_0x1fb9ff[0x0]-_0xafde2f[0x0])+(_0x1fb9ff[0x1]-_0xafde2f[0x1])/0xf4240;};else try{let {performance:_0xc4ea2e}=require(_0x1155aa(0x9e));_0x18bf29=function(){var _0x3b5d01=_0x1155aa;return _0xc4ea2e[_0x3b5d01(0x124)]();};}catch{_0x18bf29=function(){return+new Date();};}}return{'elapsed':_0x5d86b1,'timeStamp':_0x18bf29,'now':()=>Date[_0x1155aa(0x124)]()};}function H(_0x84db9a,_0x5c571c,_0x2d6671){var _0x1cb2c6=_0x451048,_0x554175,_0x372ab7,_0x594887,_0x528bd2,_0x26717e;if(_0x84db9a[_0x1cb2c6(0xb0)]!==void 0x0)return _0x84db9a['_consoleNinjaAllowedToStart'];let _0x231a1b=((_0x372ab7=(_0x554175=_0x84db9a['process'])==null?void 0x0:_0x554175['versions'])==null?void 0x0:_0x372ab7[_0x1cb2c6(0x13c)])||((_0x528bd2=(_0x594887=_0x84db9a[_0x1cb2c6(0xef)])==null?void 0x0:_0x594887[_0x1cb2c6(0x9b)])==null?void 0x0:_0x528bd2[_0x1cb2c6(0x14a)])===_0x1cb2c6(0x110);function _0x8511ec(_0x5c481e){var _0x2454c6=_0x1cb2c6;if(_0x5c481e[_0x2454c6(0xc3)]('/')&&_0x5c481e[_0x2454c6(0x17b)]('/')){let _0x57534f=new RegExp(_0x5c481e[_0x2454c6(0x15c)](0x1,-0x1));return _0x2b2cd3=>_0x57534f['test'](_0x2b2cd3);}else{if(_0x5c481e[_0x2454c6(0x106)]('*')||_0x5c481e['includes']('?')){let _0x412abc=new RegExp('^'+_0x5c481e[_0x2454c6(0xbe)](/\\./g,String[_0x2454c6(0xa2)](0x5c)+'.')[_0x2454c6(0xbe)](/\\*/g,'.*')[_0x2454c6(0xbe)](/\\?/g,'.')+String[_0x2454c6(0xa2)](0x24));return _0x66c40f=>_0x412abc[_0x2454c6(0x17c)](_0x66c40f);}else return _0x529749=>_0x529749===_0x5c481e;}}let _0x27ec40=_0x5c571c[_0x1cb2c6(0x100)](_0x8511ec);return _0x84db9a[_0x1cb2c6(0xb0)]=_0x231a1b||!_0x5c571c,!_0x84db9a[_0x1cb2c6(0xb0)]&&((_0x26717e=_0x84db9a[_0x1cb2c6(0x177)])==null?void 0x0:_0x26717e[_0x1cb2c6(0xf0)])&&(_0x84db9a['_consoleNinjaAllowedToStart']=_0x27ec40[_0x1cb2c6(0x139)](_0x3be647=>_0x3be647(_0x84db9a[_0x1cb2c6(0x177)]['hostname']))),_0x84db9a[_0x1cb2c6(0xb0)];}function X(_0x590edb,_0x21bf16,_0x398f4c,_0x22e72b){var _0x26411c=_0x451048;_0x590edb=_0x590edb,_0x21bf16=_0x21bf16,_0x398f4c=_0x398f4c,_0x22e72b=_0x22e72b;let _0x4ad906=B(_0x590edb),_0x1122c5=_0x4ad906[_0x26411c(0x92)],_0x320a81=_0x4ad906[_0x26411c(0xac)];class _0x26cce7{constructor(){var _0x10c6d1=_0x26411c;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this[_0x10c6d1(0x152)]=/'([^\\\\']|\\\\')*'/,this[_0x10c6d1(0x10e)]=_0x590edb[_0x10c6d1(0x108)],this[_0x10c6d1(0xc0)]=_0x590edb[_0x10c6d1(0x14d)],this['_getOwnPropertyDescriptor']=Object[_0x10c6d1(0xd3)],this[_0x10c6d1(0x172)]=Object['getOwnPropertyNames'],this[_0x10c6d1(0xf8)]=_0x590edb[_0x10c6d1(0xb7)],this[_0x10c6d1(0xff)]=RegExp[_0x10c6d1(0xec)]['toString'],this[_0x10c6d1(0x129)]=Date[_0x10c6d1(0xec)][_0x10c6d1(0x130)];}[_0x26411c(0x9c)](_0x4436e4,_0x5f0356,_0x54afd9,_0x3c9191){var _0x2a7192=_0x26411c,_0x3dc787=this,_0x1bd08d=_0x54afd9[_0x2a7192(0xe1)];function _0x1dd879(_0x4fb52f,_0x591b22,_0x121554){var _0x455b89=_0x2a7192;_0x591b22[_0x455b89(0x8c)]=_0x455b89(0x101),_0x591b22['error']=_0x4fb52f[_0x455b89(0x135)],_0x24714b=_0x121554[_0x455b89(0x13c)]['current'],_0x121554[_0x455b89(0x13c)]['current']=_0x591b22,_0x3dc787[_0x455b89(0x12d)](_0x591b22,_0x121554);}try{_0x54afd9[_0x2a7192(0xf2)]++,_0x54afd9['autoExpand']&&_0x54afd9['autoExpandPreviousObjects'][_0x2a7192(0xfb)](_0x5f0356);var _0x19b5df,_0x414ef1,_0x4ba9dc,_0x1ec67e,_0x1b03b5=[],_0x191f7c=[],_0x3944e0,_0x292431=this['_type'](_0x5f0356),_0x297969=_0x292431===_0x2a7192(0xa6),_0x5f1b2b=!0x1,_0x2285c2=_0x292431===_0x2a7192(0xf9),_0x21cb7d=this[_0x2a7192(0xdc)](_0x292431),_0x5ab3f0=this['_isPrimitiveWrapperType'](_0x292431),_0x47d0a8=_0x21cb7d||_0x5ab3f0,_0x3cafaa={},_0x5e5d4e=0x0,_0x1d0e40=!0x1,_0x24714b,_0x24a1c7=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x54afd9['depth']){if(_0x297969){if(_0x414ef1=_0x5f0356['length'],_0x414ef1>_0x54afd9['elements']){for(_0x4ba9dc=0x0,_0x1ec67e=_0x54afd9[_0x2a7192(0xf1)],_0x19b5df=_0x4ba9dc;_0x19b5df<_0x1ec67e;_0x19b5df++)_0x191f7c[_0x2a7192(0xfb)](_0x3dc787[_0x2a7192(0x117)](_0x1b03b5,_0x5f0356,_0x292431,_0x19b5df,_0x54afd9));_0x4436e4[_0x2a7192(0xb3)]=!0x0;}else{for(_0x4ba9dc=0x0,_0x1ec67e=_0x414ef1,_0x19b5df=_0x4ba9dc;_0x19b5df<_0x1ec67e;_0x19b5df++)_0x191f7c[_0x2a7192(0xfb)](_0x3dc787[_0x2a7192(0x117)](_0x1b03b5,_0x5f0356,_0x292431,_0x19b5df,_0x54afd9));}_0x54afd9[_0x2a7192(0x171)]+=_0x191f7c['length'];}if(!(_0x292431===_0x2a7192(0x14e)||_0x292431===_0x2a7192(0x108))&&!_0x21cb7d&&_0x292431!==_0x2a7192(0xee)&&_0x292431!==_0x2a7192(0x107)&&_0x292431!==_0x2a7192(0x134)){var _0x5ec43e=_0x3c9191[_0x2a7192(0x11f)]||_0x54afd9['props'];if(this['_isSet'](_0x5f0356)?(_0x19b5df=0x0,_0x5f0356[_0x2a7192(0x9d)](function(_0x463b90){var _0xbec41=_0x2a7192;if(_0x5e5d4e++,_0x54afd9[_0xbec41(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;return;}if(!_0x54afd9[_0xbec41(0x111)]&&_0x54afd9['autoExpand']&&_0x54afd9[_0xbec41(0x171)]>_0x54afd9[_0xbec41(0xc9)]){_0x1d0e40=!0x0;return;}_0x191f7c['push'](_0x3dc787[_0xbec41(0x117)](_0x1b03b5,_0x5f0356,_0xbec41(0x98),_0x19b5df++,_0x54afd9,function(_0x3d3b35){return function(){return _0x3d3b35;};}(_0x463b90)));})):this[_0x2a7192(0x11c)](_0x5f0356)&&_0x5f0356['forEach'](function(_0x335179,_0x2685c9){var _0x5a2ece=_0x2a7192;if(_0x5e5d4e++,_0x54afd9[_0x5a2ece(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;return;}if(!_0x54afd9[_0x5a2ece(0x111)]&&_0x54afd9['autoExpand']&&_0x54afd9[_0x5a2ece(0x171)]>_0x54afd9[_0x5a2ece(0xc9)]){_0x1d0e40=!0x0;return;}var _0x3479ae=_0x2685c9[_0x5a2ece(0x130)]();_0x3479ae[_0x5a2ece(0x9a)]>0x64&&(_0x3479ae=_0x3479ae[_0x5a2ece(0x15c)](0x0,0x64)+'...'),_0x191f7c[_0x5a2ece(0xfb)](_0x3dc787[_0x5a2ece(0x117)](_0x1b03b5,_0x5f0356,'Map',_0x3479ae,_0x54afd9,function(_0x58ebfe){return function(){return _0x58ebfe;};}(_0x335179)));}),!_0x5f1b2b){try{for(_0x3944e0 in _0x5f0356)if(!(_0x297969&&_0x24a1c7[_0x2a7192(0x17c)](_0x3944e0))&&!this[_0x2a7192(0x103)](_0x5f0356,_0x3944e0,_0x54afd9)){if(_0x5e5d4e++,_0x54afd9[_0x2a7192(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;break;}if(!_0x54afd9[_0x2a7192(0x111)]&&_0x54afd9['autoExpand']&&_0x54afd9['autoExpandPropertyCount']>_0x54afd9[_0x2a7192(0xc9)]){_0x1d0e40=!0x0;break;}_0x191f7c[_0x2a7192(0xfb)](_0x3dc787[_0x2a7192(0x174)](_0x1b03b5,_0x3cafaa,_0x5f0356,_0x292431,_0x3944e0,_0x54afd9));}}catch{}if(_0x3cafaa[_0x2a7192(0xfa)]=!0x0,_0x2285c2&&(_0x3cafaa[_0x2a7192(0x127)]=!0x0),!_0x1d0e40){var _0xd026e1=[][_0x2a7192(0x176)](this[_0x2a7192(0x172)](_0x5f0356))[_0x2a7192(0x176)](this[_0x2a7192(0x157)](_0x5f0356));for(_0x19b5df=0x0,_0x414ef1=_0xd026e1[_0x2a7192(0x9a)];_0x19b5df<_0x414ef1;_0x19b5df++)if(_0x3944e0=_0xd026e1[_0x19b5df],!(_0x297969&&_0x24a1c7[_0x2a7192(0x17c)](_0x3944e0[_0x2a7192(0x130)]()))&&!this[_0x2a7192(0x103)](_0x5f0356,_0x3944e0,_0x54afd9)&&!_0x3cafaa[_0x2a7192(0xdd)+_0x3944e0[_0x2a7192(0x130)]()]){if(_0x5e5d4e++,_0x54afd9[_0x2a7192(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;break;}if(!_0x54afd9[_0x2a7192(0x111)]&&_0x54afd9[_0x2a7192(0xe1)]&&_0x54afd9[_0x2a7192(0x171)]>_0x54afd9[_0x2a7192(0xc9)]){_0x1d0e40=!0x0;break;}_0x191f7c[_0x2a7192(0xfb)](_0x3dc787['_addObjectProperty'](_0x1b03b5,_0x3cafaa,_0x5f0356,_0x292431,_0x3944e0,_0x54afd9));}}}}}if(_0x4436e4[_0x2a7192(0x8c)]=_0x292431,_0x47d0a8?(_0x4436e4[_0x2a7192(0x120)]=_0x5f0356[_0x2a7192(0x137)](),this[_0x2a7192(0x166)](_0x292431,_0x4436e4,_0x54afd9,_0x3c9191)):_0x292431===_0x2a7192(0x13b)?_0x4436e4['value']=this[_0x2a7192(0x129)]['call'](_0x5f0356):_0x292431===_0x2a7192(0x134)?_0x4436e4[_0x2a7192(0x120)]=_0x5f0356[_0x2a7192(0x130)]():_0x292431===_0x2a7192(0x104)?_0x4436e4[_0x2a7192(0x120)]=this[_0x2a7192(0xff)][_0x2a7192(0x123)](_0x5f0356):_0x292431===_0x2a7192(0xcc)&&this[_0x2a7192(0xf8)]?_0x4436e4['value']=this[_0x2a7192(0xf8)]['prototype'][_0x2a7192(0x130)][_0x2a7192(0x123)](_0x5f0356):!_0x54afd9[_0x2a7192(0x145)]&&!(_0x292431===_0x2a7192(0x14e)||_0x292431===_0x2a7192(0x108))&&(delete _0x4436e4[_0x2a7192(0x120)],_0x4436e4[_0x2a7192(0xd5)]=!0x0),_0x1d0e40&&(_0x4436e4[_0x2a7192(0x13a)]=!0x0),_0x24714b=_0x54afd9[_0x2a7192(0x13c)][_0x2a7192(0x156)],_0x54afd9[_0x2a7192(0x13c)][_0x2a7192(0x156)]=_0x4436e4,this['_treeNodePropertiesBeforeFullValue'](_0x4436e4,_0x54afd9),_0x191f7c['length']){for(_0x19b5df=0x0,_0x414ef1=_0x191f7c[_0x2a7192(0x9a)];_0x19b5df<_0x414ef1;_0x19b5df++)_0x191f7c[_0x19b5df](_0x19b5df);}_0x1b03b5[_0x2a7192(0x9a)]&&(_0x4436e4['props']=_0x1b03b5);}catch(_0x23d7d6){_0x1dd879(_0x23d7d6,_0x4436e4,_0x54afd9);}return this[_0x2a7192(0x13e)](_0x5f0356,_0x4436e4),this['_treeNodePropertiesAfterFullValue'](_0x4436e4,_0x54afd9),_0x54afd9[_0x2a7192(0x13c)][_0x2a7192(0x156)]=_0x24714b,_0x54afd9['level']--,_0x54afd9[_0x2a7192(0xe1)]=_0x1bd08d,_0x54afd9[_0x2a7192(0xe1)]&&_0x54afd9[_0x2a7192(0x99)][_0x2a7192(0x179)](),_0x4436e4;}['_getOwnPropertySymbols'](_0x2dce8d){var _0x52586e=_0x26411c;return Object[_0x52586e(0xad)]?Object['getOwnPropertySymbols'](_0x2dce8d):[];}[_0x26411c(0x114)](_0x5bb0ea){var _0x33dfa7=_0x26411c;return!!(_0x5bb0ea&&_0x590edb[_0x33dfa7(0x98)]&&this[_0x33dfa7(0x165)](_0x5bb0ea)===_0x33dfa7(0x118)&&_0x5bb0ea[_0x33dfa7(0x9d)]);}[_0x26411c(0x103)](_0x4d421a,_0x1f7f9c,_0x493d2f){var _0x294b30=_0x26411c;return _0x493d2f['noFunctions']?typeof _0x4d421a[_0x1f7f9c]==_0x294b30(0xf9):!0x1;}[_0x26411c(0x87)](_0x5e9324){var _0x6651d1=_0x26411c,_0x18914e='';return _0x18914e=typeof _0x5e9324,_0x18914e===_0x6651d1(0x105)?this[_0x6651d1(0x165)](_0x5e9324)==='[object\\x20Array]'?_0x18914e=_0x6651d1(0xa6):this[_0x6651d1(0x165)](_0x5e9324)===_0x6651d1(0x15f)?_0x18914e=_0x6651d1(0x13b):this[_0x6651d1(0x165)](_0x5e9324)===_0x6651d1(0x13d)?_0x18914e='bigint':_0x5e9324===null?_0x18914e=_0x6651d1(0x14e):_0x5e9324[_0x6651d1(0x115)]&&(_0x18914e=_0x5e9324['constructor']['name']||_0x18914e):_0x18914e==='undefined'&&this['_HTMLAllCollection']&&_0x5e9324 instanceof this[_0x6651d1(0xc0)]&&(_0x18914e='HTMLAllCollection'),_0x18914e;}['_objectToString'](_0x53fa44){var _0x2c3621=_0x26411c;return Object['prototype'][_0x2c3621(0x130)]['call'](_0x53fa44);}[_0x26411c(0xdc)](_0x432ff7){var _0x34e11e=_0x26411c;return _0x432ff7===_0x34e11e(0xd7)||_0x432ff7===_0x34e11e(0x178)||_0x432ff7===_0x34e11e(0x11e);}[_0x26411c(0x8e)](_0x2d3cb9){var _0x28f0fd=_0x26411c;return _0x2d3cb9===_0x28f0fd(0xfd)||_0x2d3cb9===_0x28f0fd(0xee)||_0x2d3cb9===_0x28f0fd(0xe5);}[_0x26411c(0x117)](_0xc5ba4c,_0x129fd3,_0x4725aa,_0x3d3271,_0x33adea,_0xdbd01d){var _0x580e1c=this;return function(_0x24a5bd){var _0x1e88f0=_0x3d40,_0x17e559=_0x33adea[_0x1e88f0(0x13c)][_0x1e88f0(0x156)],_0x2b941c=_0x33adea[_0x1e88f0(0x13c)][_0x1e88f0(0x8f)],_0x45aa56=_0x33adea[_0x1e88f0(0x13c)]['parent'];_0x33adea['node'][_0x1e88f0(0xe8)]=_0x17e559,_0x33adea[_0x1e88f0(0x13c)]['index']=typeof _0x3d3271==_0x1e88f0(0x11e)?_0x3d3271:_0x24a5bd,_0xc5ba4c['push'](_0x580e1c['_property'](_0x129fd3,_0x4725aa,_0x3d3271,_0x33adea,_0xdbd01d)),_0x33adea[_0x1e88f0(0x13c)]['parent']=_0x45aa56,_0x33adea[_0x1e88f0(0x13c)][_0x1e88f0(0x8f)]=_0x2b941c;};}['_addObjectProperty'](_0x254283,_0x295b96,_0x54609a,_0x79f8e,_0x430608,_0x23ab00,_0x4817f0){var _0x4dc98b=_0x26411c,_0x2d95b1=this;return _0x295b96[_0x4dc98b(0xdd)+_0x430608[_0x4dc98b(0x130)]()]=!0x0,function(_0x2048d3){var _0x3d60a1=_0x4dc98b,_0x21ec3d=_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x156)],_0x3e8f91=_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x8f)],_0x1f56e5=_0x23ab00['node'][_0x3d60a1(0xe8)];_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0xe8)]=_0x21ec3d,_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x8f)]=_0x2048d3,_0x254283['push'](_0x2d95b1[_0x3d60a1(0xcf)](_0x54609a,_0x79f8e,_0x430608,_0x23ab00,_0x4817f0)),_0x23ab00[_0x3d60a1(0x13c)]['parent']=_0x1f56e5,_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x8f)]=_0x3e8f91;};}['_property'](_0x4788b0,_0x4ba765,_0x281d9d,_0xe7b1a4,_0x28d7fa){var _0x3b86d2=_0x26411c,_0xd2514c=this;_0x28d7fa||(_0x28d7fa=function(_0x11d3b9,_0x53444c){return _0x11d3b9[_0x53444c];});var _0x5bc2d5=_0x281d9d[_0x3b86d2(0x130)](),_0x418c1c=_0xe7b1a4['expressionsToEvaluate']||{},_0x58772b=_0xe7b1a4[_0x3b86d2(0x145)],_0x2988d9=_0xe7b1a4[_0x3b86d2(0x111)];try{var _0x3c0b5c=this[_0x3b86d2(0x11c)](_0x4788b0),_0xa523c4=_0x5bc2d5;_0x3c0b5c&&_0xa523c4[0x0]==='\\x27'&&(_0xa523c4=_0xa523c4[_0x3b86d2(0x128)](0x1,_0xa523c4[_0x3b86d2(0x9a)]-0x2));var _0x43fb6a=_0xe7b1a4[_0x3b86d2(0xe9)]=_0x418c1c[_0x3b86d2(0xdd)+_0xa523c4];_0x43fb6a&&(_0xe7b1a4[_0x3b86d2(0x145)]=_0xe7b1a4[_0x3b86d2(0x145)]+0x1),_0xe7b1a4[_0x3b86d2(0x111)]=!!_0x43fb6a;var _0x5a8856=typeof _0x281d9d==_0x3b86d2(0xcc),_0xa06285={'name':_0x5a8856||_0x3c0b5c?_0x5bc2d5:this[_0x3b86d2(0xba)](_0x5bc2d5)};if(_0x5a8856&&(_0xa06285['symbol']=!0x0),!(_0x4ba765===_0x3b86d2(0xa6)||_0x4ba765==='Error')){var _0xbea973=this[_0x3b86d2(0xa5)](_0x4788b0,_0x281d9d);if(_0xbea973&&(_0xbea973['set']&&(_0xa06285[_0x3b86d2(0xab)]=!0x0),_0xbea973[_0x3b86d2(0x16b)]&&!_0x43fb6a&&!_0xe7b1a4['resolveGetters']))return _0xa06285[_0x3b86d2(0x167)]=!0x0,this[_0x3b86d2(0xf3)](_0xa06285,_0xe7b1a4),_0xa06285;}var _0x45d98a;try{_0x45d98a=_0x28d7fa(_0x4788b0,_0x281d9d);}catch(_0x3a4c92){return _0xa06285={'name':_0x5bc2d5,'type':_0x3b86d2(0x101),'error':_0x3a4c92['message']},this['_processTreeNodeResult'](_0xa06285,_0xe7b1a4),_0xa06285;}var _0x308036=this[_0x3b86d2(0x87)](_0x45d98a),_0x4b6d19=this['_isPrimitiveType'](_0x308036);if(_0xa06285['type']=_0x308036,_0x4b6d19)this['_processTreeNodeResult'](_0xa06285,_0xe7b1a4,_0x45d98a,function(){var _0x35b469=_0x3b86d2;_0xa06285['value']=_0x45d98a[_0x35b469(0x137)](),!_0x43fb6a&&_0xd2514c[_0x35b469(0x166)](_0x308036,_0xa06285,_0xe7b1a4,{});});else{var _0x27d579=_0xe7b1a4[_0x3b86d2(0xe1)]&&_0xe7b1a4[_0x3b86d2(0xf2)]<_0xe7b1a4['autoExpandMaxDepth']&&_0xe7b1a4[_0x3b86d2(0x99)]['indexOf'](_0x45d98a)<0x0&&_0x308036!==_0x3b86d2(0xf9)&&_0xe7b1a4['autoExpandPropertyCount']<_0xe7b1a4[_0x3b86d2(0xc9)];_0x27d579||_0xe7b1a4[_0x3b86d2(0xf2)]<_0x58772b||_0x43fb6a?(this[_0x3b86d2(0x9c)](_0xa06285,_0x45d98a,_0xe7b1a4,_0x43fb6a||{}),this[_0x3b86d2(0x13e)](_0x45d98a,_0xa06285)):this[_0x3b86d2(0xf3)](_0xa06285,_0xe7b1a4,_0x45d98a,function(){var _0x535495=_0x3b86d2;_0x308036===_0x535495(0x14e)||_0x308036===_0x535495(0x108)||(delete _0xa06285[_0x535495(0x120)],_0xa06285[_0x535495(0xd5)]=!0x0);});}return _0xa06285;}finally{_0xe7b1a4[_0x3b86d2(0xe9)]=_0x418c1c,_0xe7b1a4['depth']=_0x58772b,_0xe7b1a4['isExpressionToEvaluate']=_0x2988d9;}}[_0x26411c(0x166)](_0x35aaef,_0x347618,_0x560caa,_0x454b9a){var _0x248525=_0x26411c,_0x5863ba=_0x454b9a[_0x248525(0x173)]||_0x560caa['strLength'];if((_0x35aaef==='string'||_0x35aaef===_0x248525(0xee))&&_0x347618['value']){let _0x53b536=_0x347618[_0x248525(0x120)][_0x248525(0x9a)];_0x560caa[_0x248525(0xd6)]+=_0x53b536,_0x560caa[_0x248525(0xd6)]>_0x560caa['totalStrLength']?(_0x347618[_0x248525(0xd5)]='',delete _0x347618[_0x248525(0x120)]):_0x53b536>_0x5863ba&&(_0x347618[_0x248525(0xd5)]=_0x347618[_0x248525(0x120)]['substr'](0x0,_0x5863ba),delete _0x347618[_0x248525(0x120)]);}}[_0x26411c(0x11c)](_0x51bb45){var _0x2630ed=_0x26411c;return!!(_0x51bb45&&_0x590edb[_0x2630ed(0x162)]&&this['_objectToString'](_0x51bb45)==='[object\\x20Map]'&&_0x51bb45[_0x2630ed(0x9d)]);}[_0x26411c(0xba)](_0x5e187d){var _0x3986ff=_0x26411c;if(_0x5e187d['match'](/^\\d+$/))return _0x5e187d;var _0x7d246;try{_0x7d246=JSON['stringify'](''+_0x5e187d);}catch{_0x7d246='\\x22'+this[_0x3986ff(0x165)](_0x5e187d)+'\\x22';}return _0x7d246[_0x3986ff(0x11b)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x7d246=_0x7d246['substr'](0x1,_0x7d246['length']-0x2):_0x7d246=_0x7d246['replace'](/'/g,'\\x5c\\x27')['replace'](/\\\\\"/g,'\\x22')[_0x3986ff(0xbe)](/(^\"|\"$)/g,'\\x27'),_0x7d246;}[_0x26411c(0xf3)](_0x2e8411,_0x5c2a9f,_0x1c2b2e,_0x4f6662){var _0x25b658=_0x26411c;this[_0x25b658(0x12d)](_0x2e8411,_0x5c2a9f),_0x4f6662&&_0x4f6662(),this['_additionalMetadata'](_0x1c2b2e,_0x2e8411),this[_0x25b658(0x11d)](_0x2e8411,_0x5c2a9f);}[_0x26411c(0x12d)](_0x383b1a,_0x527297){var _0x5218a5=_0x26411c;this['_setNodeId'](_0x383b1a,_0x527297),this[_0x5218a5(0x154)](_0x383b1a,_0x527297),this['_setNodeExpressionPath'](_0x383b1a,_0x527297),this[_0x5218a5(0x121)](_0x383b1a,_0x527297);}[_0x26411c(0x93)](_0x4c2838,_0x386efd){}[_0x26411c(0x154)](_0x3ac128,_0x8b6f82){}[_0x26411c(0x160)](_0x151af9,_0xf01e30){}[_0x26411c(0x132)](_0xf2b921){var _0x2187e0=_0x26411c;return _0xf2b921===this[_0x2187e0(0x10e)];}[_0x26411c(0x11d)](_0x59d68d,_0x428395){var _0x3968a7=_0x26411c;this[_0x3968a7(0x160)](_0x59d68d,_0x428395),this['_setNodeExpandableState'](_0x59d68d),_0x428395['sortProps']&&this[_0x3968a7(0xa4)](_0x59d68d),this[_0x3968a7(0xeb)](_0x59d68d,_0x428395),this['_addLoadNode'](_0x59d68d,_0x428395),this[_0x3968a7(0x119)](_0x59d68d);}[_0x26411c(0x13e)](_0x33f398,_0x5c47e4){var _0x122b25=_0x26411c;let _0x3f1e6d;try{_0x590edb[_0x122b25(0x148)]&&(_0x3f1e6d=_0x590edb[_0x122b25(0x148)][_0x122b25(0x96)],_0x590edb[_0x122b25(0x148)][_0x122b25(0x96)]=function(){}),_0x33f398&&typeof _0x33f398[_0x122b25(0x9a)]==_0x122b25(0x11e)&&(_0x5c47e4['length']=_0x33f398[_0x122b25(0x9a)]);}catch{}finally{_0x3f1e6d&&(_0x590edb[_0x122b25(0x148)]['error']=_0x3f1e6d);}if(_0x5c47e4['type']===_0x122b25(0x11e)||_0x5c47e4['type']===_0x122b25(0xe5)){if(isNaN(_0x5c47e4[_0x122b25(0x120)]))_0x5c47e4['nan']=!0x0,delete _0x5c47e4['value'];else switch(_0x5c47e4[_0x122b25(0x120)]){case Number['POSITIVE_INFINITY']:_0x5c47e4[_0x122b25(0x17a)]=!0x0,delete _0x5c47e4[_0x122b25(0x120)];break;case Number[_0x122b25(0xe6)]:_0x5c47e4[_0x122b25(0x91)]=!0x0,delete _0x5c47e4['value'];break;case 0x0:this[_0x122b25(0x158)](_0x5c47e4[_0x122b25(0x120)])&&(_0x5c47e4[_0x122b25(0x102)]=!0x0);break;}}else _0x5c47e4[_0x122b25(0x8c)]===_0x122b25(0xf9)&&typeof _0x33f398[_0x122b25(0xce)]==_0x122b25(0x178)&&_0x33f398[_0x122b25(0xce)]&&_0x5c47e4[_0x122b25(0xce)]&&_0x33f398['name']!==_0x5c47e4[_0x122b25(0xce)]&&(_0x5c47e4[_0x122b25(0x15b)]=_0x33f398[_0x122b25(0xce)]);}[_0x26411c(0x158)](_0x5168ae){var _0xc4a3c4=_0x26411c;return 0x1/_0x5168ae===Number[_0xc4a3c4(0xe6)];}['_sortProps'](_0x126c5d){var _0x28a5d2=_0x26411c;!_0x126c5d[_0x28a5d2(0x11f)]||!_0x126c5d[_0x28a5d2(0x11f)][_0x28a5d2(0x9a)]||_0x126c5d[_0x28a5d2(0x8c)]===_0x28a5d2(0xa6)||_0x126c5d['type']===_0x28a5d2(0x162)||_0x126c5d[_0x28a5d2(0x8c)]==='Set'||_0x126c5d[_0x28a5d2(0x11f)][_0x28a5d2(0xc4)](function(_0x2a85e0,_0x61c77e){var _0x3bc366=_0x28a5d2,_0xfd7605=_0x2a85e0['name'][_0x3bc366(0xe2)](),_0x106aa8=_0x61c77e[_0x3bc366(0xce)][_0x3bc366(0xe2)]();return _0xfd7605<_0x106aa8?-0x1:_0xfd7605>_0x106aa8?0x1:0x0;});}['_addFunctionsNode'](_0x476723,_0x47dde7){var _0x220747=_0x26411c;if(!(_0x47dde7['noFunctions']||!_0x476723[_0x220747(0x11f)]||!_0x476723[_0x220747(0x11f)][_0x220747(0x9a)])){for(var _0x147f1f=[],_0x442191=[],_0x586557=0x0,_0x3b7c49=_0x476723[_0x220747(0x11f)][_0x220747(0x9a)];_0x586557<_0x3b7c49;_0x586557++){var _0x3e4e02=_0x476723[_0x220747(0x11f)][_0x586557];_0x3e4e02[_0x220747(0x8c)]===_0x220747(0xf9)?_0x147f1f['push'](_0x3e4e02):_0x442191[_0x220747(0xfb)](_0x3e4e02);}if(!(!_0x442191[_0x220747(0x9a)]||_0x147f1f[_0x220747(0x9a)]<=0x1)){_0x476723[_0x220747(0x11f)]=_0x442191;var _0x13f71b={'functionsNode':!0x0,'props':_0x147f1f};this[_0x220747(0x93)](_0x13f71b,_0x47dde7),this[_0x220747(0x160)](_0x13f71b,_0x47dde7),this['_setNodeExpandableState'](_0x13f71b),this[_0x220747(0x121)](_0x13f71b,_0x47dde7),_0x13f71b['id']+='\\x20f',_0x476723[_0x220747(0x11f)][_0x220747(0xaf)](_0x13f71b);}}}[_0x26411c(0x9f)](_0xfca237,_0x3a9809){}[_0x26411c(0x112)](_0x124197){}[_0x26411c(0x10d)](_0x48cbb9){var _0x3b18a8=_0x26411c;return Array[_0x3b18a8(0x89)](_0x48cbb9)||typeof _0x48cbb9=='object'&&this[_0x3b18a8(0x165)](_0x48cbb9)==='[object\\x20Array]';}[_0x26411c(0x121)](_0x3e9a39,_0x134589){}[_0x26411c(0x119)](_0x1303fb){var _0x483058=_0x26411c;delete _0x1303fb['_hasSymbolPropertyOnItsPath'],delete _0x1303fb[_0x483058(0xca)],delete _0x1303fb[_0x483058(0x126)];}[_0x26411c(0xf4)](_0x91cf2a,_0x25fafc){}}let _0x3a6644=new _0x26cce7(),_0x172c31={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0xaf5344={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x426b97(_0x4cf18a,_0x4379c2,_0x5242c0,_0x25eaa2,_0x23677a,_0xe5affb){var _0x454327=_0x26411c;let _0x543977,_0xe576ea;try{_0xe576ea=_0x320a81(),_0x543977=_0x398f4c[_0x4379c2],!_0x543977||_0xe576ea-_0x543977['ts']>0x1f4&&_0x543977[_0x454327(0xa8)]&&_0x543977[_0x454327(0x153)]/_0x543977[_0x454327(0xa8)]<0x64?(_0x398f4c[_0x4379c2]=_0x543977={'count':0x0,'time':0x0,'ts':_0xe576ea},_0x398f4c['hits']={}):_0xe576ea-_0x398f4c['hits']['ts']>0x32&&_0x398f4c[_0x454327(0x10b)][_0x454327(0xa8)]&&_0x398f4c[_0x454327(0x10b)][_0x454327(0x153)]/_0x398f4c[_0x454327(0x10b)]['count']<0x64&&(_0x398f4c[_0x454327(0x10b)]={});let _0x29ad33=[],_0x278b35=_0x543977[_0x454327(0xa1)]||_0x398f4c[_0x454327(0x10b)][_0x454327(0xa1)]?_0xaf5344:_0x172c31,_0x26bf49=_0x2f7fa9=>{var _0x152af1=_0x454327;let _0x1ab900={};return _0x1ab900[_0x152af1(0x11f)]=_0x2f7fa9[_0x152af1(0x11f)],_0x1ab900[_0x152af1(0xf1)]=_0x2f7fa9['elements'],_0x1ab900[_0x152af1(0x173)]=_0x2f7fa9[_0x152af1(0x173)],_0x1ab900['totalStrLength']=_0x2f7fa9['totalStrLength'],_0x1ab900[_0x152af1(0xc9)]=_0x2f7fa9[_0x152af1(0xc9)],_0x1ab900[_0x152af1(0xbb)]=_0x2f7fa9[_0x152af1(0xbb)],_0x1ab900['sortProps']=!0x1,_0x1ab900['noFunctions']=!_0x21bf16,_0x1ab900[_0x152af1(0x145)]=0x1,_0x1ab900['level']=0x0,_0x1ab900[_0x152af1(0xcd)]='root_exp_id',_0x1ab900[_0x152af1(0x10a)]=_0x152af1(0xbc),_0x1ab900[_0x152af1(0xe1)]=!0x0,_0x1ab900[_0x152af1(0x99)]=[],_0x1ab900[_0x152af1(0x171)]=0x0,_0x1ab900[_0x152af1(0xea)]=!0x0,_0x1ab900[_0x152af1(0xd6)]=0x0,_0x1ab900['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x1ab900;};for(var _0x3533fe=0x0;_0x3533fe<_0x23677a[_0x454327(0x9a)];_0x3533fe++)_0x29ad33[_0x454327(0xfb)](_0x3a6644[_0x454327(0x9c)]({'timeNode':_0x4cf18a===_0x454327(0x153)||void 0x0},_0x23677a[_0x3533fe],_0x26bf49(_0x278b35),{}));if(_0x4cf18a===_0x454327(0xc1)||_0x4cf18a===_0x454327(0x96)){let _0x26251c=Error[_0x454327(0x14f)];try{Error[_0x454327(0x14f)]=0x1/0x0,_0x29ad33[_0x454327(0xfb)](_0x3a6644[_0x454327(0x9c)]({'stackNode':!0x0},new Error()[_0x454327(0xe3)],_0x26bf49(_0x278b35),{'strLength':0x1/0x0}));}finally{Error[_0x454327(0x14f)]=_0x26251c;}}return{'method':_0x454327(0x12f),'version':_0x22e72b,'args':[{'ts':_0x5242c0,'session':_0x25eaa2,'args':_0x29ad33,'id':_0x4379c2,'context':_0xe5affb}]};}catch(_0x22be6e){return{'method':_0x454327(0x12f),'version':_0x22e72b,'args':[{'ts':_0x5242c0,'session':_0x25eaa2,'args':[{'type':_0x454327(0x101),'error':_0x22be6e&&_0x22be6e[_0x454327(0x135)]}],'id':_0x4379c2,'context':_0xe5affb}]};}finally{try{if(_0x543977&&_0xe576ea){let _0x5d23b3=_0x320a81();_0x543977[_0x454327(0xa8)]++,_0x543977[_0x454327(0x153)]+=_0x1122c5(_0xe576ea,_0x5d23b3),_0x543977['ts']=_0x5d23b3,_0x398f4c['hits']['count']++,_0x398f4c[_0x454327(0x10b)]['time']+=_0x1122c5(_0xe576ea,_0x5d23b3),_0x398f4c[_0x454327(0x10b)]['ts']=_0x5d23b3,(_0x543977[_0x454327(0xa8)]>0x32||_0x543977['time']>0x64)&&(_0x543977[_0x454327(0xa1)]=!0x0),(_0x398f4c['hits'][_0x454327(0xa8)]>0x3e8||_0x398f4c['hits'][_0x454327(0x153)]>0x12c)&&(_0x398f4c[_0x454327(0x10b)][_0x454327(0xa1)]=!0x0);}}catch{}}}return _0x426b97;}function _0x2a70(){var _0x3584c1=['disabledTrace','onmessage','cappedElements','6042090CgAzmV','eventReceivedCallback','stringify','Symbol','','WebSocket','_propertyName','autoExpandMaxDepth','root_exp','origin','replace','onerror','_HTMLAllCollection','trace','next.js','startsWith','sort','_allowedToConnectOnSend','create','818764zxuWQl','_disposeWebsocket','autoExpandLimit','_hasSetOnItsPath','dockerizedApp','symbol','expId','name','_property','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','method','_webSocketErrorDocsLink','getOwnPropertyDescriptor','7578174BdpXnb','capped','allStrLength','boolean','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','logger\\x20websocket\\x20error','6xKNeJh','angular','_isPrimitiveType','_p_','charAt','52921','_inBrowser','autoExpand','toLowerCase','stack','_connecting','Number','NEGATIVE_INFINITY','\\x20server','parent','expressionsToEvaluate','resolveGetters','_addFunctionsNode','prototype','unref','String','process','hostname','elements','level','_processTreeNodeResult','_setNodeExpressionPath','global','hrtime','webpack','_Symbol','function','_p_length','push','warn','Boolean','_console_ninja_session','_regExpToString','map','unknown','negativeZero','_blacklistedProperty','RegExp','object','includes','Buffer','undefined','_ninjaIgnoreNextError','rootExpression','hits','join','_isArray','_undefined','10QVNzSb','edge','isExpressionToEvaluate','_setNodeExpandableState','1740011897523','_isSet','constructor','_allowedToSend','_addProperty','[object\\x20Set]','_cleanNode','3MbEWzf','match','_isMap','_treeNodePropertiesAfterFullValue','number','props','value','_setNodePermissions','991060nPJBnG','call','now','coverage','_hasMapOnItsPath','_p_name','substr','_dateToString','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','__es'+'Module','_inNextEdge','_treeNodePropertiesBeforeFullValue','astro','log','toString','_socket','_isUndefined','1','bigint','message','\\x20browser','valueOf','4092HwsDgw','some','cappedProps','date','node','[object\\x20BigInt]','_additionalMetadata','_connectToHostNow','split','getWebSocketClass','_WebSocketClass','hasOwnProperty',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"DESKTOP-R1J9TOD\",\"192.168.1.12\"],'depth',\"c:\\\\Users\\\\User\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.391\\\\node_modules\",'_attemptToReconnectShortly','console','1.0.0','NEXT_RUNTIME','_sendErrorMessage','readyState','HTMLAllCollection','null','stackTraceLimit','_connected','data','_quotedRegExp','time','_setNodeQueryPath','onclose','current','_getOwnPropertySymbols','_isNegativeZero','parse','ws/index.js','funcName','slice','catch','','[object\\x20Date]','_setNodeLabel','performance','Map','send','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','_objectToString','_capIfString','getter','args','host','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','get','_reconnectTimeout','_console_ninja','_ws','115082ZSTJMq','9000720UywTbh','autoExpandPropertyCount','_getOwnPropertyNames','strLength','_addObjectProperty','remix','concat','location','string','pop','positiveInfinity','endsWith','test','getOwnPropertyNames','versions','_type','gateway.docker.internal','isArray','_WebSocket','ws://','type','https://tinyurl.com/37x8b79t','_isPrimitiveWrapperType','index','_maxConnectAttemptCount','negativeInfinity','elapsed','_setNodeId','onopen','port','error','path','Set','autoExpandPreviousObjects','length','env','serialize','forEach','perf_hooks','_addLoadNode','enumerable','reduceLimits','fromCharCode','then','_sortProps','_getOwnPropertyDescriptor','array','7OrVkyi','count','_connectAttemptCount','6695307yiLwBQ','setter','timeStamp','getOwnPropertySymbols','nodeModules','unshift','_consoleNinjaAllowedToStart'];_0x2a70=function(){return _0x3584c1;};return _0x2a70();}((_0x5d07da,_0x3df2e9,_0x906129,_0x19bae4,_0x5cfb6b,_0x3a5a02,_0x58c00a,_0x4e9e86,_0x15965d,_0xdbcbfa,_0x42357c)=>{var _0xc7f056=_0x451048;if(_0x5d07da[_0xc7f056(0x16d)])return _0x5d07da[_0xc7f056(0x16d)];if(!H(_0x5d07da,_0x4e9e86,_0x5cfb6b))return _0x5d07da['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5d07da[_0xc7f056(0x16d)];let _0x4fa6a7=B(_0x5d07da),_0x1bd88e=_0x4fa6a7[_0xc7f056(0x92)],_0xb765b7=_0x4fa6a7['timeStamp'],_0x9098d6=_0x4fa6a7[_0xc7f056(0x124)],_0x5eb058={'hits':{},'ts':{}},_0x4b3b57=X(_0x5d07da,_0x15965d,_0x5eb058,_0x3a5a02),_0x351af3=_0x2ff423=>{_0x5eb058['ts'][_0x2ff423]=_0xb765b7();},_0x532fb1=(_0x362745,_0x5f522b)=>{var _0x21ff59=_0xc7f056;let _0x1cb1e8=_0x5eb058['ts'][_0x5f522b];if(delete _0x5eb058['ts'][_0x5f522b],_0x1cb1e8){let _0x396a25=_0x1bd88e(_0x1cb1e8,_0xb765b7());_0x24b81f(_0x4b3b57(_0x21ff59(0x153),_0x362745,_0x9098d6(),_0x1bc123,[_0x396a25],_0x5f522b));}},_0x48f972=_0x476b03=>{var _0x47eca1=_0xc7f056,_0x58e162;return _0x5cfb6b===_0x47eca1(0xc2)&&_0x5d07da['origin']&&((_0x58e162=_0x476b03==null?void 0x0:_0x476b03[_0x47eca1(0x168)])==null?void 0x0:_0x58e162[_0x47eca1(0x9a)])&&(_0x476b03[_0x47eca1(0x168)][0x0][_0x47eca1(0xbd)]=_0x5d07da[_0x47eca1(0xbd)]),_0x476b03;};_0x5d07da[_0xc7f056(0x16d)]={'consoleLog':(_0x4e818a,_0x201510)=>{var _0x3aa2a4=_0xc7f056;_0x5d07da[_0x3aa2a4(0x148)][_0x3aa2a4(0x12f)][_0x3aa2a4(0xce)]!=='disabledLog'&&_0x24b81f(_0x4b3b57(_0x3aa2a4(0x12f),_0x4e818a,_0x9098d6(),_0x1bc123,_0x201510));},'consoleTrace':(_0x2cb281,_0x1d8d94)=>{var _0x5484aa=_0xc7f056,_0x640f5,_0x59c013;_0x5d07da[_0x5484aa(0x148)][_0x5484aa(0x12f)][_0x5484aa(0xce)]!==_0x5484aa(0xb1)&&((_0x59c013=(_0x640f5=_0x5d07da[_0x5484aa(0xef)])==null?void 0x0:_0x640f5[_0x5484aa(0x17e)])!=null&&_0x59c013[_0x5484aa(0x13c)]&&(_0x5d07da[_0x5484aa(0x109)]=!0x0),_0x24b81f(_0x48f972(_0x4b3b57(_0x5484aa(0xc1),_0x2cb281,_0x9098d6(),_0x1bc123,_0x1d8d94))));},'consoleError':(_0x429a2b,_0x106ad5)=>{var _0x2c83ab=_0xc7f056;_0x5d07da[_0x2c83ab(0x109)]=!0x0,_0x24b81f(_0x48f972(_0x4b3b57(_0x2c83ab(0x96),_0x429a2b,_0x9098d6(),_0x1bc123,_0x106ad5)));},'consoleTime':_0x25cb8c=>{_0x351af3(_0x25cb8c);},'consoleTimeEnd':(_0x5e4c22,_0x154d36)=>{_0x532fb1(_0x154d36,_0x5e4c22);},'autoLog':(_0x13432c,_0x5b7b7f)=>{var _0x4d7589=_0xc7f056;_0x24b81f(_0x4b3b57(_0x4d7589(0x12f),_0x5b7b7f,_0x9098d6(),_0x1bc123,[_0x13432c]));},'autoLogMany':(_0x5b47b3,_0x2d492b)=>{var _0xc41fb7=_0xc7f056;_0x24b81f(_0x4b3b57(_0xc41fb7(0x12f),_0x5b47b3,_0x9098d6(),_0x1bc123,_0x2d492b));},'autoTrace':(_0xc21545,_0x2da1b6)=>{var _0x545be4=_0xc7f056;_0x24b81f(_0x48f972(_0x4b3b57(_0x545be4(0xc1),_0x2da1b6,_0x9098d6(),_0x1bc123,[_0xc21545])));},'autoTraceMany':(_0x48458a,_0x4b932f)=>{var _0x538723=_0xc7f056;_0x24b81f(_0x48f972(_0x4b3b57(_0x538723(0xc1),_0x48458a,_0x9098d6(),_0x1bc123,_0x4b932f)));},'autoTime':(_0x44f8c9,_0x1f1e7b,_0x5f3172)=>{_0x351af3(_0x5f3172);},'autoTimeEnd':(_0x153ed4,_0x587f14,_0x510a3c)=>{_0x532fb1(_0x587f14,_0x510a3c);},'coverage':_0x43326a=>{var _0x4b578b=_0xc7f056;_0x24b81f({'method':_0x4b578b(0x125),'version':_0x3a5a02,'args':[{'id':_0x43326a}]});}};let _0x24b81f=q(_0x5d07da,_0x3df2e9,_0x906129,_0x19bae4,_0x5cfb6b,_0xdbcbfa,_0x42357c),_0x1bc123=_0x5d07da[_0xc7f056(0xfe)];return _0x5d07da[_0xc7f056(0x16d)];})(globalThis,'127.0.0.1',_0x451048(0xdf),_0x451048(0x146),_0x451048(0xf7),_0x451048(0x149),_0x451048(0x113),_0x451048(0x144),_0x451048(0xb8),_0x451048(0x15e),_0x451048(0x133));");
  } catch (e) {}
}
; /* istanbul ignore next */
function oo_oo(i, ...v) {
  try {
    oo_cm().consoleLog(i, v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_tr(i, ...v) {
  try {
    oo_cm().consoleTrace(i, v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_tx(i, ...v) {
  try {
    oo_cm().consoleError(i, v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_ts(v) {
  try {
    oo_cm().consoleTime(v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_te(v, i) {
  try {
    oo_cm().consoleTimeEnd(v, i);
  } catch (e) {}
  return v;
}
; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/

/***/ }),

/***/ "./src/modules/Search.js":
/*!*******************************!*\
  !*** ./src/modules/Search.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    this.addSearchHTML();
    this.resultsDiv = document.querySelector('#search-overlay__results');
    this.openButton = document.querySelectorAll('.js-search-trigger');
    this.closeButton = document.querySelector('.search-overlay__close');
    this.searchOverlay = document.querySelector('.search-overlay');
    this.searchField = document.querySelector('#search-term');
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.previousValue;
    this.typingTimer;
    this.events();
  }

  // 2. events
  events() {
    this.openButton.forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.openOverlay();
      });
    });
    this.closeButton.addEventListener('click', () => this.closeOverlay());
    document.addEventListener('keydown', e => this.keyPressDispatcher(e));
    this.searchField.addEventListener('keyup', () => this.typingLogic());
  }

  // 3. methods (function, action...)
  typingLogic() {
    if (this.searchField.value != this.previousValue) {
      clearTimeout(this.typingTimer);
      if (this.searchField.value) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750);
      } else {
        this.resultsDiv.innerHTML = '';
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchField.value;
  }
  async getResults() {
    try {
      const response = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.value);
      const results = response.data;
      this.resultsDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search.</p>'}
              ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
            ${results.generalInfo.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
              ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.programs.length ? '</ul>' : ''}

            <h2 class="search-overlay__section-title">Professors</h2>
            ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search.</p>`}
              ${results.professors.map(item => `
                <li class="professor-card__list-item">
                  <a class="professor-card" href="${item.permalink}">
                    <img class="professor-card__image" src="${item.image}">
                    <span class="professor-card__name">${item.title}</span>
                  </a>
                </li>
              `).join('')}
            ${results.professors.length ? '</ul>' : ''}

          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
              ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.campuses.length ? '</ul>' : ''}

            <h2 class="search-overlay__section-title">Events</h2>
            ${results.events.length ? '' : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p>`}
              ${results.events.map(item => `
                <div class="event-summary">
                  <a class="event-summary__date t-center" href="${item.permalink}">
                    <span class="event-summary__month">${item.month}</span>
                    <span class="event-summary__day">${item.day}</span>  
                  </a>
                  <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                    <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
                  </div>
                </div>
              `).join('')}

          </div>
        </div>
      `;
      this.isSpinnerVisible = false;
    } catch (e) {
      /* eslint-disable */console.log(...oo_oo(`3351293904_159_6_159_20_4`, e));
    }
  }
  keyPressDispatcher(e) {
    if (e.keyCode == 83 && !this.isOverlayOpen && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
      this.openOverlay();
    }
    if (e.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }
  openOverlay() {
    this.searchOverlay.classList.add('search-overlay--active');
    document.body.classList.add('body-no-scroll');
    this.searchField.value = '';
    setTimeout(() => this.searchField.focus(), 301);
    /* eslint-disable */
    console.log(...oo_oo(`3351293904_183_4_183_44_4`, 'our open method just ran!'));
    this.isOverlayOpen = true;
    return false;
  }
  closeOverlay() {
    this.searchOverlay.classList.remove('search-overlay--active');
    document.body.classList.remove('body-no-scroll');
    /* eslint-disable */
    console.log(...oo_oo(`3351293904_191_4_191_45_4`, 'our close method just ran!'));
    this.isOverlayOpen = false;
  }
  addSearchHTML() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        
        <div class="container">
          <div id="search-overlay__results"></div>
        </div>

      </div>
    `);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Search);
/* istanbul ignore next */ /* c8 ignore start */ /* eslint-disable */
;
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x3d40(_0x42c408,_0x1687bd){var _0x2a707f=_0x2a70();return _0x3d40=function(_0x3d4044,_0x56e842){_0x3d4044=_0x3d4044-0x87;var _0x253dda=_0x2a707f[_0x3d4044];return _0x253dda;},_0x3d40(_0x42c408,_0x1687bd);}var _0x451048=_0x3d40;(function(_0x286a4e,_0x426f1f){var _0x369c54=_0x3d40,_0x4d7d73=_0x286a4e();while(!![]){try{var _0x36b423=parseInt(_0x369c54(0x11a))/0x1*(-parseInt(_0x369c54(0xc7))/0x2)+parseInt(_0x369c54(0xda))/0x3*(parseInt(_0x369c54(0x122))/0x4)+-parseInt(_0x369c54(0xb4))/0x5+-parseInt(_0x369c54(0xd4))/0x6+parseInt(_0x369c54(0xa7))/0x7*(parseInt(_0x369c54(0x170))/0x8)+-parseInt(_0x369c54(0xaa))/0x9*(parseInt(_0x369c54(0x10f))/0xa)+parseInt(_0x369c54(0x16f))/0xb*(parseInt(_0x369c54(0x138))/0xc);if(_0x36b423===_0x426f1f)break;else _0x4d7d73['push'](_0x4d7d73['shift']());}catch(_0x345424){_0x4d7d73['push'](_0x4d7d73['shift']());}}}(_0x2a70,0xb5cc6));var K=Object[_0x451048(0xc6)],Q=Object['defineProperty'],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x451048(0x17d)],te=Object['getPrototypeOf'],ne=Object[_0x451048(0xec)][_0x451048(0x143)],re=(_0x98bfb5,_0x34d902,_0x32d0f7,_0x71ab72)=>{var _0x21fc19=_0x451048;if(_0x34d902&&typeof _0x34d902==_0x21fc19(0x105)||typeof _0x34d902==_0x21fc19(0xf9)){for(let _0x1202a5 of ee(_0x34d902))!ne['call'](_0x98bfb5,_0x1202a5)&&_0x1202a5!==_0x32d0f7&&Q(_0x98bfb5,_0x1202a5,{'get':()=>_0x34d902[_0x1202a5],'enumerable':!(_0x71ab72=G(_0x34d902,_0x1202a5))||_0x71ab72[_0x21fc19(0xa0)]});}return _0x98bfb5;},V=(_0x3de2cc,_0x29c45e,_0x3ec42b)=>(_0x3ec42b=_0x3de2cc!=null?K(te(_0x3de2cc)):{},re(_0x29c45e||!_0x3de2cc||!_0x3de2cc[_0x451048(0x12b)]?Q(_0x3ec42b,'default',{'value':_0x3de2cc,'enumerable':!0x0}):_0x3ec42b,_0x3de2cc)),Z=class{constructor(_0x23af2e,_0x3e6118,_0x4c5b80,_0x532e7e,_0x2186d6,_0x344f92){var _0x3b3bff=_0x451048,_0x5926d3,_0x9355bb,_0x5bd177,_0x28a2d7;this['global']=_0x23af2e,this[_0x3b3bff(0x169)]=_0x3e6118,this[_0x3b3bff(0x95)]=_0x4c5b80,this[_0x3b3bff(0xae)]=_0x532e7e,this[_0x3b3bff(0xcb)]=_0x2186d6,this['eventReceivedCallback']=_0x344f92,this['_allowedToSend']=!0x0,this[_0x3b3bff(0xc5)]=!0x0,this[_0x3b3bff(0x150)]=!0x1,this[_0x3b3bff(0xe4)]=!0x1,this[_0x3b3bff(0x12c)]=((_0x9355bb=(_0x5926d3=_0x23af2e['process'])==null?void 0x0:_0x5926d3[_0x3b3bff(0x9b)])==null?void 0x0:_0x9355bb[_0x3b3bff(0x14a)])===_0x3b3bff(0x110),this[_0x3b3bff(0xe0)]=!((_0x28a2d7=(_0x5bd177=this['global'][_0x3b3bff(0xef)])==null?void 0x0:_0x5bd177[_0x3b3bff(0x17e)])!=null&&_0x28a2d7[_0x3b3bff(0x13c)])&&!this['_inNextEdge'],this[_0x3b3bff(0x142)]=null,this[_0x3b3bff(0xa9)]=0x0,this[_0x3b3bff(0x90)]=0x14,this[_0x3b3bff(0xd2)]=_0x3b3bff(0x8d),this[_0x3b3bff(0x14b)]=(this['_inBrowser']?_0x3b3bff(0xd0):'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20')+this[_0x3b3bff(0xd2)];}async[_0x451048(0x141)](){var _0x2a3e50=_0x451048,_0x3f02fa,_0x445663;if(this[_0x2a3e50(0x142)])return this[_0x2a3e50(0x142)];let _0x16711e;if(this[_0x2a3e50(0xe0)]||this[_0x2a3e50(0x12c)])_0x16711e=this[_0x2a3e50(0xf5)][_0x2a3e50(0xb9)];else{if((_0x3f02fa=this[_0x2a3e50(0xf5)][_0x2a3e50(0xef)])!=null&&_0x3f02fa[_0x2a3e50(0x8a)])_0x16711e=(_0x445663=this[_0x2a3e50(0xf5)][_0x2a3e50(0xef)])==null?void 0x0:_0x445663[_0x2a3e50(0x8a)];else try{let _0x52ee16=await import(_0x2a3e50(0x97));_0x16711e=(await import((await import('url'))['pathToFileURL'](_0x52ee16[_0x2a3e50(0x10c)](this[_0x2a3e50(0xae)],_0x2a3e50(0x15a)))[_0x2a3e50(0x130)]()))['default'];}catch{try{_0x16711e=require(require(_0x2a3e50(0x97))['join'](this[_0x2a3e50(0xae)],'ws'));}catch{throw new Error(_0x2a3e50(0x12a));}}}return this[_0x2a3e50(0x142)]=_0x16711e,_0x16711e;}['_connectToHostNow'](){var _0x26ba8c=_0x451048;this[_0x26ba8c(0xe4)]||this[_0x26ba8c(0x150)]||this[_0x26ba8c(0xa9)]>=this[_0x26ba8c(0x90)]||(this['_allowedToConnectOnSend']=!0x1,this[_0x26ba8c(0xe4)]=!0x0,this[_0x26ba8c(0xa9)]++,this[_0x26ba8c(0x16e)]=new Promise((_0x58a758,_0x55d5e9)=>{var _0x10cc33=_0x26ba8c;this['getWebSocketClass']()[_0x10cc33(0xa3)](_0x307ec8=>{var _0x10bab6=_0x10cc33;let _0x19f3e9=new _0x307ec8(_0x10bab6(0x8b)+(!this[_0x10bab6(0xe0)]&&this[_0x10bab6(0xcb)]?_0x10bab6(0x88):this['host'])+':'+this['port']);_0x19f3e9[_0x10bab6(0xbf)]=()=>{var _0x2c4671=_0x10bab6;this[_0x2c4671(0x116)]=!0x1,this[_0x2c4671(0xc8)](_0x19f3e9),this[_0x2c4671(0x147)](),_0x55d5e9(new Error(_0x2c4671(0xd9)));},_0x19f3e9['onopen']=()=>{var _0x23625a=_0x10bab6;this[_0x23625a(0xe0)]||_0x19f3e9[_0x23625a(0x131)]&&_0x19f3e9['_socket'][_0x23625a(0xed)]&&_0x19f3e9[_0x23625a(0x131)]['unref'](),_0x58a758(_0x19f3e9);},_0x19f3e9[_0x10bab6(0x155)]=()=>{var _0x4e0266=_0x10bab6;this[_0x4e0266(0xc5)]=!0x0,this[_0x4e0266(0xc8)](_0x19f3e9),this[_0x4e0266(0x147)]();},_0x19f3e9[_0x10bab6(0xb2)]=_0x51000a=>{var _0x4084b7=_0x10bab6;try{if(!(_0x51000a!=null&&_0x51000a['data'])||!this[_0x4084b7(0xb5)])return;let _0x42142e=JSON[_0x4084b7(0x159)](_0x51000a[_0x4084b7(0x151)]);this[_0x4084b7(0xb5)](_0x42142e[_0x4084b7(0xd1)],_0x42142e[_0x4084b7(0x168)],this[_0x4084b7(0xf5)],this['_inBrowser']);}catch{}};})[_0x10cc33(0xa3)](_0x418077=>(this[_0x10cc33(0x150)]=!0x0,this[_0x10cc33(0xe4)]=!0x1,this[_0x10cc33(0xc5)]=!0x1,this['_allowedToSend']=!0x0,this['_connectAttemptCount']=0x0,_0x418077))[_0x10cc33(0x15d)](_0x2aa232=>(this[_0x10cc33(0x150)]=!0x1,this[_0x10cc33(0xe4)]=!0x1,console[_0x10cc33(0xfc)](_0x10cc33(0xd8)+this[_0x10cc33(0xd2)]),_0x55d5e9(new Error(_0x10cc33(0x16a)+(_0x2aa232&&_0x2aa232[_0x10cc33(0x135)])))));}));}['_disposeWebsocket'](_0x334f8f){var _0x44c482=_0x451048;this[_0x44c482(0x150)]=!0x1,this[_0x44c482(0xe4)]=!0x1;try{_0x334f8f['onclose']=null,_0x334f8f[_0x44c482(0xbf)]=null,_0x334f8f[_0x44c482(0x94)]=null;}catch{}try{_0x334f8f[_0x44c482(0x14c)]<0x2&&_0x334f8f['close']();}catch{}}[_0x451048(0x147)](){var _0xc8d992=_0x451048;clearTimeout(this[_0xc8d992(0x16c)]),!(this['_connectAttemptCount']>=this['_maxConnectAttemptCount'])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x3c45b3=_0xc8d992,_0x3720fc;this[_0x3c45b3(0x150)]||this['_connecting']||(this[_0x3c45b3(0x13f)](),(_0x3720fc=this[_0x3c45b3(0x16e)])==null||_0x3720fc['catch'](()=>this['_attemptToReconnectShortly']()));},0x1f4),this[_0xc8d992(0x16c)][_0xc8d992(0xed)]&&this[_0xc8d992(0x16c)]['unref']());}async[_0x451048(0x163)](_0x1c61df){var _0x504051=_0x451048;try{if(!this[_0x504051(0x116)])return;this[_0x504051(0xc5)]&&this[_0x504051(0x13f)](),(await this['_ws'])[_0x504051(0x163)](JSON[_0x504051(0xb6)](_0x1c61df));}catch(_0xd5459b){console[_0x504051(0xfc)](this[_0x504051(0x14b)]+':\\x20'+(_0xd5459b&&_0xd5459b['message'])),this[_0x504051(0x116)]=!0x1,this[_0x504051(0x147)]();}}};function q(_0x266c5b,_0x4603a0,_0x1f24cc,_0x16a558,_0x1bd09d,_0x72b80e,_0x2a3f25,_0x1e9981=ie){var _0x224724=_0x451048;let _0x41b157=_0x1f24cc[_0x224724(0x140)](',')[_0x224724(0x100)](_0x47e497=>{var _0x4d039e=_0x224724,_0x55b4fb,_0x320617,_0x777820,_0x5632c6;try{if(!_0x266c5b[_0x4d039e(0xfe)]){let _0x79bc1a=((_0x320617=(_0x55b4fb=_0x266c5b[_0x4d039e(0xef)])==null?void 0x0:_0x55b4fb[_0x4d039e(0x17e)])==null?void 0x0:_0x320617['node'])||((_0x5632c6=(_0x777820=_0x266c5b[_0x4d039e(0xef)])==null?void 0x0:_0x777820[_0x4d039e(0x9b)])==null?void 0x0:_0x5632c6[_0x4d039e(0x14a)])==='edge';(_0x1bd09d===_0x4d039e(0xc2)||_0x1bd09d===_0x4d039e(0x175)||_0x1bd09d===_0x4d039e(0x12e)||_0x1bd09d===_0x4d039e(0xdb))&&(_0x1bd09d+=_0x79bc1a?_0x4d039e(0xe7):_0x4d039e(0x136)),_0x266c5b[_0x4d039e(0xfe)]={'id':+new Date(),'tool':_0x1bd09d},_0x2a3f25&&_0x1bd09d&&!_0x79bc1a&&console['log']('%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20'+(_0x1bd09d[_0x4d039e(0xde)](0x0)['toUpperCase']()+_0x1bd09d[_0x4d039e(0x128)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)',_0x4d039e(0x164));}let _0x3ef58c=new Z(_0x266c5b,_0x4603a0,_0x47e497,_0x16a558,_0x72b80e,_0x1e9981);return _0x3ef58c[_0x4d039e(0x163)]['bind'](_0x3ef58c);}catch(_0xa9a168){return console['warn']('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0xa9a168&&_0xa9a168[_0x4d039e(0x135)]),()=>{};}});return _0x5aef02=>_0x41b157[_0x224724(0x9d)](_0x2dad3b=>_0x2dad3b(_0x5aef02));}function ie(_0x27b204,_0x34b1f5,_0x31c6ab,_0x1e9d57){var _0x53cf09=_0x451048;_0x1e9d57&&_0x27b204==='reload'&&_0x31c6ab[_0x53cf09(0x177)]['reload']();}function B(_0x12e76d){var _0x1155aa=_0x451048,_0x4bc5e9,_0x6b55a9;let _0x5d86b1=function(_0xce5f3f,_0x2bd206){return _0x2bd206-_0xce5f3f;},_0x18bf29;if(_0x12e76d[_0x1155aa(0x161)])_0x18bf29=function(){var _0x27a7ff=_0x1155aa;return _0x12e76d[_0x27a7ff(0x161)]['now']();};else{if(_0x12e76d[_0x1155aa(0xef)]&&_0x12e76d['process'][_0x1155aa(0xf6)]&&((_0x6b55a9=(_0x4bc5e9=_0x12e76d[_0x1155aa(0xef)])==null?void 0x0:_0x4bc5e9[_0x1155aa(0x9b)])==null?void 0x0:_0x6b55a9['NEXT_RUNTIME'])!=='edge')_0x18bf29=function(){var _0x419b63=_0x1155aa;return _0x12e76d[_0x419b63(0xef)][_0x419b63(0xf6)]();},_0x5d86b1=function(_0xafde2f,_0x1fb9ff){return 0x3e8*(_0x1fb9ff[0x0]-_0xafde2f[0x0])+(_0x1fb9ff[0x1]-_0xafde2f[0x1])/0xf4240;};else try{let {performance:_0xc4ea2e}=require(_0x1155aa(0x9e));_0x18bf29=function(){var _0x3b5d01=_0x1155aa;return _0xc4ea2e[_0x3b5d01(0x124)]();};}catch{_0x18bf29=function(){return+new Date();};}}return{'elapsed':_0x5d86b1,'timeStamp':_0x18bf29,'now':()=>Date[_0x1155aa(0x124)]()};}function H(_0x84db9a,_0x5c571c,_0x2d6671){var _0x1cb2c6=_0x451048,_0x554175,_0x372ab7,_0x594887,_0x528bd2,_0x26717e;if(_0x84db9a[_0x1cb2c6(0xb0)]!==void 0x0)return _0x84db9a['_consoleNinjaAllowedToStart'];let _0x231a1b=((_0x372ab7=(_0x554175=_0x84db9a['process'])==null?void 0x0:_0x554175['versions'])==null?void 0x0:_0x372ab7[_0x1cb2c6(0x13c)])||((_0x528bd2=(_0x594887=_0x84db9a[_0x1cb2c6(0xef)])==null?void 0x0:_0x594887[_0x1cb2c6(0x9b)])==null?void 0x0:_0x528bd2[_0x1cb2c6(0x14a)])===_0x1cb2c6(0x110);function _0x8511ec(_0x5c481e){var _0x2454c6=_0x1cb2c6;if(_0x5c481e[_0x2454c6(0xc3)]('/')&&_0x5c481e[_0x2454c6(0x17b)]('/')){let _0x57534f=new RegExp(_0x5c481e[_0x2454c6(0x15c)](0x1,-0x1));return _0x2b2cd3=>_0x57534f['test'](_0x2b2cd3);}else{if(_0x5c481e[_0x2454c6(0x106)]('*')||_0x5c481e['includes']('?')){let _0x412abc=new RegExp('^'+_0x5c481e[_0x2454c6(0xbe)](/\\./g,String[_0x2454c6(0xa2)](0x5c)+'.')[_0x2454c6(0xbe)](/\\*/g,'.*')[_0x2454c6(0xbe)](/\\?/g,'.')+String[_0x2454c6(0xa2)](0x24));return _0x66c40f=>_0x412abc[_0x2454c6(0x17c)](_0x66c40f);}else return _0x529749=>_0x529749===_0x5c481e;}}let _0x27ec40=_0x5c571c[_0x1cb2c6(0x100)](_0x8511ec);return _0x84db9a[_0x1cb2c6(0xb0)]=_0x231a1b||!_0x5c571c,!_0x84db9a[_0x1cb2c6(0xb0)]&&((_0x26717e=_0x84db9a[_0x1cb2c6(0x177)])==null?void 0x0:_0x26717e[_0x1cb2c6(0xf0)])&&(_0x84db9a['_consoleNinjaAllowedToStart']=_0x27ec40[_0x1cb2c6(0x139)](_0x3be647=>_0x3be647(_0x84db9a[_0x1cb2c6(0x177)]['hostname']))),_0x84db9a[_0x1cb2c6(0xb0)];}function X(_0x590edb,_0x21bf16,_0x398f4c,_0x22e72b){var _0x26411c=_0x451048;_0x590edb=_0x590edb,_0x21bf16=_0x21bf16,_0x398f4c=_0x398f4c,_0x22e72b=_0x22e72b;let _0x4ad906=B(_0x590edb),_0x1122c5=_0x4ad906[_0x26411c(0x92)],_0x320a81=_0x4ad906[_0x26411c(0xac)];class _0x26cce7{constructor(){var _0x10c6d1=_0x26411c;this['_keyStrRegExp']=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this[_0x10c6d1(0x152)]=/'([^\\\\']|\\\\')*'/,this[_0x10c6d1(0x10e)]=_0x590edb[_0x10c6d1(0x108)],this[_0x10c6d1(0xc0)]=_0x590edb[_0x10c6d1(0x14d)],this['_getOwnPropertyDescriptor']=Object[_0x10c6d1(0xd3)],this[_0x10c6d1(0x172)]=Object['getOwnPropertyNames'],this[_0x10c6d1(0xf8)]=_0x590edb[_0x10c6d1(0xb7)],this[_0x10c6d1(0xff)]=RegExp[_0x10c6d1(0xec)]['toString'],this[_0x10c6d1(0x129)]=Date[_0x10c6d1(0xec)][_0x10c6d1(0x130)];}[_0x26411c(0x9c)](_0x4436e4,_0x5f0356,_0x54afd9,_0x3c9191){var _0x2a7192=_0x26411c,_0x3dc787=this,_0x1bd08d=_0x54afd9[_0x2a7192(0xe1)];function _0x1dd879(_0x4fb52f,_0x591b22,_0x121554){var _0x455b89=_0x2a7192;_0x591b22[_0x455b89(0x8c)]=_0x455b89(0x101),_0x591b22['error']=_0x4fb52f[_0x455b89(0x135)],_0x24714b=_0x121554[_0x455b89(0x13c)]['current'],_0x121554[_0x455b89(0x13c)]['current']=_0x591b22,_0x3dc787[_0x455b89(0x12d)](_0x591b22,_0x121554);}try{_0x54afd9[_0x2a7192(0xf2)]++,_0x54afd9['autoExpand']&&_0x54afd9['autoExpandPreviousObjects'][_0x2a7192(0xfb)](_0x5f0356);var _0x19b5df,_0x414ef1,_0x4ba9dc,_0x1ec67e,_0x1b03b5=[],_0x191f7c=[],_0x3944e0,_0x292431=this['_type'](_0x5f0356),_0x297969=_0x292431===_0x2a7192(0xa6),_0x5f1b2b=!0x1,_0x2285c2=_0x292431===_0x2a7192(0xf9),_0x21cb7d=this[_0x2a7192(0xdc)](_0x292431),_0x5ab3f0=this['_isPrimitiveWrapperType'](_0x292431),_0x47d0a8=_0x21cb7d||_0x5ab3f0,_0x3cafaa={},_0x5e5d4e=0x0,_0x1d0e40=!0x1,_0x24714b,_0x24a1c7=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x54afd9['depth']){if(_0x297969){if(_0x414ef1=_0x5f0356['length'],_0x414ef1>_0x54afd9['elements']){for(_0x4ba9dc=0x0,_0x1ec67e=_0x54afd9[_0x2a7192(0xf1)],_0x19b5df=_0x4ba9dc;_0x19b5df<_0x1ec67e;_0x19b5df++)_0x191f7c[_0x2a7192(0xfb)](_0x3dc787[_0x2a7192(0x117)](_0x1b03b5,_0x5f0356,_0x292431,_0x19b5df,_0x54afd9));_0x4436e4[_0x2a7192(0xb3)]=!0x0;}else{for(_0x4ba9dc=0x0,_0x1ec67e=_0x414ef1,_0x19b5df=_0x4ba9dc;_0x19b5df<_0x1ec67e;_0x19b5df++)_0x191f7c[_0x2a7192(0xfb)](_0x3dc787[_0x2a7192(0x117)](_0x1b03b5,_0x5f0356,_0x292431,_0x19b5df,_0x54afd9));}_0x54afd9[_0x2a7192(0x171)]+=_0x191f7c['length'];}if(!(_0x292431===_0x2a7192(0x14e)||_0x292431===_0x2a7192(0x108))&&!_0x21cb7d&&_0x292431!==_0x2a7192(0xee)&&_0x292431!==_0x2a7192(0x107)&&_0x292431!==_0x2a7192(0x134)){var _0x5ec43e=_0x3c9191[_0x2a7192(0x11f)]||_0x54afd9['props'];if(this['_isSet'](_0x5f0356)?(_0x19b5df=0x0,_0x5f0356[_0x2a7192(0x9d)](function(_0x463b90){var _0xbec41=_0x2a7192;if(_0x5e5d4e++,_0x54afd9[_0xbec41(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;return;}if(!_0x54afd9[_0xbec41(0x111)]&&_0x54afd9['autoExpand']&&_0x54afd9[_0xbec41(0x171)]>_0x54afd9[_0xbec41(0xc9)]){_0x1d0e40=!0x0;return;}_0x191f7c['push'](_0x3dc787[_0xbec41(0x117)](_0x1b03b5,_0x5f0356,_0xbec41(0x98),_0x19b5df++,_0x54afd9,function(_0x3d3b35){return function(){return _0x3d3b35;};}(_0x463b90)));})):this[_0x2a7192(0x11c)](_0x5f0356)&&_0x5f0356['forEach'](function(_0x335179,_0x2685c9){var _0x5a2ece=_0x2a7192;if(_0x5e5d4e++,_0x54afd9[_0x5a2ece(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;return;}if(!_0x54afd9[_0x5a2ece(0x111)]&&_0x54afd9['autoExpand']&&_0x54afd9[_0x5a2ece(0x171)]>_0x54afd9[_0x5a2ece(0xc9)]){_0x1d0e40=!0x0;return;}var _0x3479ae=_0x2685c9[_0x5a2ece(0x130)]();_0x3479ae[_0x5a2ece(0x9a)]>0x64&&(_0x3479ae=_0x3479ae[_0x5a2ece(0x15c)](0x0,0x64)+'...'),_0x191f7c[_0x5a2ece(0xfb)](_0x3dc787[_0x5a2ece(0x117)](_0x1b03b5,_0x5f0356,'Map',_0x3479ae,_0x54afd9,function(_0x58ebfe){return function(){return _0x58ebfe;};}(_0x335179)));}),!_0x5f1b2b){try{for(_0x3944e0 in _0x5f0356)if(!(_0x297969&&_0x24a1c7[_0x2a7192(0x17c)](_0x3944e0))&&!this[_0x2a7192(0x103)](_0x5f0356,_0x3944e0,_0x54afd9)){if(_0x5e5d4e++,_0x54afd9[_0x2a7192(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;break;}if(!_0x54afd9[_0x2a7192(0x111)]&&_0x54afd9['autoExpand']&&_0x54afd9['autoExpandPropertyCount']>_0x54afd9[_0x2a7192(0xc9)]){_0x1d0e40=!0x0;break;}_0x191f7c[_0x2a7192(0xfb)](_0x3dc787[_0x2a7192(0x174)](_0x1b03b5,_0x3cafaa,_0x5f0356,_0x292431,_0x3944e0,_0x54afd9));}}catch{}if(_0x3cafaa[_0x2a7192(0xfa)]=!0x0,_0x2285c2&&(_0x3cafaa[_0x2a7192(0x127)]=!0x0),!_0x1d0e40){var _0xd026e1=[][_0x2a7192(0x176)](this[_0x2a7192(0x172)](_0x5f0356))[_0x2a7192(0x176)](this[_0x2a7192(0x157)](_0x5f0356));for(_0x19b5df=0x0,_0x414ef1=_0xd026e1[_0x2a7192(0x9a)];_0x19b5df<_0x414ef1;_0x19b5df++)if(_0x3944e0=_0xd026e1[_0x19b5df],!(_0x297969&&_0x24a1c7[_0x2a7192(0x17c)](_0x3944e0[_0x2a7192(0x130)]()))&&!this[_0x2a7192(0x103)](_0x5f0356,_0x3944e0,_0x54afd9)&&!_0x3cafaa[_0x2a7192(0xdd)+_0x3944e0[_0x2a7192(0x130)]()]){if(_0x5e5d4e++,_0x54afd9[_0x2a7192(0x171)]++,_0x5e5d4e>_0x5ec43e){_0x1d0e40=!0x0;break;}if(!_0x54afd9[_0x2a7192(0x111)]&&_0x54afd9[_0x2a7192(0xe1)]&&_0x54afd9[_0x2a7192(0x171)]>_0x54afd9[_0x2a7192(0xc9)]){_0x1d0e40=!0x0;break;}_0x191f7c[_0x2a7192(0xfb)](_0x3dc787['_addObjectProperty'](_0x1b03b5,_0x3cafaa,_0x5f0356,_0x292431,_0x3944e0,_0x54afd9));}}}}}if(_0x4436e4[_0x2a7192(0x8c)]=_0x292431,_0x47d0a8?(_0x4436e4[_0x2a7192(0x120)]=_0x5f0356[_0x2a7192(0x137)](),this[_0x2a7192(0x166)](_0x292431,_0x4436e4,_0x54afd9,_0x3c9191)):_0x292431===_0x2a7192(0x13b)?_0x4436e4['value']=this[_0x2a7192(0x129)]['call'](_0x5f0356):_0x292431===_0x2a7192(0x134)?_0x4436e4[_0x2a7192(0x120)]=_0x5f0356[_0x2a7192(0x130)]():_0x292431===_0x2a7192(0x104)?_0x4436e4[_0x2a7192(0x120)]=this[_0x2a7192(0xff)][_0x2a7192(0x123)](_0x5f0356):_0x292431===_0x2a7192(0xcc)&&this[_0x2a7192(0xf8)]?_0x4436e4['value']=this[_0x2a7192(0xf8)]['prototype'][_0x2a7192(0x130)][_0x2a7192(0x123)](_0x5f0356):!_0x54afd9[_0x2a7192(0x145)]&&!(_0x292431===_0x2a7192(0x14e)||_0x292431===_0x2a7192(0x108))&&(delete _0x4436e4[_0x2a7192(0x120)],_0x4436e4[_0x2a7192(0xd5)]=!0x0),_0x1d0e40&&(_0x4436e4[_0x2a7192(0x13a)]=!0x0),_0x24714b=_0x54afd9[_0x2a7192(0x13c)][_0x2a7192(0x156)],_0x54afd9[_0x2a7192(0x13c)][_0x2a7192(0x156)]=_0x4436e4,this['_treeNodePropertiesBeforeFullValue'](_0x4436e4,_0x54afd9),_0x191f7c['length']){for(_0x19b5df=0x0,_0x414ef1=_0x191f7c[_0x2a7192(0x9a)];_0x19b5df<_0x414ef1;_0x19b5df++)_0x191f7c[_0x19b5df](_0x19b5df);}_0x1b03b5[_0x2a7192(0x9a)]&&(_0x4436e4['props']=_0x1b03b5);}catch(_0x23d7d6){_0x1dd879(_0x23d7d6,_0x4436e4,_0x54afd9);}return this[_0x2a7192(0x13e)](_0x5f0356,_0x4436e4),this['_treeNodePropertiesAfterFullValue'](_0x4436e4,_0x54afd9),_0x54afd9[_0x2a7192(0x13c)][_0x2a7192(0x156)]=_0x24714b,_0x54afd9['level']--,_0x54afd9[_0x2a7192(0xe1)]=_0x1bd08d,_0x54afd9[_0x2a7192(0xe1)]&&_0x54afd9[_0x2a7192(0x99)][_0x2a7192(0x179)](),_0x4436e4;}['_getOwnPropertySymbols'](_0x2dce8d){var _0x52586e=_0x26411c;return Object[_0x52586e(0xad)]?Object['getOwnPropertySymbols'](_0x2dce8d):[];}[_0x26411c(0x114)](_0x5bb0ea){var _0x33dfa7=_0x26411c;return!!(_0x5bb0ea&&_0x590edb[_0x33dfa7(0x98)]&&this[_0x33dfa7(0x165)](_0x5bb0ea)===_0x33dfa7(0x118)&&_0x5bb0ea[_0x33dfa7(0x9d)]);}[_0x26411c(0x103)](_0x4d421a,_0x1f7f9c,_0x493d2f){var _0x294b30=_0x26411c;return _0x493d2f['noFunctions']?typeof _0x4d421a[_0x1f7f9c]==_0x294b30(0xf9):!0x1;}[_0x26411c(0x87)](_0x5e9324){var _0x6651d1=_0x26411c,_0x18914e='';return _0x18914e=typeof _0x5e9324,_0x18914e===_0x6651d1(0x105)?this[_0x6651d1(0x165)](_0x5e9324)==='[object\\x20Array]'?_0x18914e=_0x6651d1(0xa6):this[_0x6651d1(0x165)](_0x5e9324)===_0x6651d1(0x15f)?_0x18914e=_0x6651d1(0x13b):this[_0x6651d1(0x165)](_0x5e9324)===_0x6651d1(0x13d)?_0x18914e='bigint':_0x5e9324===null?_0x18914e=_0x6651d1(0x14e):_0x5e9324[_0x6651d1(0x115)]&&(_0x18914e=_0x5e9324['constructor']['name']||_0x18914e):_0x18914e==='undefined'&&this['_HTMLAllCollection']&&_0x5e9324 instanceof this[_0x6651d1(0xc0)]&&(_0x18914e='HTMLAllCollection'),_0x18914e;}['_objectToString'](_0x53fa44){var _0x2c3621=_0x26411c;return Object['prototype'][_0x2c3621(0x130)]['call'](_0x53fa44);}[_0x26411c(0xdc)](_0x432ff7){var _0x34e11e=_0x26411c;return _0x432ff7===_0x34e11e(0xd7)||_0x432ff7===_0x34e11e(0x178)||_0x432ff7===_0x34e11e(0x11e);}[_0x26411c(0x8e)](_0x2d3cb9){var _0x28f0fd=_0x26411c;return _0x2d3cb9===_0x28f0fd(0xfd)||_0x2d3cb9===_0x28f0fd(0xee)||_0x2d3cb9===_0x28f0fd(0xe5);}[_0x26411c(0x117)](_0xc5ba4c,_0x129fd3,_0x4725aa,_0x3d3271,_0x33adea,_0xdbd01d){var _0x580e1c=this;return function(_0x24a5bd){var _0x1e88f0=_0x3d40,_0x17e559=_0x33adea[_0x1e88f0(0x13c)][_0x1e88f0(0x156)],_0x2b941c=_0x33adea[_0x1e88f0(0x13c)][_0x1e88f0(0x8f)],_0x45aa56=_0x33adea[_0x1e88f0(0x13c)]['parent'];_0x33adea['node'][_0x1e88f0(0xe8)]=_0x17e559,_0x33adea[_0x1e88f0(0x13c)]['index']=typeof _0x3d3271==_0x1e88f0(0x11e)?_0x3d3271:_0x24a5bd,_0xc5ba4c['push'](_0x580e1c['_property'](_0x129fd3,_0x4725aa,_0x3d3271,_0x33adea,_0xdbd01d)),_0x33adea[_0x1e88f0(0x13c)]['parent']=_0x45aa56,_0x33adea[_0x1e88f0(0x13c)][_0x1e88f0(0x8f)]=_0x2b941c;};}['_addObjectProperty'](_0x254283,_0x295b96,_0x54609a,_0x79f8e,_0x430608,_0x23ab00,_0x4817f0){var _0x4dc98b=_0x26411c,_0x2d95b1=this;return _0x295b96[_0x4dc98b(0xdd)+_0x430608[_0x4dc98b(0x130)]()]=!0x0,function(_0x2048d3){var _0x3d60a1=_0x4dc98b,_0x21ec3d=_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x156)],_0x3e8f91=_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x8f)],_0x1f56e5=_0x23ab00['node'][_0x3d60a1(0xe8)];_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0xe8)]=_0x21ec3d,_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x8f)]=_0x2048d3,_0x254283['push'](_0x2d95b1[_0x3d60a1(0xcf)](_0x54609a,_0x79f8e,_0x430608,_0x23ab00,_0x4817f0)),_0x23ab00[_0x3d60a1(0x13c)]['parent']=_0x1f56e5,_0x23ab00[_0x3d60a1(0x13c)][_0x3d60a1(0x8f)]=_0x3e8f91;};}['_property'](_0x4788b0,_0x4ba765,_0x281d9d,_0xe7b1a4,_0x28d7fa){var _0x3b86d2=_0x26411c,_0xd2514c=this;_0x28d7fa||(_0x28d7fa=function(_0x11d3b9,_0x53444c){return _0x11d3b9[_0x53444c];});var _0x5bc2d5=_0x281d9d[_0x3b86d2(0x130)](),_0x418c1c=_0xe7b1a4['expressionsToEvaluate']||{},_0x58772b=_0xe7b1a4[_0x3b86d2(0x145)],_0x2988d9=_0xe7b1a4[_0x3b86d2(0x111)];try{var _0x3c0b5c=this[_0x3b86d2(0x11c)](_0x4788b0),_0xa523c4=_0x5bc2d5;_0x3c0b5c&&_0xa523c4[0x0]==='\\x27'&&(_0xa523c4=_0xa523c4[_0x3b86d2(0x128)](0x1,_0xa523c4[_0x3b86d2(0x9a)]-0x2));var _0x43fb6a=_0xe7b1a4[_0x3b86d2(0xe9)]=_0x418c1c[_0x3b86d2(0xdd)+_0xa523c4];_0x43fb6a&&(_0xe7b1a4[_0x3b86d2(0x145)]=_0xe7b1a4[_0x3b86d2(0x145)]+0x1),_0xe7b1a4[_0x3b86d2(0x111)]=!!_0x43fb6a;var _0x5a8856=typeof _0x281d9d==_0x3b86d2(0xcc),_0xa06285={'name':_0x5a8856||_0x3c0b5c?_0x5bc2d5:this[_0x3b86d2(0xba)](_0x5bc2d5)};if(_0x5a8856&&(_0xa06285['symbol']=!0x0),!(_0x4ba765===_0x3b86d2(0xa6)||_0x4ba765==='Error')){var _0xbea973=this[_0x3b86d2(0xa5)](_0x4788b0,_0x281d9d);if(_0xbea973&&(_0xbea973['set']&&(_0xa06285[_0x3b86d2(0xab)]=!0x0),_0xbea973[_0x3b86d2(0x16b)]&&!_0x43fb6a&&!_0xe7b1a4['resolveGetters']))return _0xa06285[_0x3b86d2(0x167)]=!0x0,this[_0x3b86d2(0xf3)](_0xa06285,_0xe7b1a4),_0xa06285;}var _0x45d98a;try{_0x45d98a=_0x28d7fa(_0x4788b0,_0x281d9d);}catch(_0x3a4c92){return _0xa06285={'name':_0x5bc2d5,'type':_0x3b86d2(0x101),'error':_0x3a4c92['message']},this['_processTreeNodeResult'](_0xa06285,_0xe7b1a4),_0xa06285;}var _0x308036=this[_0x3b86d2(0x87)](_0x45d98a),_0x4b6d19=this['_isPrimitiveType'](_0x308036);if(_0xa06285['type']=_0x308036,_0x4b6d19)this['_processTreeNodeResult'](_0xa06285,_0xe7b1a4,_0x45d98a,function(){var _0x35b469=_0x3b86d2;_0xa06285['value']=_0x45d98a[_0x35b469(0x137)](),!_0x43fb6a&&_0xd2514c[_0x35b469(0x166)](_0x308036,_0xa06285,_0xe7b1a4,{});});else{var _0x27d579=_0xe7b1a4[_0x3b86d2(0xe1)]&&_0xe7b1a4[_0x3b86d2(0xf2)]<_0xe7b1a4['autoExpandMaxDepth']&&_0xe7b1a4[_0x3b86d2(0x99)]['indexOf'](_0x45d98a)<0x0&&_0x308036!==_0x3b86d2(0xf9)&&_0xe7b1a4['autoExpandPropertyCount']<_0xe7b1a4[_0x3b86d2(0xc9)];_0x27d579||_0xe7b1a4[_0x3b86d2(0xf2)]<_0x58772b||_0x43fb6a?(this[_0x3b86d2(0x9c)](_0xa06285,_0x45d98a,_0xe7b1a4,_0x43fb6a||{}),this[_0x3b86d2(0x13e)](_0x45d98a,_0xa06285)):this[_0x3b86d2(0xf3)](_0xa06285,_0xe7b1a4,_0x45d98a,function(){var _0x535495=_0x3b86d2;_0x308036===_0x535495(0x14e)||_0x308036===_0x535495(0x108)||(delete _0xa06285[_0x535495(0x120)],_0xa06285[_0x535495(0xd5)]=!0x0);});}return _0xa06285;}finally{_0xe7b1a4[_0x3b86d2(0xe9)]=_0x418c1c,_0xe7b1a4['depth']=_0x58772b,_0xe7b1a4['isExpressionToEvaluate']=_0x2988d9;}}[_0x26411c(0x166)](_0x35aaef,_0x347618,_0x560caa,_0x454b9a){var _0x248525=_0x26411c,_0x5863ba=_0x454b9a[_0x248525(0x173)]||_0x560caa['strLength'];if((_0x35aaef==='string'||_0x35aaef===_0x248525(0xee))&&_0x347618['value']){let _0x53b536=_0x347618[_0x248525(0x120)][_0x248525(0x9a)];_0x560caa[_0x248525(0xd6)]+=_0x53b536,_0x560caa[_0x248525(0xd6)]>_0x560caa['totalStrLength']?(_0x347618[_0x248525(0xd5)]='',delete _0x347618[_0x248525(0x120)]):_0x53b536>_0x5863ba&&(_0x347618[_0x248525(0xd5)]=_0x347618[_0x248525(0x120)]['substr'](0x0,_0x5863ba),delete _0x347618[_0x248525(0x120)]);}}[_0x26411c(0x11c)](_0x51bb45){var _0x2630ed=_0x26411c;return!!(_0x51bb45&&_0x590edb[_0x2630ed(0x162)]&&this['_objectToString'](_0x51bb45)==='[object\\x20Map]'&&_0x51bb45[_0x2630ed(0x9d)]);}[_0x26411c(0xba)](_0x5e187d){var _0x3986ff=_0x26411c;if(_0x5e187d['match'](/^\\d+$/))return _0x5e187d;var _0x7d246;try{_0x7d246=JSON['stringify'](''+_0x5e187d);}catch{_0x7d246='\\x22'+this[_0x3986ff(0x165)](_0x5e187d)+'\\x22';}return _0x7d246[_0x3986ff(0x11b)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x7d246=_0x7d246['substr'](0x1,_0x7d246['length']-0x2):_0x7d246=_0x7d246['replace'](/'/g,'\\x5c\\x27')['replace'](/\\\\\"/g,'\\x22')[_0x3986ff(0xbe)](/(^\"|\"$)/g,'\\x27'),_0x7d246;}[_0x26411c(0xf3)](_0x2e8411,_0x5c2a9f,_0x1c2b2e,_0x4f6662){var _0x25b658=_0x26411c;this[_0x25b658(0x12d)](_0x2e8411,_0x5c2a9f),_0x4f6662&&_0x4f6662(),this['_additionalMetadata'](_0x1c2b2e,_0x2e8411),this[_0x25b658(0x11d)](_0x2e8411,_0x5c2a9f);}[_0x26411c(0x12d)](_0x383b1a,_0x527297){var _0x5218a5=_0x26411c;this['_setNodeId'](_0x383b1a,_0x527297),this[_0x5218a5(0x154)](_0x383b1a,_0x527297),this['_setNodeExpressionPath'](_0x383b1a,_0x527297),this[_0x5218a5(0x121)](_0x383b1a,_0x527297);}[_0x26411c(0x93)](_0x4c2838,_0x386efd){}[_0x26411c(0x154)](_0x3ac128,_0x8b6f82){}[_0x26411c(0x160)](_0x151af9,_0xf01e30){}[_0x26411c(0x132)](_0xf2b921){var _0x2187e0=_0x26411c;return _0xf2b921===this[_0x2187e0(0x10e)];}[_0x26411c(0x11d)](_0x59d68d,_0x428395){var _0x3968a7=_0x26411c;this[_0x3968a7(0x160)](_0x59d68d,_0x428395),this['_setNodeExpandableState'](_0x59d68d),_0x428395['sortProps']&&this[_0x3968a7(0xa4)](_0x59d68d),this[_0x3968a7(0xeb)](_0x59d68d,_0x428395),this['_addLoadNode'](_0x59d68d,_0x428395),this[_0x3968a7(0x119)](_0x59d68d);}[_0x26411c(0x13e)](_0x33f398,_0x5c47e4){var _0x122b25=_0x26411c;let _0x3f1e6d;try{_0x590edb[_0x122b25(0x148)]&&(_0x3f1e6d=_0x590edb[_0x122b25(0x148)][_0x122b25(0x96)],_0x590edb[_0x122b25(0x148)][_0x122b25(0x96)]=function(){}),_0x33f398&&typeof _0x33f398[_0x122b25(0x9a)]==_0x122b25(0x11e)&&(_0x5c47e4['length']=_0x33f398[_0x122b25(0x9a)]);}catch{}finally{_0x3f1e6d&&(_0x590edb[_0x122b25(0x148)]['error']=_0x3f1e6d);}if(_0x5c47e4['type']===_0x122b25(0x11e)||_0x5c47e4['type']===_0x122b25(0xe5)){if(isNaN(_0x5c47e4[_0x122b25(0x120)]))_0x5c47e4['nan']=!0x0,delete _0x5c47e4['value'];else switch(_0x5c47e4[_0x122b25(0x120)]){case Number['POSITIVE_INFINITY']:_0x5c47e4[_0x122b25(0x17a)]=!0x0,delete _0x5c47e4[_0x122b25(0x120)];break;case Number[_0x122b25(0xe6)]:_0x5c47e4[_0x122b25(0x91)]=!0x0,delete _0x5c47e4['value'];break;case 0x0:this[_0x122b25(0x158)](_0x5c47e4[_0x122b25(0x120)])&&(_0x5c47e4[_0x122b25(0x102)]=!0x0);break;}}else _0x5c47e4[_0x122b25(0x8c)]===_0x122b25(0xf9)&&typeof _0x33f398[_0x122b25(0xce)]==_0x122b25(0x178)&&_0x33f398[_0x122b25(0xce)]&&_0x5c47e4[_0x122b25(0xce)]&&_0x33f398['name']!==_0x5c47e4[_0x122b25(0xce)]&&(_0x5c47e4[_0x122b25(0x15b)]=_0x33f398[_0x122b25(0xce)]);}[_0x26411c(0x158)](_0x5168ae){var _0xc4a3c4=_0x26411c;return 0x1/_0x5168ae===Number[_0xc4a3c4(0xe6)];}['_sortProps'](_0x126c5d){var _0x28a5d2=_0x26411c;!_0x126c5d[_0x28a5d2(0x11f)]||!_0x126c5d[_0x28a5d2(0x11f)][_0x28a5d2(0x9a)]||_0x126c5d[_0x28a5d2(0x8c)]===_0x28a5d2(0xa6)||_0x126c5d['type']===_0x28a5d2(0x162)||_0x126c5d[_0x28a5d2(0x8c)]==='Set'||_0x126c5d[_0x28a5d2(0x11f)][_0x28a5d2(0xc4)](function(_0x2a85e0,_0x61c77e){var _0x3bc366=_0x28a5d2,_0xfd7605=_0x2a85e0['name'][_0x3bc366(0xe2)](),_0x106aa8=_0x61c77e[_0x3bc366(0xce)][_0x3bc366(0xe2)]();return _0xfd7605<_0x106aa8?-0x1:_0xfd7605>_0x106aa8?0x1:0x0;});}['_addFunctionsNode'](_0x476723,_0x47dde7){var _0x220747=_0x26411c;if(!(_0x47dde7['noFunctions']||!_0x476723[_0x220747(0x11f)]||!_0x476723[_0x220747(0x11f)][_0x220747(0x9a)])){for(var _0x147f1f=[],_0x442191=[],_0x586557=0x0,_0x3b7c49=_0x476723[_0x220747(0x11f)][_0x220747(0x9a)];_0x586557<_0x3b7c49;_0x586557++){var _0x3e4e02=_0x476723[_0x220747(0x11f)][_0x586557];_0x3e4e02[_0x220747(0x8c)]===_0x220747(0xf9)?_0x147f1f['push'](_0x3e4e02):_0x442191[_0x220747(0xfb)](_0x3e4e02);}if(!(!_0x442191[_0x220747(0x9a)]||_0x147f1f[_0x220747(0x9a)]<=0x1)){_0x476723[_0x220747(0x11f)]=_0x442191;var _0x13f71b={'functionsNode':!0x0,'props':_0x147f1f};this[_0x220747(0x93)](_0x13f71b,_0x47dde7),this[_0x220747(0x160)](_0x13f71b,_0x47dde7),this['_setNodeExpandableState'](_0x13f71b),this[_0x220747(0x121)](_0x13f71b,_0x47dde7),_0x13f71b['id']+='\\x20f',_0x476723[_0x220747(0x11f)][_0x220747(0xaf)](_0x13f71b);}}}[_0x26411c(0x9f)](_0xfca237,_0x3a9809){}[_0x26411c(0x112)](_0x124197){}[_0x26411c(0x10d)](_0x48cbb9){var _0x3b18a8=_0x26411c;return Array[_0x3b18a8(0x89)](_0x48cbb9)||typeof _0x48cbb9=='object'&&this[_0x3b18a8(0x165)](_0x48cbb9)==='[object\\x20Array]';}[_0x26411c(0x121)](_0x3e9a39,_0x134589){}[_0x26411c(0x119)](_0x1303fb){var _0x483058=_0x26411c;delete _0x1303fb['_hasSymbolPropertyOnItsPath'],delete _0x1303fb[_0x483058(0xca)],delete _0x1303fb[_0x483058(0x126)];}[_0x26411c(0xf4)](_0x91cf2a,_0x25fafc){}}let _0x3a6644=new _0x26cce7(),_0x172c31={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0xaf5344={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x426b97(_0x4cf18a,_0x4379c2,_0x5242c0,_0x25eaa2,_0x23677a,_0xe5affb){var _0x454327=_0x26411c;let _0x543977,_0xe576ea;try{_0xe576ea=_0x320a81(),_0x543977=_0x398f4c[_0x4379c2],!_0x543977||_0xe576ea-_0x543977['ts']>0x1f4&&_0x543977[_0x454327(0xa8)]&&_0x543977[_0x454327(0x153)]/_0x543977[_0x454327(0xa8)]<0x64?(_0x398f4c[_0x4379c2]=_0x543977={'count':0x0,'time':0x0,'ts':_0xe576ea},_0x398f4c['hits']={}):_0xe576ea-_0x398f4c['hits']['ts']>0x32&&_0x398f4c[_0x454327(0x10b)][_0x454327(0xa8)]&&_0x398f4c[_0x454327(0x10b)][_0x454327(0x153)]/_0x398f4c[_0x454327(0x10b)]['count']<0x64&&(_0x398f4c[_0x454327(0x10b)]={});let _0x29ad33=[],_0x278b35=_0x543977[_0x454327(0xa1)]||_0x398f4c[_0x454327(0x10b)][_0x454327(0xa1)]?_0xaf5344:_0x172c31,_0x26bf49=_0x2f7fa9=>{var _0x152af1=_0x454327;let _0x1ab900={};return _0x1ab900[_0x152af1(0x11f)]=_0x2f7fa9[_0x152af1(0x11f)],_0x1ab900[_0x152af1(0xf1)]=_0x2f7fa9['elements'],_0x1ab900[_0x152af1(0x173)]=_0x2f7fa9[_0x152af1(0x173)],_0x1ab900['totalStrLength']=_0x2f7fa9['totalStrLength'],_0x1ab900[_0x152af1(0xc9)]=_0x2f7fa9[_0x152af1(0xc9)],_0x1ab900[_0x152af1(0xbb)]=_0x2f7fa9[_0x152af1(0xbb)],_0x1ab900['sortProps']=!0x1,_0x1ab900['noFunctions']=!_0x21bf16,_0x1ab900[_0x152af1(0x145)]=0x1,_0x1ab900['level']=0x0,_0x1ab900[_0x152af1(0xcd)]='root_exp_id',_0x1ab900[_0x152af1(0x10a)]=_0x152af1(0xbc),_0x1ab900[_0x152af1(0xe1)]=!0x0,_0x1ab900[_0x152af1(0x99)]=[],_0x1ab900[_0x152af1(0x171)]=0x0,_0x1ab900[_0x152af1(0xea)]=!0x0,_0x1ab900[_0x152af1(0xd6)]=0x0,_0x1ab900['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x1ab900;};for(var _0x3533fe=0x0;_0x3533fe<_0x23677a[_0x454327(0x9a)];_0x3533fe++)_0x29ad33[_0x454327(0xfb)](_0x3a6644[_0x454327(0x9c)]({'timeNode':_0x4cf18a===_0x454327(0x153)||void 0x0},_0x23677a[_0x3533fe],_0x26bf49(_0x278b35),{}));if(_0x4cf18a===_0x454327(0xc1)||_0x4cf18a===_0x454327(0x96)){let _0x26251c=Error[_0x454327(0x14f)];try{Error[_0x454327(0x14f)]=0x1/0x0,_0x29ad33[_0x454327(0xfb)](_0x3a6644[_0x454327(0x9c)]({'stackNode':!0x0},new Error()[_0x454327(0xe3)],_0x26bf49(_0x278b35),{'strLength':0x1/0x0}));}finally{Error[_0x454327(0x14f)]=_0x26251c;}}return{'method':_0x454327(0x12f),'version':_0x22e72b,'args':[{'ts':_0x5242c0,'session':_0x25eaa2,'args':_0x29ad33,'id':_0x4379c2,'context':_0xe5affb}]};}catch(_0x22be6e){return{'method':_0x454327(0x12f),'version':_0x22e72b,'args':[{'ts':_0x5242c0,'session':_0x25eaa2,'args':[{'type':_0x454327(0x101),'error':_0x22be6e&&_0x22be6e[_0x454327(0x135)]}],'id':_0x4379c2,'context':_0xe5affb}]};}finally{try{if(_0x543977&&_0xe576ea){let _0x5d23b3=_0x320a81();_0x543977[_0x454327(0xa8)]++,_0x543977[_0x454327(0x153)]+=_0x1122c5(_0xe576ea,_0x5d23b3),_0x543977['ts']=_0x5d23b3,_0x398f4c['hits']['count']++,_0x398f4c[_0x454327(0x10b)]['time']+=_0x1122c5(_0xe576ea,_0x5d23b3),_0x398f4c[_0x454327(0x10b)]['ts']=_0x5d23b3,(_0x543977[_0x454327(0xa8)]>0x32||_0x543977['time']>0x64)&&(_0x543977[_0x454327(0xa1)]=!0x0),(_0x398f4c['hits'][_0x454327(0xa8)]>0x3e8||_0x398f4c['hits'][_0x454327(0x153)]>0x12c)&&(_0x398f4c[_0x454327(0x10b)][_0x454327(0xa1)]=!0x0);}}catch{}}}return _0x426b97;}function _0x2a70(){var _0x3584c1=['disabledTrace','onmessage','cappedElements','6042090CgAzmV','eventReceivedCallback','stringify','Symbol','','WebSocket','_propertyName','autoExpandMaxDepth','root_exp','origin','replace','onerror','_HTMLAllCollection','trace','next.js','startsWith','sort','_allowedToConnectOnSend','create','818764zxuWQl','_disposeWebsocket','autoExpandLimit','_hasSetOnItsPath','dockerizedApp','symbol','expId','name','_property','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','method','_webSocketErrorDocsLink','getOwnPropertyDescriptor','7578174BdpXnb','capped','allStrLength','boolean','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','logger\\x20websocket\\x20error','6xKNeJh','angular','_isPrimitiveType','_p_','charAt','52921','_inBrowser','autoExpand','toLowerCase','stack','_connecting','Number','NEGATIVE_INFINITY','\\x20server','parent','expressionsToEvaluate','resolveGetters','_addFunctionsNode','prototype','unref','String','process','hostname','elements','level','_processTreeNodeResult','_setNodeExpressionPath','global','hrtime','webpack','_Symbol','function','_p_length','push','warn','Boolean','_console_ninja_session','_regExpToString','map','unknown','negativeZero','_blacklistedProperty','RegExp','object','includes','Buffer','undefined','_ninjaIgnoreNextError','rootExpression','hits','join','_isArray','_undefined','10QVNzSb','edge','isExpressionToEvaluate','_setNodeExpandableState','1740011895870','_isSet','constructor','_allowedToSend','_addProperty','[object\\x20Set]','_cleanNode','3MbEWzf','match','_isMap','_treeNodePropertiesAfterFullValue','number','props','value','_setNodePermissions','991060nPJBnG','call','now','coverage','_hasMapOnItsPath','_p_name','substr','_dateToString','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','__es'+'Module','_inNextEdge','_treeNodePropertiesBeforeFullValue','astro','log','toString','_socket','_isUndefined','1','bigint','message','\\x20browser','valueOf','4092HwsDgw','some','cappedProps','date','node','[object\\x20BigInt]','_additionalMetadata','_connectToHostNow','split','getWebSocketClass','_WebSocketClass','hasOwnProperty',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"DESKTOP-R1J9TOD\",\"192.168.1.12\"],'depth',\"c:\\\\Users\\\\User\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.391\\\\node_modules\",'_attemptToReconnectShortly','console','1.0.0','NEXT_RUNTIME','_sendErrorMessage','readyState','HTMLAllCollection','null','stackTraceLimit','_connected','data','_quotedRegExp','time','_setNodeQueryPath','onclose','current','_getOwnPropertySymbols','_isNegativeZero','parse','ws/index.js','funcName','slice','catch','','[object\\x20Date]','_setNodeLabel','performance','Map','send','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','_objectToString','_capIfString','getter','args','host','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','get','_reconnectTimeout','_console_ninja','_ws','115082ZSTJMq','9000720UywTbh','autoExpandPropertyCount','_getOwnPropertyNames','strLength','_addObjectProperty','remix','concat','location','string','pop','positiveInfinity','endsWith','test','getOwnPropertyNames','versions','_type','gateway.docker.internal','isArray','_WebSocket','ws://','type','https://tinyurl.com/37x8b79t','_isPrimitiveWrapperType','index','_maxConnectAttemptCount','negativeInfinity','elapsed','_setNodeId','onopen','port','error','path','Set','autoExpandPreviousObjects','length','env','serialize','forEach','perf_hooks','_addLoadNode','enumerable','reduceLimits','fromCharCode','then','_sortProps','_getOwnPropertyDescriptor','array','7OrVkyi','count','_connectAttemptCount','6695307yiLwBQ','setter','timeStamp','getOwnPropertySymbols','nodeModules','unshift','_consoleNinjaAllowedToStart'];_0x2a70=function(){return _0x3584c1;};return _0x2a70();}((_0x5d07da,_0x3df2e9,_0x906129,_0x19bae4,_0x5cfb6b,_0x3a5a02,_0x58c00a,_0x4e9e86,_0x15965d,_0xdbcbfa,_0x42357c)=>{var _0xc7f056=_0x451048;if(_0x5d07da[_0xc7f056(0x16d)])return _0x5d07da[_0xc7f056(0x16d)];if(!H(_0x5d07da,_0x4e9e86,_0x5cfb6b))return _0x5d07da['_console_ninja']={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x5d07da[_0xc7f056(0x16d)];let _0x4fa6a7=B(_0x5d07da),_0x1bd88e=_0x4fa6a7[_0xc7f056(0x92)],_0xb765b7=_0x4fa6a7['timeStamp'],_0x9098d6=_0x4fa6a7[_0xc7f056(0x124)],_0x5eb058={'hits':{},'ts':{}},_0x4b3b57=X(_0x5d07da,_0x15965d,_0x5eb058,_0x3a5a02),_0x351af3=_0x2ff423=>{_0x5eb058['ts'][_0x2ff423]=_0xb765b7();},_0x532fb1=(_0x362745,_0x5f522b)=>{var _0x21ff59=_0xc7f056;let _0x1cb1e8=_0x5eb058['ts'][_0x5f522b];if(delete _0x5eb058['ts'][_0x5f522b],_0x1cb1e8){let _0x396a25=_0x1bd88e(_0x1cb1e8,_0xb765b7());_0x24b81f(_0x4b3b57(_0x21ff59(0x153),_0x362745,_0x9098d6(),_0x1bc123,[_0x396a25],_0x5f522b));}},_0x48f972=_0x476b03=>{var _0x47eca1=_0xc7f056,_0x58e162;return _0x5cfb6b===_0x47eca1(0xc2)&&_0x5d07da['origin']&&((_0x58e162=_0x476b03==null?void 0x0:_0x476b03[_0x47eca1(0x168)])==null?void 0x0:_0x58e162[_0x47eca1(0x9a)])&&(_0x476b03[_0x47eca1(0x168)][0x0][_0x47eca1(0xbd)]=_0x5d07da[_0x47eca1(0xbd)]),_0x476b03;};_0x5d07da[_0xc7f056(0x16d)]={'consoleLog':(_0x4e818a,_0x201510)=>{var _0x3aa2a4=_0xc7f056;_0x5d07da[_0x3aa2a4(0x148)][_0x3aa2a4(0x12f)][_0x3aa2a4(0xce)]!=='disabledLog'&&_0x24b81f(_0x4b3b57(_0x3aa2a4(0x12f),_0x4e818a,_0x9098d6(),_0x1bc123,_0x201510));},'consoleTrace':(_0x2cb281,_0x1d8d94)=>{var _0x5484aa=_0xc7f056,_0x640f5,_0x59c013;_0x5d07da[_0x5484aa(0x148)][_0x5484aa(0x12f)][_0x5484aa(0xce)]!==_0x5484aa(0xb1)&&((_0x59c013=(_0x640f5=_0x5d07da[_0x5484aa(0xef)])==null?void 0x0:_0x640f5[_0x5484aa(0x17e)])!=null&&_0x59c013[_0x5484aa(0x13c)]&&(_0x5d07da[_0x5484aa(0x109)]=!0x0),_0x24b81f(_0x48f972(_0x4b3b57(_0x5484aa(0xc1),_0x2cb281,_0x9098d6(),_0x1bc123,_0x1d8d94))));},'consoleError':(_0x429a2b,_0x106ad5)=>{var _0x2c83ab=_0xc7f056;_0x5d07da[_0x2c83ab(0x109)]=!0x0,_0x24b81f(_0x48f972(_0x4b3b57(_0x2c83ab(0x96),_0x429a2b,_0x9098d6(),_0x1bc123,_0x106ad5)));},'consoleTime':_0x25cb8c=>{_0x351af3(_0x25cb8c);},'consoleTimeEnd':(_0x5e4c22,_0x154d36)=>{_0x532fb1(_0x154d36,_0x5e4c22);},'autoLog':(_0x13432c,_0x5b7b7f)=>{var _0x4d7589=_0xc7f056;_0x24b81f(_0x4b3b57(_0x4d7589(0x12f),_0x5b7b7f,_0x9098d6(),_0x1bc123,[_0x13432c]));},'autoLogMany':(_0x5b47b3,_0x2d492b)=>{var _0xc41fb7=_0xc7f056;_0x24b81f(_0x4b3b57(_0xc41fb7(0x12f),_0x5b47b3,_0x9098d6(),_0x1bc123,_0x2d492b));},'autoTrace':(_0xc21545,_0x2da1b6)=>{var _0x545be4=_0xc7f056;_0x24b81f(_0x48f972(_0x4b3b57(_0x545be4(0xc1),_0x2da1b6,_0x9098d6(),_0x1bc123,[_0xc21545])));},'autoTraceMany':(_0x48458a,_0x4b932f)=>{var _0x538723=_0xc7f056;_0x24b81f(_0x48f972(_0x4b3b57(_0x538723(0xc1),_0x48458a,_0x9098d6(),_0x1bc123,_0x4b932f)));},'autoTime':(_0x44f8c9,_0x1f1e7b,_0x5f3172)=>{_0x351af3(_0x5f3172);},'autoTimeEnd':(_0x153ed4,_0x587f14,_0x510a3c)=>{_0x532fb1(_0x587f14,_0x510a3c);},'coverage':_0x43326a=>{var _0x4b578b=_0xc7f056;_0x24b81f({'method':_0x4b578b(0x125),'version':_0x3a5a02,'args':[{'id':_0x43326a}]});}};let _0x24b81f=q(_0x5d07da,_0x3df2e9,_0x906129,_0x19bae4,_0x5cfb6b,_0xdbcbfa,_0x42357c),_0x1bc123=_0x5d07da[_0xc7f056(0xfe)];return _0x5d07da[_0xc7f056(0x16d)];})(globalThis,'127.0.0.1',_0x451048(0xdf),_0x451048(0x146),_0x451048(0xf7),_0x451048(0x149),_0x451048(0x113),_0x451048(0x144),_0x451048(0xb8),_0x451048(0x15e),_0x451048(0x133));");
  } catch (e) {}
}
; /* istanbul ignore next */
function oo_oo(i, ...v) {
  try {
    oo_cm().consoleLog(i, v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_tr(i, ...v) {
  try {
    oo_cm().consoleTrace(i, v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_tx(i, ...v) {
  try {
    oo_cm().consoleError(i, v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_ts(v) {
  try {
    oo_cm().consoleTime(v);
  } catch (e) {}
  return v;
}
; /* istanbul ignore next */
function oo_te(v, i) {
  try {
    oo_cm().consoleTimeEnd(v, i);
  } catch (e) {}
  return v;
}
; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/

/***/ }),

/***/ "./css/style.scss":
/*!************************!*\
  !*** ./css/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@glidejs/glide/dist/glide.esm.js":
/*!*******************************************************!*\
  !*** ./node_modules/@glidejs/glide/dist/glide.esm.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Glide)
/* harmony export */ });
/*!
 * Glide.js v3.6.2
 * (c) 2013-2024 Jędrzej Chałubek (https://github.com/jedrzejchalubek/)
 * Released under the MIT License.
 */

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    };
  }

  return _get.apply(this, arguments);
}

var defaults = {
  /**
   * Type of the movement.
   *
   * Available types:
   * `slider` - Rewinds slider to the start/end when it reaches the first or last slide.
   * `carousel` - Changes slides without starting over when it reaches the first or last slide.
   *
   * @type {String}
   */
  type: 'slider',

  /**
   * Start at specific slide number defined with zero-based index.
   *
   * @type {Number}
   */
  startAt: 0,

  /**
   * A number of slides visible on the single viewport.
   *
   * @type {Number}
   */
  perView: 1,

  /**
   * Focus currently active slide at a specified position in the track.
   *
   * Available inputs:
   * `center` - Current slide will be always focused at the center of a track.
   * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
   *
   * @type {String|Number}
   */
  focusAt: 0,

  /**
   * A size of the gap added between slides.
   *
   * @type {Number}
   */
  gap: 10,

  /**
   * Change slides after a specified interval. Use `false` for turning off autoplay.
   *
   * @type {Number|Boolean}
   */
  autoplay: false,

  /**
   * Stop autoplay on mouseover event.
   *
   * @type {Boolean}
   */
  hoverpause: true,

  /**
   * Allow for changing slides with left and right keyboard arrows.
   *
   * @type {Boolean}
   */
  keyboard: true,

  /**
   * Stop running `perView` number of slides from the end. Use this
   * option if you don't want to have an empty space after
   * a slider. Works only with `slider` type and a
   * non-centered `focusAt` setting.
   *
   * @type {Boolean}
   */
  bound: false,

  /**
   * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
   *
   * @type {Number|Boolean}
   */
  swipeThreshold: 80,

  /**
   * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
   *
   * @type {Number|Boolean}
   */
  dragThreshold: 120,

  /**
   * A number of slides moved on single swipe.
   *
   * Available types:
   * `` - Moves slider by one slide per swipe
   * `|` - Moves slider between views per swipe (number of slides defined in `perView` options)
   *
   * @type {String}
   */
  perSwipe: '',

  /**
   * Moving distance ratio of the slides on a swiping and dragging.
   *
   * @type {Number}
   */
  touchRatio: 0.5,

  /**
   * Angle required to activate slides moving on swiping or dragging.
   *
   * @type {Number}
   */
  touchAngle: 45,

  /**
   * Duration of the animation in milliseconds.
   *
   * @type {Number}
   */
  animationDuration: 400,

  /**
   * Allows looping the `slider` type. Slider will rewind to the first/last slide when it's at the start/end.
   *
   * @type {Boolean}
   */
  rewind: true,

  /**
   * Duration of the rewinding animation of the `slider` type in milliseconds.
   *
   * @type {Number}
   */
  rewindDuration: 800,

  /**
   * Easing function for the animation.
   *
   * @type {String}
   */
  animationTimingFunc: 'cubic-bezier(.165, .840, .440, 1)',

  /**
   * Wait for the animation to finish until the next user input can be processed
   *
   * @type {boolean}
   */
  waitForTransition: true,

  /**
   * Throttle costly events at most once per every wait milliseconds.
   *
   * @type {Number}
   */
  throttle: 10,

  /**
   * Moving direction mode.
   *
   * Available inputs:
   * - 'ltr' - left to right movement,
   * - 'rtl' - right to left movement.
   *
   * @type {String}
   */
  direction: 'ltr',

  /**
   * The distance value of the next and previous viewports which
   * have to peek in the current view. Accepts number and
   * pixels as a string. Left and right peeking can be
   * set up separately with a directions object.
   *
   * For example:
   * `100` - Peek 100px on the both sides.
   * { before: 100, after: 50 }` - Peek 100px on the left side and 50px on the right side.
   *
   * @type {Number|String|Object}
   */
  peek: 0,

  /**
   * Defines how many clones of current viewport will be generated.
   *
   * @type {Number}
   */
  cloningRatio: 1,

  /**
   * Collection of options applied at specified media breakpoints.
   * For example: display two slides per view under 800px.
   * `{
   *   '800px': {
   *     perView: 2
   *   }
   * }`
   */
  breakpoints: {},

  /**
   * Collection of internally used HTML classes.
   *
   * @todo Refactor `slider` and `carousel` properties to single `type: { slider: '', carousel: '' }` object
   * @type {Object}
   */
  classes: {
    swipeable: 'glide--swipeable',
    dragging: 'glide--dragging',
    direction: {
      ltr: 'glide--ltr',
      rtl: 'glide--rtl'
    },
    type: {
      slider: 'glide--slider',
      carousel: 'glide--carousel'
    },
    slide: {
      clone: 'glide__slide--clone',
      active: 'glide__slide--active'
    },
    arrow: {
      disabled: 'glide__arrow--disabled'
    },
    nav: {
      active: 'glide__bullet--active'
    }
  }
};

/**
 * Outputs warning message to the bowser console.
 *
 * @param  {String} msg
 * @return {Void}
 */
function warn(msg) {
  console.error("[Glide warn]: ".concat(msg));
}

/**
 * Converts value entered as number
 * or string to integer value.
 *
 * @param {String} value
 * @returns {Number}
 */
function toInt(value) {
  return parseInt(value);
}
/**
 * Converts value entered as number
 * or string to flat value.
 *
 * @param {String} value
 * @returns {Number}
 */

function toFloat(value) {
  return parseFloat(value);
}
/**
 * Indicates whether the specified value is a string.
 *
 * @param  {*}   value
 * @return {Boolean}
 */

function isString(value) {
  return typeof value === 'string';
}
/**
 * Indicates whether the specified value is an object.
 *
 * @param  {*} value
 * @return {Boolean}
 *
 * @see https://github.com/jashkenas/underscore
 */

function isObject(value) {
  var type = _typeof(value);

  return type === 'function' || type === 'object' && !!value; // eslint-disable-line no-mixed-operators
}
/**
 * Indicates whether the specified value is a function.
 *
 * @param  {*} value
 * @return {Boolean}
 */

function isFunction(value) {
  return typeof value === 'function';
}
/**
 * Indicates whether the specified value is undefined.
 *
 * @param  {*} value
 * @return {Boolean}
 */

function isUndefined(value) {
  return typeof value === 'undefined';
}
/**
 * Indicates whether the specified value is an array.
 *
 * @param  {*} value
 * @return {Boolean}
 */

function isArray(value) {
  return value.constructor === Array;
}

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of glide and rest of components.
 *
 * @param {Object} glide
 * @param {Object} extensions
 *
 * @returns {Object}
 */

function mount(glide, extensions, events) {
  var components = {};

  for (var name in extensions) {
    if (isFunction(extensions[name])) {
      components[name] = extensions[name](glide, components, events);
    } else {
      warn('Extension must be a function');
    }
  }

  for (var _name in components) {
    if (isFunction(components[_name].mount)) {
      components[_name].mount();
    }
  }

  return components;
}

/**
 * Defines getter and setter property on the specified object.
 *
 * @param  {Object} obj         Object where property has to be defined.
 * @param  {String} prop        Name of the defined property.
 * @param  {Object} definition  Get and set definitions for the property.
 * @return {Void}
 */
function define(obj, prop, definition) {
  Object.defineProperty(obj, prop, definition);
}
/**
 * Sorts aphabetically object keys.
 *
 * @param  {Object} obj
 * @return {Object}
 */

function sortKeys(obj) {
  return Object.keys(obj).sort().reduce(function (r, k) {
    r[k] = obj[k];
    return r[k], r;
  }, {});
}
/**
 * Merges passed settings object with default options.
 *
 * @param  {Object} defaults
 * @param  {Object} settings
 * @return {Object}
 */

function mergeOptions(defaults, settings) {
  var options = Object.assign({}, defaults, settings); // `Object.assign` do not deeply merge objects, so we
  // have to do it manually for every nested object
  // in options. Although it does not look smart,
  // it's smaller and faster than some fancy
  // merging deep-merge algorithm script.

  if (settings.hasOwnProperty('classes')) {
    options.classes = Object.assign({}, defaults.classes, settings.classes);
    var properties = ['direction', 'type', 'slide', 'arrow', 'nav'];
    properties.forEach(function (property) {
      if (settings.classes.hasOwnProperty(property)) {
        options.classes[property] = _objectSpread2(_objectSpread2({}, defaults.classes[property]), settings.classes[property]);
      }
    });
  }

  if (settings.hasOwnProperty('breakpoints')) {
    options.breakpoints = Object.assign({}, defaults.breakpoints, settings.breakpoints);
  }

  return options;
}

var EventsBus = /*#__PURE__*/function () {
  /**
   * Construct a EventBus instance.
   *
   * @param {Object} events
   */
  function EventsBus() {
    var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsBus);

    this.events = events;
    this.hop = events.hasOwnProperty;
  }
  /**
   * Adds listener to the specifed event.
   *
   * @param {String|Array} event
   * @param {Function} handler
   */


  _createClass(EventsBus, [{
    key: "on",
    value: function on(event, handler) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.on(event[i], handler);
        }

        return;
      } // Create the event's object if not yet created


      if (!this.hop.call(this.events, event)) {
        this.events[event] = [];
      } // Add the handler to queue


      var index = this.events[event].push(handler) - 1; // Provide handle back for removal of event

      return {
        remove: function remove() {
          delete this.events[event][index];
        }
      };
    }
    /**
     * Runs registered handlers for specified event.
     *
     * @param {String|Array} event
     * @param {Object=} context
     */

  }, {
    key: "emit",
    value: function emit(event, context) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.emit(event[i], context);
        }

        return;
      } // If the event doesn't exist, or there's no handlers in queue, just leave


      if (!this.hop.call(this.events, event)) {
        return;
      } // Cycle through events queue, fire!


      this.events[event].forEach(function (item) {
        item(context || {});
      });
    }
  }]);

  return EventsBus;
}();

var Glide$1 = /*#__PURE__*/function () {
  /**
   * Construct glide.
   *
   * @param  {String} selector
   * @param  {Object} options
   */
  function Glide(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Glide);

    this._c = {};
    this._t = [];
    this._e = new EventsBus();
    this.disabled = false;
    this.selector = selector;
    this.settings = mergeOptions(defaults, options);
    this.index = this.settings.startAt;
  }
  /**
   * Initializes glide.
   *
   * @param {Object} extensions Collection of extensions to initialize.
   * @return {Glide}
   */


  _createClass(Glide, [{
    key: "mount",
    value: function mount$1() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._e.emit('mount.before');

      if (isObject(extensions)) {
        this._c = mount(this, extensions, this._e);
      } else {
        warn('You need to provide a object on `mount()`');
      }

      this._e.emit('mount.after');

      return this;
    }
    /**
     * Collects an instance `translate` transformers.
     *
     * @param  {Array} transformers Collection of transformers.
     * @return {Void}
     */

  }, {
    key: "mutate",
    value: function mutate() {
      var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (isArray(transformers)) {
        this._t = transformers;
      } else {
        warn('You need to provide a array on `mutate()`');
      }

      return this;
    }
    /**
     * Updates glide with specified settings.
     *
     * @param {Object} settings
     * @return {Glide}
     */

  }, {
    key: "update",
    value: function update() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.settings = mergeOptions(this.settings, settings);

      if (settings.hasOwnProperty('startAt')) {
        this.index = settings.startAt;
      }

      this._e.emit('update');

      return this;
    }
    /**
     * Change slide with specified pattern. A pattern must be in the special format:
     * `>` - Move one forward
     * `<` - Move one backward
     * `={i}` - Go to {i} zero-based slide (eq. '=1', will go to second slide)
     * `>>` - Rewinds to end (last slide)
     * `<<` - Rewinds to start (first slide)
     * `|>` - Move one viewport forward
     * `|<` - Move one viewport backward
     *
     * @param {String} pattern
     * @return {Glide}
     */

  }, {
    key: "go",
    value: function go(pattern) {
      this._c.Run.make(pattern);

      return this;
    }
    /**
     * Move track by specified distance.
     *
     * @param {String} distance
     * @return {Glide}
     */

  }, {
    key: "move",
    value: function move(distance) {
      this._c.Transition.disable();

      this._c.Move.make(distance);

      return this;
    }
    /**
     * Destroy instance and revert all changes done by this._c.
     *
     * @return {Glide}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._e.emit('destroy');

      return this;
    }
    /**
     * Start instance autoplaying.
     *
     * @param {Boolean|Number} interval Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Glide}
     */

  }, {
    key: "play",
    value: function play() {
      var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (interval) {
        this.settings.autoplay = interval;
      }

      this._e.emit('play');

      return this;
    }
    /**
     * Stop instance autoplaying.
     *
     * @return {Glide}
     */

  }, {
    key: "pause",
    value: function pause() {
      this._e.emit('pause');

      return this;
    }
    /**
     * Sets glide into a idle status.
     *
     * @return {Glide}
     */

  }, {
    key: "disable",
    value: function disable() {
      this.disabled = true;
      return this;
    }
    /**
     * Sets glide into a active status.
     *
     * @return {Glide}
     */

  }, {
    key: "enable",
    value: function enable() {
      this.disabled = false;
      return this;
    }
    /**
     * Adds cuutom event listener with handler.
     *
     * @param  {String|Array} event
     * @param  {Function} handler
     * @return {Glide}
     */

  }, {
    key: "on",
    value: function on(event, handler) {
      this._e.on(event, handler);

      return this;
    }
    /**
     * Checks if glide is a precised type.
     *
     * @param  {String} name
     * @return {Boolean}
     */

  }, {
    key: "isType",
    value: function isType(name) {
      return this.settings.type === name;
    }
    /**
     * Gets value of the core options.
     *
     * @return {Object}
     */

  }, {
    key: "settings",
    get: function get() {
      return this._o;
    }
    /**
     * Sets value of the core options.
     *
     * @param  {Object} o
     * @return {Void}
     */
    ,
    set: function set(o) {
      if (isObject(o)) {
        this._o = o;
      } else {
        warn('Options must be an `object` instance.');
      }
    }
    /**
     * Gets current index of the slider.
     *
     * @return {Object}
     */

  }, {
    key: "index",
    get: function get() {
      return this._i;
    }
    /**
     * Sets current index a slider.
     *
     * @return {Object}
     */
    ,
    set: function set(i) {
      this._i = toInt(i);
    }
    /**
     * Gets type name of the slider.
     *
     * @return {String}
     */

  }, {
    key: "type",
    get: function get() {
      return this.settings.type;
    }
    /**
     * Gets value of the idle status.
     *
     * @return {Boolean}
     */

  }, {
    key: "disabled",
    get: function get() {
      return this._d;
    }
    /**
     * Sets value of the idle status.
     *
     * @return {Boolean}
     */
    ,
    set: function set(status) {
      this._d = !!status;
    }
  }]);

  return Glide;
}();

function Run (Glide, Components, Events) {
  var Run = {
    /**
     * Initializes autorunning of the glide.
     *
     * @return {Void}
     */
    mount: function mount() {
      this._o = false;
    },

    /**
     * Makes glides running based on the passed moving schema.
     *
     * @param {String} move
     */
    make: function make(move) {
      var _this = this;

      if (!Glide.disabled) {
        !Glide.settings.waitForTransition || Glide.disable();
        this.move = move;
        Events.emit('run.before', this.move);
        this.calculate();
        Events.emit('run', this.move);
        Components.Transition.after(function () {
          if (_this.isStart()) {
            Events.emit('run.start', _this.move);
          }

          if (_this.isEnd()) {
            Events.emit('run.end', _this.move);
          }

          if (_this.isOffset()) {
            _this._o = false;
            Events.emit('run.offset', _this.move);
          }

          Events.emit('run.after', _this.move);
          Glide.enable();
        });
      }
    },

    /**
     * Calculates current index based on defined move.
     *
     * @return {Number|Undefined}
     */
    calculate: function calculate() {
      var move = this.move,
          length = this.length;
      var steps = move.steps,
          direction = move.direction; // By default assume that size of view is equal to one slide

      var viewSize = 1; // While direction is `=` we want jump to
      // a specified index described in steps.

      if (direction === '=') {
        // Check if bound is true, 
        // as we want to avoid whitespaces.
        if (Glide.settings.bound && toInt(steps) > length) {
          Glide.index = length;
          return;
        }

        Glide.index = steps;
        return;
      } // When pattern is equal to `>>` we want
      // fast forward to the last slide.


      if (direction === '>' && steps === '>') {
        Glide.index = length;
        return;
      } // When pattern is equal to `<<` we want
      // fast forward to the first slide.


      if (direction === '<' && steps === '<') {
        Glide.index = 0;
        return;
      } // pagination movement


      if (direction === '|') {
        viewSize = Glide.settings.perView || 1;
      } // we are moving forward


      if (direction === '>' || direction === '|' && steps === '>') {
        var index = calculateForwardIndex(viewSize);

        if (index > length) {
          this._o = true;
        }

        Glide.index = normalizeForwardIndex(index, viewSize);
        return;
      } // we are moving backward


      if (direction === '<' || direction === '|' && steps === '<') {
        var _index = calculateBackwardIndex(viewSize);

        if (_index < 0) {
          this._o = true;
        }

        Glide.index = normalizeBackwardIndex(_index, viewSize);
        return;
      }

      warn("Invalid direction pattern [".concat(direction).concat(steps, "] has been used"));
    },

    /**
     * Checks if we are on the first slide.
     *
     * @return {Boolean}
     */
    isStart: function isStart() {
      return Glide.index <= 0;
    },

    /**
     * Checks if we are on the last slide.
     *
     * @return {Boolean}
     */
    isEnd: function isEnd() {
      return Glide.index >= this.length;
    },

    /**
     * Checks if we are making a offset run.
     *
     * @param {String} direction
     * @return {Boolean}
     */
    isOffset: function isOffset() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (!direction) {
        return this._o;
      }

      if (!this._o) {
        return false;
      } // did we view to the right?


      if (direction === '|>') {
        return this.move.direction === '|' && this.move.steps === '>';
      } // did we view to the left?


      if (direction === '|<') {
        return this.move.direction === '|' && this.move.steps === '<';
      }

      return this.move.direction === direction;
    },

    /**
     * Checks if bound mode is active
     *
     * @return {Boolean}
     */
    isBound: function isBound() {
      return Glide.isType('slider') && Glide.settings.focusAt !== 'center' && Glide.settings.bound;
    }
  };
  /**
   * Returns index value to move forward/to the right
   *
   * @param viewSize
   * @returns {Number}
   */

  function calculateForwardIndex(viewSize) {
    var index = Glide.index;

    if (Glide.isType('carousel')) {
      return index + viewSize;
    }

    return index + (viewSize - index % viewSize);
  }
  /**
   * Normalizes the given forward index based on glide settings, preventing it to exceed certain boundaries
   *
   * @param index
   * @param length
   * @param viewSize
   * @returns {Number}
   */


  function normalizeForwardIndex(index, viewSize) {
    var length = Run.length;

    if (index <= length) {
      return index;
    }

    if (Glide.isType('carousel')) {
      return index - (length + 1);
    }

    if (Glide.settings.rewind) {
      // bound does funny things with the length, therefor we have to be certain
      // that we are on the last possible index value given by bound
      if (Run.isBound() && !Run.isEnd()) {
        return length;
      }

      return 0;
    }

    if (Run.isBound()) {
      return length;
    }

    return Math.floor(length / viewSize) * viewSize;
  }
  /**
   * Calculates index value to move backward/to the left
   *
   * @param viewSize
   * @returns {Number}
   */


  function calculateBackwardIndex(viewSize) {
    var index = Glide.index;

    if (Glide.isType('carousel')) {
      return index - viewSize;
    } // ensure our back navigation results in the same index as a forward navigation
    // to experience a homogeneous paging


    var view = Math.ceil(index / viewSize);
    return (view - 1) * viewSize;
  }
  /**
   * Normalizes the given backward index based on glide settings, preventing it to exceed certain boundaries
   *
   * @param index
   * @param length
   * @param viewSize
   * @returns {*}
   */


  function normalizeBackwardIndex(index, viewSize) {
    var length = Run.length;

    if (index >= 0) {
      return index;
    }

    if (Glide.isType('carousel')) {
      return index + (length + 1);
    }

    if (Glide.settings.rewind) {
      // bound does funny things with the length, therefor we have to be certain
      // that we are on first possible index value before we to rewind to the length given by bound
      if (Run.isBound() && Run.isStart()) {
        return length;
      }

      return Math.floor(length / viewSize) * viewSize;
    }

    return 0;
  }

  define(Run, 'move', {
    /**
     * Gets value of the move schema.
     *
     * @returns {Object}
     */
    get: function get() {
      return this._m;
    },

    /**
     * Sets value of the move schema.
     *
     * @returns {Object}
     */
    set: function set(value) {
      var step = value.substr(1);
      this._m = {
        direction: value.substr(0, 1),
        steps: step ? toInt(step) ? toInt(step) : step : 0
      };
    }
  });
  define(Run, 'length', {
    /**
     * Gets value of the running distance based
     * on zero-indexing number of slides.
     *
     * @return {Number}
     */
    get: function get() {
      var settings = Glide.settings;
      var length = Components.Html.slides.length; // If the `bound` option is active, a maximum running distance should be
      // reduced by `perView` and `focusAt` settings. Running distance
      // should end before creating an empty space after instance.

      if (this.isBound()) {
        return length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt);
      }

      return length - 1;
    }
  });
  define(Run, 'offset', {
    /**
     * Gets status of the offsetting flag.
     *
     * @return {Boolean}
     */
    get: function get() {
      return this._o;
    }
  });
  return Run;
}

/**
 * Returns a current time.
 *
 * @return {Number}
 */
function now() {
  return new Date().getTime();
}

/**
 * Returns a function, that, when invoked, will only be triggered
 * at most once during a given window of time.
 *
 * @param {Function} func
 * @param {Number} wait
 * @param {Object=} options
 * @return {Function}
 *
 * @see https://github.com/jashkenas/underscore
 */

function throttle(func, wait) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var timeout, context, args, result;
  var previous = 0;

  var later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var at = now();
    if (!previous && options.leading === false) previous = at;
    var remaining = wait - (at - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = at;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

var MARGIN_TYPE = {
  ltr: ['marginLeft', 'marginRight'],
  rtl: ['marginRight', 'marginLeft']
};
function Gaps (Glide, Components, Events) {
  var Gaps = {
    /**
     * Applies gaps between slides. First and last
     * slides do not receive it's edge margins.
     *
     * @param {HTMLCollection} slides
     * @return {Void}
     */
    apply: function apply(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;
        var direction = Components.Direction.value;

        if (i !== 0) {
          style[MARGIN_TYPE[direction][0]] = "".concat(this.value / 2, "px");
        } else {
          style[MARGIN_TYPE[direction][0]] = '';
        }

        if (i !== slides.length - 1) {
          style[MARGIN_TYPE[direction][1]] = "".concat(this.value / 2, "px");
        } else {
          style[MARGIN_TYPE[direction][1]] = '';
        }
      }
    },

    /**
     * Removes gaps from the slides.
     *
     * @param {HTMLCollection} slides
     * @returns {Void}
    */
    remove: function remove(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;
        style.marginLeft = '';
        style.marginRight = '';
      }
    }
  };
  define(Gaps, 'value', {
    /**
     * Gets value of the gap.
     *
     * @returns {Number}
     */
    get: function get() {
      return toInt(Glide.settings.gap);
    }
  });
  define(Gaps, 'grow', {
    /**
     * Gets additional dimensions value caused by gaps.
     * Used to increase width of the slides wrapper.
     *
     * @returns {Number}
     */
    get: function get() {
      return Gaps.value * Components.Sizes.length;
    }
  });
  define(Gaps, 'reductor', {
    /**
     * Gets reduction value caused by gaps.
     * Used to subtract width of the slides.
     *
     * @returns {Number}
     */
    get: function get() {
      var perView = Glide.settings.perView;
      return Gaps.value * (perView - 1) / perView;
    }
  });
  /**
   * Apply calculated gaps:
   * - after building, so slides (including clones) will receive proper margins
   * - on updating via API, to recalculate gaps with new options
   */

  Events.on(['build.after', 'update'], throttle(function () {
    Gaps.apply(Components.Html.wrapper.children);
  }, 30));
  /**
   * Remove gaps:
   * - on destroying to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Gaps.remove(Components.Html.wrapper.children);
  });
  return Gaps;
}

/**
 * Finds siblings nodes of the passed node.
 *
 * @param  {Element} node
 * @return {Array}
 */
function siblings(node) {
  if (node && node.parentNode) {
    var n = node.parentNode.firstChild;
    var matched = [];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== node) {
        matched.push(n);
      }
    }

    return matched;
  }

  return [];
}
/**
 * Coerces a NodeList to an Array.
 *
 * @param  {NodeList} nodeList
 * @return {Array}
 */

function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

var TRACK_SELECTOR = '[data-glide-el="track"]';
function Html (Glide, Components, Events) {
  var Html = {
    /**
     * Setup slider HTML nodes.
     *
     * @param {Glide} glide
     */
    mount: function mount() {
      this.root = Glide.selector;
      this.track = this.root.querySelector(TRACK_SELECTOR);
      this.collectSlides();
    },

    /**
     * Collect slides
     */
    collectSlides: function collectSlides() {
      this.slides = toArray(this.wrapper.children).filter(function (slide) {
        return !slide.classList.contains(Glide.settings.classes.slide.clone);
      });
    }
  };
  define(Html, 'root', {
    /**
     * Gets node of the glide main element.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._r;
    },

    /**
     * Sets node of the glide main element.
     *
     * @return {Object}
     */
    set: function set(r) {
      if (isString(r)) {
        r = document.querySelector(r);
      }

      if (r !== null) {
        Html._r = r;
      } else {
        warn('Root element must be a existing Html node');
      }
    }
  });
  define(Html, 'track', {
    /**
     * Gets node of the glide track with slides.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._t;
    },

    /**
     * Sets node of the glide track with slides.
     *
     * @return {Object}
     */
    set: function set(t) {
      Html._t = t;
    }
  });
  define(Html, 'wrapper', {
    /**
     * Gets node of the slides wrapper.
     *
     * @return {Object}
     */
    get: function get() {
      return Html.track.children[0];
    }
  });
  /**
   * Add/remove/reorder dynamic slides
   */

  Events.on('update', function () {
    Html.collectSlides();
  });
  return Html;
}

function Peek (Glide, Components, Events) {
  var Peek = {
    /**
     * Setups how much to peek based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.peek;
    }
  };
  define(Peek, 'value', {
    /**
     * Gets value of the peek.
     *
     * @returns {Number|Object}
     */
    get: function get() {
      return Peek._v;
    },

    /**
     * Sets value of the peek.
     *
     * @param {Number|Object} value
     * @return {Void}
     */
    set: function set(value) {
      if (isObject(value)) {
        value.before = toInt(value.before);
        value.after = toInt(value.after);
      } else {
        value = toInt(value);
      }

      Peek._v = value;
    }
  });
  define(Peek, 'reductor', {
    /**
     * Gets reduction value caused by peek.
     *
     * @returns {Number}
     */
    get: function get() {
      var value = Peek.value;
      var perView = Glide.settings.perView;

      if (isObject(value)) {
        return value.before / perView + value.after / perView;
      }

      return value * 2 / perView;
    }
  });
  /**
   * Recalculate peeking sizes on:
   * - when resizing window to update to proper percents
   */

  Events.on(['resize', 'update'], function () {
    Peek.mount();
  });
  return Peek;
}

function Move (Glide, Components, Events) {
  var Move = {
    /**
     * Constructs move component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      this._o = 0;
    },

    /**
     * Calculates a movement value based on passed offset and currently active index.
     *
     * @param  {Number} offset
     * @return {Void}
     */
    make: function make() {
      var _this = this;

      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.offset = offset;
      Events.emit('move', {
        movement: this.value
      });
      Components.Transition.after(function () {
        Events.emit('move.after', {
          movement: _this.value
        });
      });
    }
  };
  define(Move, 'offset', {
    /**
     * Gets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    get: function get() {
      return Move._o;
    },

    /**
     * Sets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    set: function set(value) {
      Move._o = !isUndefined(value) ? toInt(value) : 0;
    }
  });
  define(Move, 'translate', {
    /**
     * Gets a raw movement value.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Sizes.slideWidth * Glide.index;
    }
  });
  define(Move, 'value', {
    /**
     * Gets an actual movement value corrected by offset.
     *
     * @return {Number}
     */
    get: function get() {
      var offset = this.offset;
      var translate = this.translate;

      if (Components.Direction.is('rtl')) {
        return translate + offset;
      }

      return translate - offset;
    }
  });
  /**
   * Make movement to proper slide on:
   * - before build, so glide will start at `startAt` index
   * - on each standard run to move to newly calculated index
   */

  Events.on(['build.before', 'run'], function () {
    Move.make();
  });
  return Move;
}

function Sizes (Glide, Components, Events) {
  var Sizes = {
    /**
     * Setups dimensions of slides.
     *
     * @return {Void}
     */
    setupSlides: function setupSlides() {
      var width = "".concat(this.slideWidth, "px");
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = width;
      }
    },

    /**
     * Setups dimensions of slides wrapper.
     *
     * @return {Void}
     */
    setupWrapper: function setupWrapper() {
      Components.Html.wrapper.style.width = "".concat(this.wrapperSize, "px");
    },

    /**
     * Removes applied styles from HTML elements.
     *
     * @returns {Void}
     */
    remove: function remove() {
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = '';
      }

      Components.Html.wrapper.style.width = '';
    }
  };
  define(Sizes, 'length', {
    /**
     * Gets count number of the slides.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.slides.length;
    }
  });
  define(Sizes, 'width', {
    /**
     * Gets width value of the slider (visible area).
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.track.offsetWidth;
    }
  });
  define(Sizes, 'wrapperSize', {
    /**
     * Gets size of the slides wrapper.
     *
     * @return {Number}
     */
    get: function get() {
      return Sizes.slideWidth * Sizes.length + Components.Gaps.grow + Components.Clones.grow;
    }
  });
  define(Sizes, 'slideWidth', {
    /**
     * Gets width value of a single slide.
     *
     * @return {Number}
     */
    get: function get() {
      return Sizes.width / Glide.settings.perView - Components.Peek.reductor - Components.Gaps.reductor;
    }
  });
  /**
   * Apply calculated glide's dimensions:
   * - before building, so other dimensions (e.g. translate) will be calculated propertly
   * - when resizing window to recalculate sildes dimensions
   * - on updating via API, to calculate dimensions based on new options
   */

  Events.on(['build.before', 'resize', 'update'], function () {
    Sizes.setupSlides();
    Sizes.setupWrapper();
  });
  /**
   * Remove calculated glide's dimensions:
   * - on destoting to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Sizes.remove();
  });
  return Sizes;
}

function Build (Glide, Components, Events) {
  var Build = {
    /**
     * Init glide building. Adds classes, sets
     * dimensions and setups initial state.
     *
     * @return {Void}
     */
    mount: function mount() {
      Events.emit('build.before');
      this.typeClass();
      this.activeClass();
      Events.emit('build.after');
    },

    /**
     * Adds `type` class to the glide element.
     *
     * @return {Void}
     */
    typeClass: function typeClass() {
      Components.Html.root.classList.add(Glide.settings.classes.type[Glide.settings.type]);
    },

    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    activeClass: function activeClass() {
      var classes = Glide.settings.classes;
      var slide = Components.Html.slides[Glide.index];

      if (slide) {
        slide.classList.add(classes.slide.active);
        siblings(slide).forEach(function (sibling) {
          sibling.classList.remove(classes.slide.active);
        });
      }
    },

    /**
     * Removes HTML classes applied at building.
     *
     * @return {Void}
     */
    removeClasses: function removeClasses() {
      var _Glide$settings$class = Glide.settings.classes,
          type = _Glide$settings$class.type,
          slide = _Glide$settings$class.slide;
      Components.Html.root.classList.remove(type[Glide.settings.type]);
      Components.Html.slides.forEach(function (sibling) {
        sibling.classList.remove(slide.active);
      });
    }
  };
  /**
   * Clear building classes:
   * - on destroying to bring HTML to its initial state
   * - on updating to remove classes before remounting component
   */

  Events.on(['destroy', 'update'], function () {
    Build.removeClasses();
  });
  /**
   * Remount component:
   * - on resizing of the window to calculate new dimensions
   * - on updating settings via API
   */

  Events.on(['resize', 'update'], function () {
    Build.mount();
  });
  /**
   * Swap active class of current slide:
   * - after each move to the new index
   */

  Events.on('move.after', function () {
    Build.activeClass();
  });
  return Build;
}

function Clones (Glide, Components, Events) {
  var Clones = {
    /**
     * Create pattern map and collect slides to be cloned.
     */
    mount: function mount() {
      this.items = [];

      if (Glide.isType('carousel')) {
        this.items = this.collect();
      }
    },

    /**
     * Collect clones with pattern.
     *
     * @return {[]}
     */
    collect: function collect() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var slides = Components.Html.slides;
      var _Glide$settings = Glide.settings,
          perView = _Glide$settings.perView,
          classes = _Glide$settings.classes,
          cloningRatio = _Glide$settings.cloningRatio;

      if (slides.length > 0) {
        var peekIncrementer = +!!Glide.settings.peek;
        var cloneCount = perView + peekIncrementer + Math.round(perView / 2);
        var append = slides.slice(0, cloneCount).reverse();
        var prepend = slides.slice(cloneCount * -1);

        for (var r = 0; r < Math.max(cloningRatio, Math.floor(perView / slides.length)); r++) {
          for (var i = 0; i < append.length; i++) {
            var clone = append[i].cloneNode(true);
            clone.classList.add(classes.slide.clone);
            items.push(clone);
          }

          for (var _i = 0; _i < prepend.length; _i++) {
            var _clone = prepend[_i].cloneNode(true);

            _clone.classList.add(classes.slide.clone);

            items.unshift(_clone);
          }
        }
      }

      return items;
    },

    /**
     * Append cloned slides with generated pattern.
     *
     * @return {Void}
     */
    append: function append() {
      var items = this.items;
      var _Components$Html = Components.Html,
          wrapper = _Components$Html.wrapper,
          slides = _Components$Html.slides;
      var half = Math.floor(items.length / 2);
      var prepend = items.slice(0, half).reverse();
      var append = items.slice(half * -1).reverse();
      var width = "".concat(Components.Sizes.slideWidth, "px");

      for (var i = 0; i < append.length; i++) {
        wrapper.appendChild(append[i]);
      }

      for (var _i2 = 0; _i2 < prepend.length; _i2++) {
        wrapper.insertBefore(prepend[_i2], slides[0]);
      }

      for (var _i3 = 0; _i3 < items.length; _i3++) {
        items[_i3].style.width = width;
      }
    },

    /**
     * Remove all cloned slides.
     *
     * @return {Void}
     */
    remove: function remove() {
      var items = this.items;

      for (var i = 0; i < items.length; i++) {
        Components.Html.wrapper.removeChild(items[i]);
      }
    }
  };
  define(Clones, 'grow', {
    /**
     * Gets additional dimensions value caused by clones.
     *
     * @return {Number}
     */
    get: function get() {
      return (Components.Sizes.slideWidth + Components.Gaps.value) * Clones.items.length;
    }
  });
  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */

  Events.on('update', function () {
    Clones.remove();
    Clones.mount();
    Clones.append();
  });
  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */

  Events.on('build.before', function () {
    if (Glide.isType('carousel')) {
      Clones.append();
    }
  });
  /**
   * Remove clones HTMLElements:
   * - on destroying, to bring HTML to its initial state
   */

  Events.on('destroy', function () {
    Clones.remove();
  });
  return Clones;
}

var EventsBinder = /*#__PURE__*/function () {
  /**
   * Construct a EventsBinder instance.
   */
  function EventsBinder() {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsBinder);

    this.listeners = listeners;
  }
  /**
   * Adds events listeners to arrows HTML elements.
   *
   * @param  {String|Array} events
   * @param  {Element|Window|Document} el
   * @param  {Function} closure
   * @param  {Boolean|Object} capture
   * @return {Void}
   */


  _createClass(EventsBinder, [{
    key: "on",
    value: function on(events, el, closure) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (isString(events)) {
        events = [events];
      }

      for (var i = 0; i < events.length; i++) {
        this.listeners[events[i]] = closure;
        el.addEventListener(events[i], this.listeners[events[i]], capture);
      }
    }
    /**
     * Removes event listeners from arrows HTML elements.
     *
     * @param  {String|Array} events
     * @param  {Element|Window|Document} el
     * @param  {Boolean|Object} capture
     * @return {Void}
     */

  }, {
    key: "off",
    value: function off(events, el) {
      var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isString(events)) {
        events = [events];
      }

      for (var i = 0; i < events.length; i++) {
        el.removeEventListener(events[i], this.listeners[events[i]], capture);
      }
    }
    /**
     * Destroy collected listeners.
     *
     * @returns {Void}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      delete this.listeners;
    }
  }]);

  return EventsBinder;
}();

function Resize (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Resize = {
    /**
     * Initializes window bindings.
     */
    mount: function mount() {
      this.bind();
    },

    /**
     * Binds `rezsize` listener to the window.
     * It's a costly event, so we are debouncing it.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('resize', window, throttle(function () {
        Events.emit('resize');
      }, Glide.settings.throttle));
    },

    /**
     * Unbinds listeners from the window.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('resize', window);
    }
  };
  /**
   * Remove bindings from window:
   * - on destroying, to remove added EventListener
   */

  Events.on('destroy', function () {
    Resize.unbind();
    Binder.destroy();
  });
  return Resize;
}

var VALID_DIRECTIONS = ['ltr', 'rtl'];
var FLIPED_MOVEMENTS = {
  '>': '<',
  '<': '>',
  '=': '='
};
function Direction (Glide, Components, Events) {
  var Direction = {
    /**
     * Setups gap value based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.direction;
    },

    /**
     * Resolves pattern based on direction value
     *
     * @param {String} pattern
     * @returns {String}
     */
    resolve: function resolve(pattern) {
      var token = pattern.slice(0, 1);

      if (this.is('rtl')) {
        return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
      }

      return pattern;
    },

    /**
     * Checks value of direction mode.
     *
     * @param {String} direction
     * @returns {Boolean}
     */
    is: function is(direction) {
      return this.value === direction;
    },

    /**
     * Applies direction class to the root HTML element.
     *
     * @return {Void}
     */
    addClass: function addClass() {
      Components.Html.root.classList.add(Glide.settings.classes.direction[this.value]);
    },

    /**
     * Removes direction class from the root HTML element.
     *
     * @return {Void}
     */
    removeClass: function removeClass() {
      Components.Html.root.classList.remove(Glide.settings.classes.direction[this.value]);
    }
  };
  define(Direction, 'value', {
    /**
     * Gets value of the direction.
     *
     * @returns {Number}
     */
    get: function get() {
      return Direction._v;
    },

    /**
     * Sets value of the direction.
     *
     * @param {String} value
     * @return {Void}
     */
    set: function set(value) {
      if (VALID_DIRECTIONS.indexOf(value) > -1) {
        Direction._v = value;
      } else {
        warn('Direction value must be `ltr` or `rtl`');
      }
    }
  });
  /**
   * Clear direction class:
   * - on destroy to bring HTML to its initial state
   * - on update to remove class before reappling bellow
   */

  Events.on(['destroy', 'update'], function () {
    Direction.removeClass();
  });
  /**
   * Remount component:
   * - on update to reflect changes in direction value
   */

  Events.on('update', function () {
    Direction.mount();
  });
  /**
   * Apply direction class:
   * - before building to apply class for the first time
   * - on updating to reapply direction class that may changed
   */

  Events.on(['build.before', 'update'], function () {
    Direction.addClass();
  });
  return Direction;
}

/**
 * Reflects value of glide movement.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Rtl (Glide, Components) {
  return {
    /**
     * Negates the passed translate if glide is in RTL option.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      if (Components.Direction.is('rtl')) {
        return -translate;
      }

      return translate;
    }
  };
}

/**
 * Updates glide movement with a `gap` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Gap (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with number in the `gap` settings.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      var multiplier = Math.floor(translate / Components.Sizes.slideWidth);
      return translate + Components.Gaps.value * multiplier;
    }
  };
}

/**
 * Updates glide movement with width of additional clones width.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Grow (Glide, Components) {
  return {
    /**
     * Adds to the passed translate width of the half of clones.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      return translate + Components.Clones.grow / 2;
    }
  };
}

/**
 * Updates glide movement with a `peek` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */

function Peeking (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with a `peek` setting.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      if (Glide.settings.focusAt >= 0) {
        var peek = Components.Peek.value;

        if (isObject(peek)) {
          return translate - peek.before;
        }

        return translate - peek;
      }

      return translate;
    }
  };
}

/**
 * Updates glide movement with a `focusAt` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Focusing (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with index in the `focusAt` setting.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      var gap = Components.Gaps.value;
      var width = Components.Sizes.width;
      var focusAt = Glide.settings.focusAt;
      var slideWidth = Components.Sizes.slideWidth;

      if (focusAt === 'center') {
        return translate - (width / 2 - slideWidth / 2);
      }

      return translate - slideWidth * focusAt - gap * focusAt;
    }
  };
}

/**
 * Applies diffrent transformers on translate value.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */

function mutator (Glide, Components, Events) {
  /**
   * Merge instance transformers with collection of default transformers.
   * It's important that the Rtl component be last on the list,
   * so it reflects all previous transformations.
   *
   * @type {Array}
   */
  var TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);
  return {
    /**
     * Piplines translate value with registered transformers.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    mutate: function mutate(translate) {
      for (var i = 0; i < TRANSFORMERS.length; i++) {
        var transformer = TRANSFORMERS[i];

        if (isFunction(transformer) && isFunction(transformer().modify)) {
          translate = transformer(Glide, Components, Events).modify(translate);
        } else {
          warn('Transformer should be a function that returns an object with `modify()` method');
        }
      }

      return translate;
    }
  };
}

function Translate (Glide, Components, Events) {
  var Translate = {
    /**
     * Sets value of translate on HTML element.
     *
     * @param {Number} value
     * @return {Void}
     */
    set: function set(value) {
      var transform = mutator(Glide, Components).mutate(value);
      var translate3d = "translate3d(".concat(-1 * transform, "px, 0px, 0px)");
      Components.Html.wrapper.style.mozTransform = translate3d; // needed for supported Firefox 10-15

      Components.Html.wrapper.style.webkitTransform = translate3d; // needed for supported Chrome 10-35, Safari 5.1-8, and Opera 15-22

      Components.Html.wrapper.style.transform = translate3d;
    },

    /**
     * Removes value of translate from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transform = '';
    },

    /**
     * @return {number}
     */
    getStartIndex: function getStartIndex() {
      var length = Components.Sizes.length;
      var index = Glide.index;
      var perView = Glide.settings.perView;

      if (Components.Run.isOffset('>') || Components.Run.isOffset('|>')) {
        return length + (index - perView);
      } // "modulo length" converts an index that equals length to zero


      return (index + perView) % length;
    },

    /**
     * @return {number}
     */
    getTravelDistance: function getTravelDistance() {
      var travelDistance = Components.Sizes.slideWidth * Glide.settings.perView;

      if (Components.Run.isOffset('>') || Components.Run.isOffset('|>')) {
        // reverse travel distance so that we don't have to change subtract operations
        return travelDistance * -1;
      }

      return travelDistance;
    }
  };
  /**
   * Set new translate value:
   * - on move to reflect index change
   * - on updating via API to reflect possible changes in options
   */

  Events.on('move', function (context) {
    if (!Glide.isType('carousel') || !Components.Run.isOffset()) {
      return Translate.set(context.movement);
    }

    Components.Transition.after(function () {
      Events.emit('translate.jump');
      Translate.set(Components.Sizes.slideWidth * Glide.index);
    });
    var startWidth = Components.Sizes.slideWidth * Components.Translate.getStartIndex();
    return Translate.set(startWidth - Components.Translate.getTravelDistance());
  });
  /**
   * Remove translate:
   * - on destroying to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Translate.remove();
  });
  return Translate;
}

function Transition (Glide, Components, Events) {
  /**
   * Holds inactivity status of transition.
   * When true transition is not applied.
   *
   * @type {Boolean}
   */
  var disabled = false;
  var Transition = {
    /**
     * Composes string of the CSS transition.
     *
     * @param {String} property
     * @return {String}
     */
    compose: function compose(property) {
      var settings = Glide.settings;

      if (disabled) {
        return "".concat(property, " 0ms ").concat(settings.animationTimingFunc);
      }

      return "".concat(property, " ").concat(this.duration, "ms ").concat(settings.animationTimingFunc);
    },

    /**
     * Sets value of transition on HTML element.
     *
     * @param {String=} property
     * @return {Void}
     */
    set: function set() {
      var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
      Components.Html.wrapper.style.transition = this.compose(property);
    },

    /**
     * Removes value of transition from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transition = '';
    },

    /**
     * Runs callback after animation.
     *
     * @param  {Function} callback
     * @return {Void}
     */
    after: function after(callback) {
      setTimeout(function () {
        callback();
      }, this.duration);
    },

    /**
     * Enable transition.
     *
     * @return {Void}
     */
    enable: function enable() {
      disabled = false;
      this.set();
    },

    /**
     * Disable transition.
     *
     * @return {Void}
     */
    disable: function disable() {
      disabled = true;
      this.set();
    }
  };
  define(Transition, 'duration', {
    /**
     * Gets duration of the transition based
     * on currently running animation type.
     *
     * @return {Number}
     */
    get: function get() {
      var settings = Glide.settings;

      if (Glide.isType('slider') && Components.Run.offset) {
        return settings.rewindDuration;
      }

      return settings.animationDuration;
    }
  });
  /**
   * Set transition `style` value:
   * - on each moving, because it may be cleared by offset move
   */

  Events.on('move', function () {
    Transition.set();
  });
  /**
   * Disable transition:
   * - before initial build to avoid transitioning from `0` to `startAt` index
   * - while resizing window and recalculating dimensions
   * - on jumping from offset transition at start and end edges in `carousel` type
   */

  Events.on(['build.before', 'resize', 'translate.jump'], function () {
    Transition.disable();
  });
  /**
   * Enable transition:
   * - on each running, because it may be disabled by offset move
   */

  Events.on('run', function () {
    Transition.enable();
  });
  /**
   * Remove transition:
   * - on destroying to bring markup to its inital state
   */

  Events.on('destroy', function () {
    Transition.remove();
  });
  return Transition;
}

/**
 * Test via a getter in the options object to see
 * if the passive property is accessed.
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 */
var supportsPassive = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

var supportsPassive$1 = supportsPassive;

var START_EVENTS = ['touchstart', 'mousedown'];
var MOVE_EVENTS = ['touchmove', 'mousemove'];
var END_EVENTS = ['touchend', 'touchcancel', 'mouseup', 'mouseleave'];
var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
function Swipe (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var swipeSin = 0;
  var swipeStartX = 0;
  var swipeStartY = 0;
  var disabled = false;
  var capture = supportsPassive$1 ? {
    passive: true
  } : false;
  var Swipe = {
    /**
     * Initializes swipe bindings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bindSwipeStart();
    },

    /**
     * Handler for `swipestart` event. Calculates entry points of the user's tap.
     *
     * @param {Object} event
     * @return {Void}
     */
    start: function start(event) {
      if (!disabled && !Glide.disabled) {
        this.disable();
        var swipe = this.touches(event);
        swipeSin = null;
        swipeStartX = toInt(swipe.pageX);
        swipeStartY = toInt(swipe.pageY);
        this.bindSwipeMove();
        this.bindSwipeEnd();
        Events.emit('swipe.start');
      }
    },

    /**
     * Handler for `swipemove` event. Calculates user's tap angle and distance.
     *
     * @param {Object} event
     */
    move: function move(event) {
      if (!Glide.disabled) {
        var _Glide$settings = Glide.settings,
            touchAngle = _Glide$settings.touchAngle,
            touchRatio = _Glide$settings.touchRatio,
            classes = _Glide$settings.classes;
        var swipe = this.touches(event);
        var subExSx = toInt(swipe.pageX) - swipeStartX;
        var subEySy = toInt(swipe.pageY) - swipeStartY;
        var powEX = Math.abs(subExSx << 2);
        var powEY = Math.abs(subEySy << 2);
        var swipeHypotenuse = Math.sqrt(powEX + powEY);
        var swipeCathetus = Math.sqrt(powEY);
        swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

        if (swipeSin * 180 / Math.PI < touchAngle) {
          event.stopPropagation();
          Components.Move.make(subExSx * toFloat(touchRatio));
          Components.Html.root.classList.add(classes.dragging);
          Events.emit('swipe.move');
        } else {
          return false;
        }
      }
    },

    /**
     * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
     *
     * @param {Object} event
     * @return {Void}
     */
    end: function end(event) {
      if (!Glide.disabled) {
        var _Glide$settings2 = Glide.settings,
            perSwipe = _Glide$settings2.perSwipe,
            touchAngle = _Glide$settings2.touchAngle,
            classes = _Glide$settings2.classes;
        var swipe = this.touches(event);
        var threshold = this.threshold(event);
        var swipeDistance = swipe.pageX - swipeStartX;
        var swipeDeg = swipeSin * 180 / Math.PI;
        this.enable();

        if (swipeDistance > threshold && swipeDeg < touchAngle) {
          Components.Run.make(Components.Direction.resolve("".concat(perSwipe, "<")));
        } else if (swipeDistance < -threshold && swipeDeg < touchAngle) {
          Components.Run.make(Components.Direction.resolve("".concat(perSwipe, ">")));
        } else {
          // While swipe don't reach distance apply previous transform.
          Components.Move.make();
        }

        Components.Html.root.classList.remove(classes.dragging);
        this.unbindSwipeMove();
        this.unbindSwipeEnd();
        Events.emit('swipe.end');
      }
    },

    /**
     * Binds swipe's starting event.
     *
     * @return {Void}
     */
    bindSwipeStart: function bindSwipeStart() {
      var _this = this;

      var _Glide$settings3 = Glide.settings,
          swipeThreshold = _Glide$settings3.swipeThreshold,
          dragThreshold = _Glide$settings3.dragThreshold;

      if (swipeThreshold) {
        Binder.on(START_EVENTS[0], Components.Html.wrapper, function (event) {
          _this.start(event);
        }, capture);
      }

      if (dragThreshold) {
        Binder.on(START_EVENTS[1], Components.Html.wrapper, function (event) {
          _this.start(event);
        }, capture);
      }
    },

    /**
     * Unbinds swipe's starting event.
     *
     * @return {Void}
     */
    unbindSwipeStart: function unbindSwipeStart() {
      Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
      Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
    },

    /**
     * Binds swipe's moving event.
     *
     * @return {Void}
     */
    bindSwipeMove: function bindSwipeMove() {
      var _this2 = this;

      Binder.on(MOVE_EVENTS, Components.Html.wrapper, throttle(function (event) {
        _this2.move(event);
      }, Glide.settings.throttle), capture);
    },

    /**
     * Unbinds swipe's moving event.
     *
     * @return {Void}
     */
    unbindSwipeMove: function unbindSwipeMove() {
      Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
    },

    /**
     * Binds swipe's ending event.
     *
     * @return {Void}
     */
    bindSwipeEnd: function bindSwipeEnd() {
      var _this3 = this;

      Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
        _this3.end(event);
      });
    },

    /**
     * Unbinds swipe's ending event.
     *
     * @return {Void}
     */
    unbindSwipeEnd: function unbindSwipeEnd() {
      Binder.off(END_EVENTS, Components.Html.wrapper);
    },

    /**
     * Normalizes event touches points accorting to different types.
     *
     * @param {Object} event
     */
    touches: function touches(event) {
      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return event;
      }

      return event.touches[0] || event.changedTouches[0];
    },

    /**
     * Gets value of minimum swipe distance settings based on event type.
     *
     * @return {Number}
     */
    threshold: function threshold(event) {
      var settings = Glide.settings;

      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return settings.dragThreshold;
      }

      return settings.swipeThreshold;
    },

    /**
     * Enables swipe event.
     *
     * @return {self}
     */
    enable: function enable() {
      disabled = false;
      Components.Transition.enable();
      return this;
    },

    /**
     * Disables swipe event.
     *
     * @return {self}
     */
    disable: function disable() {
      disabled = true;
      Components.Transition.disable();
      return this;
    }
  };
  /**
   * Add component class:
   * - after initial building
   */

  Events.on('build.after', function () {
    Components.Html.root.classList.add(Glide.settings.classes.swipeable);
  });
  /**
   * Remove swiping bindings:
   * - on destroying, to remove added EventListeners
   */

  Events.on('destroy', function () {
    Swipe.unbindSwipeStart();
    Swipe.unbindSwipeMove();
    Swipe.unbindSwipeEnd();
    Binder.destroy();
  });
  return Swipe;
}

function Images (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Images = {
    /**
     * Binds listener to glide wrapper.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bind();
    },

    /**
     * Binds `dragstart` event on wrapper to prevent dragging images.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('dragstart', Components.Html.wrapper, this.dragstart);
    },

    /**
     * Unbinds `dragstart` event on wrapper.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('dragstart', Components.Html.wrapper);
    },

    /**
     * Event handler. Prevents dragging.
     *
     * @return {Void}
     */
    dragstart: function dragstart(event) {
      event.preventDefault();
    }
  };
  /**
   * Remove bindings from images:
   * - on destroying, to remove added EventListeners
   */

  Events.on('destroy', function () {
    Images.unbind();
    Binder.destroy();
  });
  return Images;
}

function Anchors (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  /**
   * Holds detaching status of anchors.
   * Prevents detaching of already detached anchors.
   *
   * @private
   * @type {Boolean}
   */

  var detached = false;
  /**
   * Holds preventing status of anchors.
   * If `true` redirection after click will be disabled.
   *
   * @private
   * @type {Boolean}
   */

  var prevented = false;
  var Anchors = {
    /**
     * Setups a initial state of anchors component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      /**
       * Holds collection of anchors elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._a = Components.Html.wrapper.querySelectorAll('a');
      this.bind();
    },

    /**
     * Binds events to anchors inside a track.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('click', Components.Html.wrapper, this.click);
    },

    /**
     * Unbinds events attached to anchors inside a track.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('click', Components.Html.wrapper);
    },

    /**
     * Handler for click event. Prevents clicks when glide is in `prevent` status.
     *
     * @param  {Object} event
     * @return {Void}
     */
    click: function click(event) {
      if (prevented) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    /**
     * Detaches anchors click event inside glide.
     *
     * @return {self}
     */
    detach: function detach() {
      prevented = true;

      if (!detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = false;
        }

        detached = true;
      }

      return this;
    },

    /**
     * Attaches anchors click events inside glide.
     *
     * @return {self}
     */
    attach: function attach() {
      prevented = false;

      if (detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = true;
        }

        detached = false;
      }

      return this;
    }
  };
  define(Anchors, 'items', {
    /**
     * Gets collection of the arrows HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Anchors._a;
    }
  });
  /**
   * Detach anchors inside slides:
   * - on swiping, so they won't redirect to its `href` attributes
   */

  Events.on('swipe.move', function () {
    Anchors.detach();
  });
  /**
   * Attach anchors inside slides:
   * - after swiping and transitions ends, so they can redirect after click again
   */

  Events.on('swipe.end', function () {
    Components.Transition.after(function () {
      Anchors.attach();
    });
  });
  /**
   * Unbind anchors inside slides:
   * - on destroying, to bring anchors to its initial state
   */

  Events.on('destroy', function () {
    Anchors.attach();
    Anchors.unbind();
    Binder.destroy();
  });
  return Anchors;
}

var NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
var CONTROLS_SELECTOR = '[data-glide-el^="controls"]';
var PREVIOUS_CONTROLS_SELECTOR = "".concat(CONTROLS_SELECTOR, " [data-glide-dir*=\"<\"]");
var NEXT_CONTROLS_SELECTOR = "".concat(CONTROLS_SELECTOR, " [data-glide-dir*=\">\"]");
function Controls (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var capture = supportsPassive$1 ? {
    passive: true
  } : false;
  var Controls = {
    /**
     * Inits arrows. Binds events listeners
     * to the arrows HTML elements.
     *
     * @return {Void}
     */
    mount: function mount() {
      /**
       * Collection of navigation HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);
      /**
       * Collection of controls HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */

      this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);
      /**
       * Collection of arrow control HTML elements.
       *
       * @private
       * @type {Object}
       */

      this._arrowControls = {
        previous: Components.Html.root.querySelectorAll(PREVIOUS_CONTROLS_SELECTOR),
        next: Components.Html.root.querySelectorAll(NEXT_CONTROLS_SELECTOR)
      };
      this.addBindings();
    },

    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    setActive: function setActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.addClass(this._n[i].children);
      }
    },

    /**
     * Removes active class to current slide.
     *
     * @return {Void}
     */
    removeActive: function removeActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.removeClass(this._n[i].children);
      }
    },

    /**
     * Toggles active class on items inside navigation.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    addClass: function addClass(controls) {
      var settings = Glide.settings;
      var item = controls[Glide.index];

      if (!item) {
        return;
      }

      item.classList.add(settings.classes.nav.active);
      siblings(item).forEach(function (sibling) {
        sibling.classList.remove(settings.classes.nav.active);
      });
    },

    /**
     * Removes active class from active control.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    removeClass: function removeClass(controls) {
      var item = controls[Glide.index];
      item === null || item === void 0 ? void 0 : item.classList.remove(Glide.settings.classes.nav.active);
    },

    /**
     * Calculates, removes or adds `Glide.settings.classes.disabledArrow` class on the control arrows
     */
    setArrowState: function setArrowState() {
      if (Glide.settings.rewind) {
        return;
      }

      var next = Controls._arrowControls.next;
      var previous = Controls._arrowControls.previous;
      this.resetArrowState(next, previous);

      if (Glide.index === 0) {
        this.disableArrow(previous);
      }

      if (Glide.index === Components.Run.length) {
        this.disableArrow(next);
      }
    },

    /**
     * Removes `Glide.settings.classes.disabledArrow` from given NodeList elements
     *
     * @param {NodeList[]} lists
     */
    resetArrowState: function resetArrowState() {
      var settings = Glide.settings;

      for (var _len = arguments.length, lists = new Array(_len), _key = 0; _key < _len; _key++) {
        lists[_key] = arguments[_key];
      }

      lists.forEach(function (list) {
        toArray(list).forEach(function (element) {
          element.classList.remove(settings.classes.arrow.disabled);
        });
      });
    },

    /**
     * Adds `Glide.settings.classes.disabledArrow` to given NodeList elements
     *
     * @param {NodeList[]} lists
     */
    disableArrow: function disableArrow() {
      var settings = Glide.settings;

      for (var _len2 = arguments.length, lists = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        lists[_key2] = arguments[_key2];
      }

      lists.forEach(function (list) {
        toArray(list).forEach(function (element) {
          element.classList.add(settings.classes.arrow.disabled);
        });
      });
    },

    /**
     * Adds handles to the each group of controls.
     *
     * @return {Void}
     */
    addBindings: function addBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.bind(this._c[i].children);
      }
    },

    /**
     * Removes handles from the each group of controls.
     *
     * @return {Void}
     */
    removeBindings: function removeBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.unbind(this._c[i].children);
      }
    },

    /**
     * Binds events to arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    bind: function bind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.on('click', elements[i], this.click);
        Binder.on('touchstart', elements[i], this.click, capture);
      }
    },

    /**
     * Unbinds events binded to the arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    unbind: function unbind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.off(['click', 'touchstart'], elements[i]);
      }
    },

    /**
     * Handles `click` event on the arrows HTML elements.
     * Moves slider in direction given via the
     * `data-glide-dir` attribute.
     *
     * @param {Object} event
     * @return {void}
     */
    click: function click(event) {
      if (!supportsPassive$1 && event.type === 'touchstart') {
        event.preventDefault();
      }

      var direction = event.currentTarget.getAttribute('data-glide-dir');
      Components.Run.make(Components.Direction.resolve(direction));
    }
  };
  define(Controls, 'items', {
    /**
     * Gets collection of the controls HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Controls._c;
    }
  });
  /**
   * Swap active class of current navigation item:
   * - after mounting to set it to initial index
   * - after each move to the new index
   */

  Events.on(['mount.after', 'move.after'], function () {
    Controls.setActive();
  });
  /**
   * Add or remove disabled class of arrow elements
   */

  Events.on(['mount.after', 'run'], function () {
    Controls.setArrowState();
  });
  /**
   * Remove bindings and HTML Classes:
   * - on destroying, to bring markup to its initial state
   */

  Events.on('destroy', function () {
    Controls.removeBindings();
    Controls.removeActive();
    Binder.destroy();
  });
  return Controls;
}

function Keyboard (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Keyboard = {
    /**
     * Binds keyboard events on component mount.
     *
     * @return {Void}
     */
    mount: function mount() {
      if (Glide.settings.keyboard) {
        this.bind();
      }
    },

    /**
     * Adds keyboard press events.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('keyup', document, this.press);
    },

    /**
     * Removes keyboard press events.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('keyup', document);
    },

    /**
     * Handles keyboard's arrows press and moving glide foward and backward.
     *
     * @param  {Object} event
     * @return {Void}
     */
    press: function press(event) {
      var perSwipe = Glide.settings.perSwipe;
      var arrowSymbols = {
        ArrowRight: '>',
        ArrowLeft: '<'
      };

      if (['ArrowRight', 'ArrowLeft'].includes(event.code)) {
        Components.Run.make(Components.Direction.resolve("".concat(perSwipe).concat(arrowSymbols[event.code])));
      }
    }
  };
  /**
   * Remove bindings from keyboard:
   * - on destroying to remove added events
   * - on updating to remove events before remounting
   */

  Events.on(['destroy', 'update'], function () {
    Keyboard.unbind();
  });
  /**
   * Remount component
   * - on updating to reflect potential changes in settings
   */

  Events.on('update', function () {
    Keyboard.mount();
  });
  /**
   * Destroy binder:
   * - on destroying to remove listeners
   */

  Events.on('destroy', function () {
    Binder.destroy();
  });
  return Keyboard;
}

function Autoplay (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  var Autoplay = {
    /**
     * Initializes autoplaying and events.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.enable();
      this.start();

      if (Glide.settings.hoverpause) {
        this.bind();
      }
    },

    /**
     * Enables autoplaying
     *
     * @returns {Void}
     */
    enable: function enable() {
      this._e = true;
    },

    /**
     * Disables autoplaying.
     *
     * @returns {Void}
     */
    disable: function disable() {
      this._e = false;
    },

    /**
     * Starts autoplaying in configured interval.
     *
     * @param {Boolean|Number} force Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Void}
     */
    start: function start() {
      var _this = this;

      if (!this._e) {
        return;
      }

      this.enable();

      if (Glide.settings.autoplay) {
        if (isUndefined(this._i)) {
          this._i = setInterval(function () {
            _this.stop();

            Components.Run.make('>');

            _this.start();

            Events.emit('autoplay');
          }, this.time);
        }
      }
    },

    /**
     * Stops autorunning of the glide.
     *
     * @return {Void}
     */
    stop: function stop() {
      this._i = clearInterval(this._i);
    },

    /**
     * Stops autoplaying while mouse is over glide's area.
     *
     * @return {Void}
     */
    bind: function bind() {
      var _this2 = this;

      Binder.on('mouseover', Components.Html.root, function () {
        if (_this2._e) {
          _this2.stop();
        }
      });
      Binder.on('mouseout', Components.Html.root, function () {
        if (_this2._e) {
          _this2.start();
        }
      });
    },

    /**
     * Unbind mouseover events.
     *
     * @returns {Void}
     */
    unbind: function unbind() {
      Binder.off(['mouseover', 'mouseout'], Components.Html.root);
    }
  };
  define(Autoplay, 'time', {
    /**
     * Gets time period value for the autoplay interval. Prioritizes
     * times in `data-glide-autoplay` attrubutes over options.
     *
     * @return {Number}
     */
    get: function get() {
      var autoplay = Components.Html.slides[Glide.index].getAttribute('data-glide-autoplay');

      if (autoplay) {
        return toInt(autoplay);
      }

      return toInt(Glide.settings.autoplay);
    }
  });
  /**
   * Stop autoplaying and unbind events:
   * - on destroying, to clear defined interval
   * - on updating via API to reset interval that may changed
   */

  Events.on(['destroy', 'update'], function () {
    Autoplay.unbind();
  });
  /**
   * Stop autoplaying:
   * - before each run, to restart autoplaying
   * - on pausing via API
   * - on destroying, to clear defined interval
   * - while starting a swipe
   * - on updating via API to reset interval that may changed
   */

  Events.on(['run.before', 'swipe.start', 'update'], function () {
    Autoplay.stop();
  });
  Events.on(['pause', 'destroy'], function () {
    Autoplay.disable();
    Autoplay.stop();
  });
  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */

  Events.on(['run.after', 'swipe.end'], function () {
    Autoplay.start();
  });
  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */

  Events.on(['play'], function () {
    Autoplay.enable();
    Autoplay.start();
  });
  /**
   * Remount autoplaying:
   * - on updating via API to reset interval that may changed
   */

  Events.on('update', function () {
    Autoplay.mount();
  });
  /**
   * Destroy a binder:
   * - on destroying glide instance to clearup listeners
   */

  Events.on('destroy', function () {
    Binder.destroy();
  });
  return Autoplay;
}

/**
 * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
 *
 * @param {Object} points
 * @returns {Object}
 */

function sortBreakpoints(points) {
  if (isObject(points)) {
    return sortKeys(points);
  } else {
    warn("Breakpoints option must be an object");
  }

  return {};
}

function Breakpoints (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();
  /**
   * Holds reference to settings.
   *
   * @type {Object}
   */

  var settings = Glide.settings;
  /**
   * Holds reference to breakpoints object in settings. Sorts breakpoints
   * from smaller to larger. It is required in order to proper
   * matching currently active breakpoint settings.
   *
   * @type {Object}
   */

  var points = sortBreakpoints(settings.breakpoints);
  /**
   * Cache initial settings before overwritting.
   *
   * @type {Object}
   */

  var defaults = Object.assign({}, settings);
  var Breakpoints = {
    /**
     * Matches settings for currectly matching media breakpoint.
     *
     * @param {Object} points
     * @returns {Object}
     */
    match: function match(points) {
      if (typeof window.matchMedia !== 'undefined') {
        for (var point in points) {
          if (points.hasOwnProperty(point)) {
            if (window.matchMedia("(max-width: ".concat(point, "px)")).matches) {
              return points[point];
            }
          }
        }
      }

      return defaults;
    }
  };
  /**
   * Overwrite instance settings with currently matching breakpoint settings.
   * This happens right after component initialization.
   */

  Object.assign(settings, Breakpoints.match(points));
  /**
   * Update glide with settings of matched brekpoint:
   * - window resize to update slider
   */

  Binder.on('resize', window, throttle(function () {
    Glide.settings = mergeOptions(settings, Breakpoints.match(points));
  }, Glide.settings.throttle));
  /**
   * Resort and update default settings:
   * - on reinit via API, so breakpoint matching will be performed with options
   */

  Events.on('update', function () {
    points = sortBreakpoints(points);
    defaults = Object.assign({}, settings);
  });
  /**
   * Unbind resize listener:
   * - on destroying, to bring markup to its initial state
   */

  Events.on('destroy', function () {
    Binder.off('resize', window);
  });
  return Breakpoints;
}

var COMPONENTS = {
  // Required
  Html: Html,
  Translate: Translate,
  Transition: Transition,
  Direction: Direction,
  Peek: Peek,
  Sizes: Sizes,
  Gaps: Gaps,
  Move: Move,
  Clones: Clones,
  Resize: Resize,
  Build: Build,
  Run: Run,
  // Optional
  Swipe: Swipe,
  Images: Images,
  Anchors: Anchors,
  Controls: Controls,
  Keyboard: Keyboard,
  Autoplay: Autoplay,
  Breakpoints: Breakpoints
};

var Glide = /*#__PURE__*/function (_Core) {
  _inherits(Glide, _Core);

  var _super = _createSuper(Glide);

  function Glide() {
    _classCallCheck(this, Glide);

    return _super.apply(this, arguments);
  }

  _createClass(Glide, [{
    key: "mount",
    value: function mount() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _get(_getPrototypeOf(Glide.prototype), "mount", this).call(this, Object.assign({}, COMPONENTS, extensions));
    }
  }]);

  return Glide;
}(Glide$1);




/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkfictional_university_theme"] = globalThis["webpackChunkfictional_university_theme"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map