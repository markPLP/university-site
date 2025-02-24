/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

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
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

// wp add to browswer global scope
// inside the object has blocks etc
// inside object there is registerBlockType()

// 1st argument is the name or variable of the block
// 2nd argument is a config object that has a bunch of properties
wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
  // properties here is precise or exact property names that wordpress know to look for
  title: 'Are you paying attention?',
  icon: 'admin-comments',
  category: 'layout',
  attributes: {
    skyColor: {
      type: 'string'
    },
    grassColor: {
      type: 'string'
    }
  },
  // edit function control what you see in the admin post editor screen
  edit: function (props) {
    //createElement wordpress method
    function updateSkyColor(event) {
      props.setAttributes({
        skyColor: event.target.value
      });
    }
    function updateGrassColor(event) {
      props.setAttributes({
        grassColor: event.target.value
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
        type: "text",
        placeholder: "sky color",
        onChange: updateSkyColor,
        value: props.attributes.skyColor
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
        type: "text",
        placeholder: "grass color",
        onChange: updateGrassColor,
        value: props.attributes.grassColor
      })]
    });
  },
  // save function control what actual public will see in your content / frontend
  save: function (props) {
    //return wp.element.createElement('h1', null, 'this is the front end');
    // OMMENTED OUT DEPRECATED - use dynamic block instead
    // return (
    //   <h6>
    //     Today the sky is GGGGG {props.attributes.skyColor} and the grass is{' '}
    //     {props.attributes.grassColor}
    //   </h6>
    // return null to dynamically output content via PHP and the database
    return null;
  }
  // OMMENTED OUT DEPRECATED - use dynamic block insteadC
  // deprecated: [
  //   {
  //     attributes: {
  //       skyColor: { type: 'string' },
  //       grassColor: { type: 'string' },
  //     },
  //     save: function (props) {
  //       //return wp.element.createElement('h1', null, 'this is the front end');
  //       return (
  //         <h3>
  //           Today the sky is xxxx {props.attributes.skyColor} and the grass is{' '}
  //           {props.attributes.grassColor}
  //         </h3>
  //       );
  //     },
  //   },
  //   {
  //     attributes: {
  //       skyColor: { type: 'string' },
  //       grassColor: { type: 'string' },
  //     },
  //     save: function (props) {
  //       return (
  //         <p>
  //           Today the sky is {props.attributes.skyColor} and the grass is{' '}
  //           {props.attributes.grassColor}
  //         </p>
  //       );
  //     },
  //   },
  // ],
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map