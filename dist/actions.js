"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewFileAction = void 0;
var plugin_scaffolder_backend_1 = require("@backstage/plugin-scaffolder-backend");
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = require("path");
var errors_1 = require("@backstage/errors");
function createNewFileAction(containerRunner) {
    return (0, plugin_scaffolder_backend_1.createTemplateAction)({
        id: 'elixir:create-phoenix-project',
        schema: {
            input: {
                required: ['projectName'],
                type: 'object',
                properties: {
                    projectName: {
                        type: 'string',
                        title: 'Project Name',
                        description: 'Project Name',
                    },
                    values: {
                        title: 'Template values',
                        description: 'Values to pass on to phoenix generator for scaffolding',
                        type: 'object',
                        properties: {
                            ecto: {
                                title: 'Ecto',
                                description: 'Generate ecto files',
                                type: 'boolean'
                            },
                            html: {
                                title: 'Html',
                                description: 'Generate html files',
                                type: 'boolean'
                            },
                            live: {
                                title: 'Live',
                                description: 'If false, comment out LiveView socket setup in assets/js/app.js and also on the endpoint (the latter also requires dashboard as false)',
                                type: 'boolean'
                            },
                            base_module: {
                                title: 'Base Module',
                                description: 'The name of the base module in the generated skeleton',
                                type: 'string'
                            },
                            umbrella: {
                                title: 'Umbrella',
                                description: 'Generate an umbrella project, with one application for your domain, and a second application for the web interface',
                                type: 'boolean'
                            },
                            database: {
                                title: 'Database',
                                description: 'The database adapter for ecto',
                                type: 'string'
                            },
                            gettext: {
                                title: 'GetText',
                                description: 'If false do not generate text files',
                                type: 'boolean'
                            },
                            mailer: {
                                title: 'Mailer',
                                description: 'If false do not generate any swoosh mailer file',
                                type: 'boolean'
                            },
                            dashboard: {
                                title: 'Dashboard',
                                description: 'If false do not include Phoenix.LiveDashboard',
                                type: 'boolean'
                            }
                        }
                    }
                },
            },
        },
        handler: function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createNewProject(ctx)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    });
    function createNewProject(ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, ecto, html, live, gettext, dashboard, mailer, database, umbrella, base_module, flags, workDir, resultDir, targetPath, outputPath;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = ctx.input.values, ecto = _b.ecto, html = _b.html, live = _b.live, gettext = _b.gettext, dashboard = _b.dashboard, mailer = _b.mailer, database = _b.database, umbrella = _b.umbrella, base_module = _b.base_module;
                        flags = ['--no-install'];
                        if (ecto === false) {
                            flags.push('--no-ecto');
                        }
                        if (html === false) {
                            flags.push('--no-html');
                        }
                        if (live === false) {
                            flags.push('--no-live');
                        }
                        if (gettext === false) {
                            flags.push('--no-gettext');
                        }
                        if (dashboard === false) {
                            flags.push('--no-dashboard');
                        }
                        if (mailer === false) {
                            flags.push('--no-mailer');
                        }
                        if (database != null) {
                            flags.push('--database');
                            flags.push(database);
                        }
                        if (base_module != null) {
                            flags.push('--base_module');
                            flags.push(base_module);
                        }
                        if (umbrella) {
                            flags.push('--no-umbrella');
                        }
                        return [4 /*yield*/, ctx.createTemporaryDirectory()];
                    case 1:
                        workDir = _d.sent();
                        resultDir = (0, path_1.resolve)(workDir, 'result');
                        ctx.logger.info("Running mix phx.new with flags ".concat(JSON.stringify(flags)));
                        return [4 /*yield*/, containerRunner.runContainer({
                                imageName: 'adalfovo/elixir-phoenix',
                                command: 'mix',
                                args: __spreadArray(__spreadArray(['phx.new'], flags, true), [(0, path_1.join)('/result', ctx.input.projectName)], false),
                                mountDirs: (_c = {}, _c[resultDir] = '/result', _c),
                                logStream: ctx.logStream,
                            })];
                    case 2:
                        _d.sent();
                        targetPath = (_a = ctx.input.targetPath) !== null && _a !== void 0 ? _a : './';
                        outputPath = (0, path_1.resolve)(ctx.workspacePath, targetPath);
                        if (!outputPath.startsWith(ctx.workspacePath)) {
                            throw new errors_1.InputError("Fetch action targetPath may not specify a path outside the working directory");
                        }
                        return [4 /*yield*/, fs_extra_1.default.copy((0, path_1.join)(resultDir, ctx.input.projectName), outputPath)];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
}
exports.createNewFileAction = createNewFileAction;
;
