#!/bin/bash

echo "---Wait, we are preparing .env file for execution---"
cp backend/.env.example backend/.env

echo "---Configuring enviroment---"
docker compose up --build -d