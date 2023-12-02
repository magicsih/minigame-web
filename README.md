# MINIGAME

## Deployments
### Build
- After pushing to github, github actions build docker with arm64 architecture and push to docker registry.

### Rollout
In k8s cluster
```kubectl set image deployment/minigame-web nginx=docker.ilhwan.net:5000/minigame-web:latest --namespace minigame```
```kubectl rollout status deployments/minigame-web --namespace minigame```