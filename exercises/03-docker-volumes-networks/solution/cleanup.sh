#!/usr/bin/env bash
# Räumt Container, Netz und Volume der Übung wieder ab.
docker rm -f api db 2>/dev/null || true
docker network rm shop-net 2>/dev/null || true
docker volume rm shop-db 2>/dev/null || true
