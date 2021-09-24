# gulls-health-and-safety-api

Gulls health and safety back-end application

## Installing

```sh
npm install
```

## Running

Run this script to configure vscode for debugging.

```sh
mkdir -p .vscode
cat > .vscode/tasks.json << EOTASKS
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "build",
      "group": "build",
      "problemMatcher": [],
      "label": "npm: build",
      "detail": "npm run build"
    }
  ]
}
EOTASKS
cat > .vscode/launch.json << EOLAUNCH
{
  "version": "0.2.0",
  "configurations": [
    {
      "preLaunchTask": "npm: build",
      "command": "npm run start",
      "name": "Server for debugging",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
EOLAUNCH
```

Then hit F5 to build and launch the micro-app in debug mode.

## License

Unless stated otherwise, the codebase is released under the
[MIT License](LICENSE.txt). The documentation is available under the
terms of the [Open Government Licence, Version 3](LICENSE-OGL.md).
