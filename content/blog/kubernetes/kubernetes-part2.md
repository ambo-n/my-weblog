---
title: K8s Series - Chapter 2 Creating a Deployment
description: This is the second blog of the many more chapters to come as I familiarise myself with Kubernetes
date: 2025-11-24
tags: kubernetes
---

In Chapter 1, I wrote a brief overview of the components found in a Kubernetes cluster and touched on the high-level workflow. In this post, I focus on how a **Deployment** is created and how it ultimately results in Pods being run on worker nodes.

## Installing minikube (Prereq.)

Assuming Docker has been installed.

```code

brew install minikube
minikube start

```

## Kubernetes Workflow

1. Submitting a definition manifest.

   A _definition manifest_ describes the Kubernetes object you want to create. It includes required fields such as <code>apiVersion</code>, <code>kind</code>,<code>spec</code> and <code>metadata</code>. Most users write manifests in YAML for readibility, but Kubernetes also accepts JSON.

   ```code
   #Example of a definition manifest for a Pod

   apiVersion: v1
   kind: Pod
   metadata:
     name: nginx
   spec:
     containers:
     - name: nginx
       image: nginx:1.14.2
       ports:
       - containerPort: 80
   ```

   The above manifest `simple-pod.yaml` can be submitted via the following commands:

   ```code
   kubectl apply -f simple-pod.yaml
   #or
   kubectl create -f simple-pod.yaml
   ```

   ::: info
   `kubectl create` → errors if the resource already exists

   `kubectl apply` → creates or updates the resource
   :::

::: info
A `Pod` is a smallest deployable unit in Kubernetes. Pods run on worker nodes and may contain one or more tightly coupled containers if required.
:::

Directly creating Pods is uncommon and mainly used for testing, debugging, or very simple workloads.

Most Pods are created indirectly through higher-level controllers. For example, when you create a Deployment, the Deployment controller creates a `ReplicaSet`, and the `ReplicaSet` creates the Pods based on the deployment's Pod template.

Other controllers can also create Pods, including StatefulSets, DaemonSets, Jobs, and CronJobs.

```code
# Example Deployment manifest (nginx-deployment.yaml)

apiVersion: apps/v1
kind: Deployment
metadata:
   name: nginx-deployment
   labels:
      app: nginx
spec:
   replicas: 3
   selector:
      matchLabels:
      app: nginx
   template:
      metadata:
      labels:
          app: nginx
      spec:
      containers:
      - name: nginx
          image: nginx:1.14.2
          ports:
          - containerPort: 80
```

::: info
Applying this manifest creates a Deployment named `nginx-deployment`.
The Deployment controller creates a ReplicaSet, and the ReplicaSet creates three identical Pods as specified in `replicas`.
Each Pod runs one container using the image `nginx:1.14.2`

:::

2. kubectl processing

   After the definition manifest is submitted, `kubectl` will:

   - Perform client-side validation (can be disable with `--validate=false`)
   - Determine the target namespace. If none is specified, the object will be created in the `default` namespace
   - Convert the YAML file into JSON since the API Server takes JSON as input
   - Send the request to the API Server (`kube-apiserver`)

3. API Server

   The request arrives at the API Server which will:

   - Validate the object against the API schema
   - Handle authentication and authorisation
   - Apply admission controllers
   - Writesthe validated object to `etcd`

   Only the API Server communicates with `etcd`. Controllers and nodes never interact with `etcd` directly.

4. Scheduler

   The `kube-scheduler` continously watches the API Server for any unscheduled Pods and assigns them to the appropriate node based on resource availability and scheduling constraints.

   Once the Pods are assigned to a Node, the Scheduler will update the Pod object in the API Server with the new node assignment.

5. Running the application

   Once the Pod is scheduled, the containers must be created and run on the target node.

   The `kubelet` which is situated on each Node will:

   - Watch the API Server for Pods assigns to its node
   - Translate each PodSpec into operations for the container runtime (via CRI)
   - Monitor Pod and container status
   - Execute liveness/readiness/startup probes
   - Report status back to the API Server

   Container runtime on each node will:

   - Receive the instructions from `kubelet`
   - Pull the image as needed
   - Manage container lifecycle (create, start, stop, restart)

- The kubelet does not create or start containers directly—it instructs the runtime to do so via CRI.

**_Note to self_**

- `kubelet` doesn't create the Pods
- Pods are created by controllers (ReplicaSet, StatefulSet, Job, etc.) through the API Server
- `kubelet` doesn't start containers directly; it delegates to the container runtime through CRI
- The scheduler is responsible for assigning Pods to nodes
