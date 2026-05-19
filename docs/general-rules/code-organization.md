# Code Organization and Structure

## Directory Structure
- Organize by feature or domain instead of technical layers
- Keep related files close together

### Structure example
```text
.
├── node_modules
├── package-lock.json
├── package.json
├── uu_app_aidemog01-hi
│   ├── env
│   ├── eslint.config.js
│   ├── jsconfig.json
│   ├── mock
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── target
├── uu_app_aidemog01-server
    ├── LICENSE
    ├── app
    │   ├── abl
    │   ├── api
    │   ├── config
    │   └── dao
    ├── app.js
    ├── env
    │   ├── asid-descriptor-m-default.json
    │   ├── development.json
    │   ├── test.json
    │   ├── uucloud-development.json
    │   └── uucloudg02-development.json
    ├── eslint.config.js
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── target
    └── test
        ├── app-aidemo
        ├── insomnia
        └── package.json
└── uuapp.json
```

## Module Organization
- Group related code into modules or components
- Export only what is necessary (interface segregation)
- Implement clear boundaries between modules

## Component Design
- Keep components focused on a single responsibility
- Separate display logic from business logic
- Limit component nesting to 3-4 levels when possible

## State Management
- Centralize application state management
- Minimize component state for UI-only concerns
- Document state shape and management patterns