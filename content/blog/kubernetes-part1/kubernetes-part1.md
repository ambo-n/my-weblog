---
const title = K8s Series - Chapter 1 Introduction to Kubernetes
const description= This is the first blog of the many more chapters to come as I familiarise myself with Kubernetes
const date= 2025-10-29
const tags= kubernetes, programming
const draft = true;
---

In the world where the microservice architecture is heavily adopted in building applications, Kubernetes is a wonderful out-of-the box tool that assists the management of these containerised applications.

Kubernetes, known by some by a friendlier nickname k8s (Kates), is a container orchestrator. It makes sure that:

- Containerised applications run where and when you want them to
- The available resources are allocated effectively
- Minimise system downtime

K8s comes with features that allow it to manage the running of containerised applications effectively. Namely:

1. **Automated rollouts and rollbacks**:

   This feature allows incrementally rollout of new changes to the running application while monitoring the health of the overall system at the same time. If something goes wrong, K8s can automatically roll back the changes. This feature comes with <code>Deployment</code> object.

2. **Self-healing**:

   Kubernetes is able to track of the state of each node. It automatically restarts containers that crash or replaces any failed pods/nodes.

3. **Horizontal scaling**:

   Kubernetes offers the ability to easily scale the applications based on available resources such as CPU or custom metrics ultilisation

- **Storage orchestration**
- **Service discovery and load balancing**
- **Secret and configuration management**
- **Batch execution**
- **IPv4/IPv6 dual-stack**

## My K8s Dictionary

I have decided to maintain this section as a separate post, which can be found here - <a href="/blog/k8s-dict.md">My K8s Dictionary</a>

## K8s Architecture

### Control Plane Node

Components
HA

### Worker Node

Components

## So what does the workflow look like, roughly?

## Conclusion

Next: Now that we modularise everything, how do we get them to talk to each?
