#!/bin/bash
docker build -t learn-node-ts .
docker run -p 8000:8000 -d learn-node-ts