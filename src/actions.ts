import { createTemplateAction, runCommand } from '@backstage/plugin-scaffolder-backend';
import { ContainerRunner } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import fs from 'fs-extra';
import { resolve as resolvePath, join } from 'path';
import { InputError } from '@backstage/errors';

export function createNewFileAction(containerRunner: ContainerRunner) {
    return createTemplateAction<{ projectName: string, values: JsonObject }>({
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
        async handler(ctx) {
            await createNewProject(ctx);
        },
    });

    async function createNewProject(ctx: any) {
        const {ecto, html, live, gettext, dashboard, mailer, database, umbrella, base_module} = ctx.input.values;

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
            flags.push('--database')
            flags.push(database)
        }

        if (base_module != null) {
            flags.push('--base_module')
            flags.push(base_module)
        }

        if (umbrella) {
            flags.push('--no-umbrella');
        }

        const workDir = await ctx.createTemporaryDirectory();
        const resultDir = resolvePath(workDir, 'result');
        fs.ensureDir(resultDir);

        ctx.logger.info(`Running mix phx.new with flags ${JSON.stringify(flags)}`);
        await containerRunner.runContainer({
            imageName: 'public.ecr.aws/prima/elixir:1.13.0-1',
            command: 'bash',
            args: [
                '-c',
                `mix local.hex --force &&
                 mix archive.install hex phx_new --force &&
                 mix phx.new ${flags.join(' ')} ${join('/result', ctx.input.projectName)}`
            ],
            mountDirs: { [resultDir]: '/result' },
            workingDir: '/tmp',
            logStream: ctx.logStream,
        });

        const targetPath = ctx.input.targetPath ?? './';
        const outputPath = resolvePath(ctx.workspacePath, targetPath);
        if (!outputPath.startsWith(ctx.workspacePath)) {
            throw new InputError(
                `Fetch action targetPath may not specify a path outside the working directory`,
            );
        }
        await fs.copy(join(resultDir, ctx.input.projectName), outputPath);
    }
};
