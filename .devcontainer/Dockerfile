# [Choice] Node.js version: 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT=16-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# from https://github.com/microsoft/vscode-dev-containers/blob/ed5ba90/script-library/docs/github.md
COPY library-scripts/github-debian.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/github-debian.sh

# from https://github.com/microsoft/vscode-dev-containers/blob/ed5ba90/script-library/docs/github.md
COPY library-scripts/terraform-debian.sh /tmp/library-scripts/terraform-debian.sh
RUN bash /tmp/library-scripts/terraform-debian.sh    "0.12.31" "none" "none" && mv -f /usr/local/bin/terraform /usr/local/bin/terraform12 \
    && bash /tmp/library-scripts/terraform-debian.sh "0.13.7"  "none" "none" && mv -f /usr/local/bin/terraform /usr/local/bin/terraform13 \
    && bash /tmp/library-scripts/terraform-debian.sh "0.14.11" "none" "none" && mv -f /usr/local/bin/terraform /usr/local/bin/terraform14 \
    && bash /tmp/library-scripts/terraform-debian.sh "0.15.5"  "none" "none" && mv -f /usr/local/bin/terraform /usr/local/bin/terraform15 \
    && bash /tmp/library-scripts/terraform-debian.sh "1.0.5"   "none" "none" && mv -f /usr/local/bin/terraform /usr/local/bin/terraform1_0

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends openjdk-11-jre graphviz locales \
    && apt-get -y install --no-install-recommends awscli \
    && echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen en_US.UTF-8
