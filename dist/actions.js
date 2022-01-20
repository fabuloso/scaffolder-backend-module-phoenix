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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewFileAction = void 0;
const plugin_scaffolder_backend_1 = require("@backstage/plugin-scaffolder-backend");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const errors_1 = require("@backstage/errors");
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
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                yield createNewProject(ctx);
            });
        },
    });
    function createNewProject(ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { ecto, html, live, gettext, dashboard, mailer, database, umbrella, base_module } = ctx.input.values;
            let flags = ['--no-install'];
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
            const workDir = yield ctx.createTemporaryDirectory();
            const resultDir = (0, path_1.resolve)(workDir, 'result');
            fs_extra_1.default.ensureDir(resultDir);
            ctx.logger.info(`Running mix phx.new with flags ${JSON.stringify(flags)}`);
            yield containerRunner.runContainer({
                imageName: 'public.ecr.aws/prima/elixir:1.13.0-1',
                command: 'bash',
                args: [
                    '-c',
                    `mix local.hex --force &&
                 mix archive.install hex phx_new --force &&
                 mix phx.new ${flags.join(' ')} ${(0, path_1.join)('/result', ctx.input.projectName)}`
                ],
                mountDirs: { [resultDir]: '/result' },
                envVars: { HOME: '/tmp' },
                logStream: ctx.logStream,
            });
            const targetPath = (_a = ctx.input.targetPath) !== null && _a !== void 0 ? _a : './';
            const outputPath = (0, path_1.resolve)(ctx.workspacePath, targetPath);
            if (!outputPath.startsWith(ctx.workspacePath)) {
                throw new errors_1.InputError(`Fetch action targetPath may not specify a path outside the working directory`);
            }
            yield fs_extra_1.default.copy((0, path_1.join)(resultDir, ctx.input.projectName), outputPath);
        });
    }
}
exports.createNewFileAction = createNewFileAction;
;
