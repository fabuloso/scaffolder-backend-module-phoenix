import { createTemplateAction, runCommand } from '@backstage/plugin-scaffolder-backend';
import fs from 'fs-extra';
import { resolve as resolvePath, join } from 'path';
import { InputError } from '@backstage/errors';

export const createNewFileAction = () => {
    return createTemplateAction<{ projectName: string }>({
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
                },
            },
        },
        async handler(ctx) {
            await createNewProject(ctx);
        },
    });

    async function createNewProject(ctx: any) {
        const workDir = await ctx.createTemporaryDirectory();
        const resultDir = resolvePath(workDir, 'result');

        await runCommand({
            command: 'mix',
            args: ['phx.new', '--no-install', join(resultDir, ctx.input.projectName)],
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
