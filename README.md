# Bold Runner

Small side scrolling shoot'em up game, inspired by Blade Runner.

Built in compo mode, everything is hand-crafted.

# Demo

[Here is an online demo, be patient, it downloads the whole internet ⏰](https://nidup.github.io/bold-runner/)

<p align="center">
<img src="https://github.com/nidup/bold-runner/blob/master/assets/doc/screenshot.png" alt="Bold Runner"/>
</p>

# Getting Started to Dev

## Run the dev image

Run to mount local project code inside the container and bind ports
```
docker run --name phaser --rm -v "$PWD":/usr/src/app -p 8080:8080 -d nidup/phaser:latest
```

Your container should appears in the list when typing,
```
docker ps
```

## Install / update project dependencies

```
docker exec -it phaser npm install
```

## Running the project in dev mode:

Launch webpack server in watch mode,
```
docker exec -it phaser npm run dev
```

You can access your project in your browser,
```
http://localhost:8080/
```

# Deploy the demo

## Build the bundle.js

```
docker exec -it phaser npm run build
```

## Commit then push the bundle.js

```
git add build/bundle.js
git commit
git push
```

# Licenses

MIT for the code of this repository (src folder).

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) for the artwork (assets folder).
