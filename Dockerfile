FROM ubuntu:22.04

RUN useradd -d /home/kks -m -s /bin/bash kks

ENV APP_ROOT /home/kks/sveltekit-supabase-webmedia

WORKDIR $APP_ROOT

RUN apt update && \
    apt upgrade -y && \
    apt install -y npm \
                   curl && \
    npm install -g n && \
    n 18.13.0 && \
    apt purge -y npm nodejs
