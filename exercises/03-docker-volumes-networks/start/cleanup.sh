#!/usr/bin/env bash
# Removes the containers, network and volume of the exercise.
docker rm -f api db 2>/dev/null || true
docker network rm shop-net 2>/dev/null || true
docker volume rm shop-db 2>/dev/null || true
