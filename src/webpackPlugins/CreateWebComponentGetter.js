'use strict';
const __assign =
    (this && this.__assign) ||
    function() {
        __assign =
            Object.assign ||
            function(t) {
                for (let ss, ii = 1, nn = arguments.length; ii < nn; ii++) {
                    ss = arguments[ii];
                    for (const pp in ss) {
                        if (Object.prototype.hasOwnProperty.call(ss, pp)) {
                            t[pp] = ss[pp];
                        }
                    }
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createWebComponentGetter = void 0;
const fs1 = require('fs');
const createWebComponentGetter = /** @class */ (function () {
    function CreateWebComponentGetter(options) {
        this.options = __assign(
            {
                filename: 'meta.json',
                prepare: function (stats) {
                    return { hash: stats.hash };
                },
            },
            options,
        );
    }
    CreateWebComponentGetter.prototype.apply = function (compiler) {
        const _this = this;
        compiler.hooks.done.tap(this.constructor.name, function (stats) {
            const json = JSON.stringify(_this.options.prepare(stats));
            return new Promise(function (resolve, reject) {
                fs1.default.writeFile(_this.options.filename, json, 'utf8', function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    };
    return CreateWebComponentGetter;
})();
exports.createWebComponentGetter = createWebComponentGetter;
