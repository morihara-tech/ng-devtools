FROM node:20-bookworm-slim

RUN apt-get update && \
  apt-get install git vim curl unzip python3 -y && \
  npm install -g @angular/cli@19.1.2 && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install
