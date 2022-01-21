# scaffolder-backend-module-phoenix

This module for the Backstage scaffolder includes an action to create a new Phoenix project using the `mix phx_new` command.

## Usage

### Pre-requisites

The environment needs to have Docker installed, since the scaffolding of the Phoenix project is run inside an elixir-alpine Docker container.

### Configure the action in your Backstage backend

From your Backstage root directory:

```
cd packages/backend
yarn add git+https://github.com/fabuloso/scaffolder-backend-module-phoenix
```

Configure the action in `packages/backend/src/plugins/scaffolder.ts` file (you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
import { createPhoenixProjectAction } from 'scaffolder-backend-module-phoenix';

...

const actions = [
  ...,
  createPhoenixProjectAction(containerRunner)
];

return await createRouter({
  containerRunner,
  logger,
  config,
  database,
  catalogClient,
  reader,
  actions,
});
```

After that you can use the action `elixir:create-phoenix-project` as a step in your template:

```yaml
  steps:
    - id: create-project
      name: A new Phoenix App
      action: elixir:create-phoenix-project
      input:
        projectName: ${{parameters.name}}
        generatorOptions:
          baseModule: ${{parameters.baseModule}}
          dashboard: ${{parameters.dashboard}}
          database: ${{parameters.database}}
          ecto: ${{parameters.ecto}}
          gettext: ${{parameters.gettext}}
          html: ${{parameters.html}}
          live: ${{parameters.live}}
          mailer: ${{parameters.mailer}}
          umbrella: ${{parameters.umbrella}}
```

### Parameters

You can specify the following parameters for the `elixir:create-phoenix-project` action:

- `projectName`: name of the project
- `generatorOptions`: options passed to the Phoenix generator for the project scaffolding
  - `baseModule`: the name of the base module in the generated skeleton
  - `dashboard`: if false, do not include Phoenix.LiveDashboard
  - `database`: the database adapter for ecto
  - `ecto`: generate ecto files
  - `gettext`: if false, do not generate text files
  - `html`: generate HTML files
  - `live`: if false, comment out LiveView socket setup in assets/js/app.js and also on the endpoint (the latter also requires `dashboard` as false)
  - `mailer`: if false, do not generate any swoosh mailer file
  - `umbrella`: generate an umbrella project, with one application for your domain, and a second application for the web interface