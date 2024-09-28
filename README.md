# MiniGame Collection

[Demo Site](https://minigame.ilhwan.net/)

This project is a simple collection of mini-games, built purely with static HTML, JavaScript, and CSS. The games included are:

- 2048
- Maze Game
- Snake

## Running Locally

To run the project locally, you can use `http-server`. Follow these steps:

```bash
npx http-server ./public -c-1
```

## Running with Docker

The Docker setup uses nginx to serve the static files. You can build and run the Docker image as follows:

```bash
docker build -t minigame .
docker run -p 8080:80 minigame
```

## Kubernetes Deployment

Whenever new content is pushed to the `main` branch, the system will automatically build a new Docker image and roll it out to the Kubernetes cluster running the [demo site](https://gpt.ilhwan.net).
