#!/usr/bin/env bash

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

if [ -n "$(git status --porcelain)" ]; then
  echo -e "${red}ERROR:${reset} Unable to build because git state not clean. Commit or stash your changes.";
else
  rm -rf ./dist;
  echo -e "${green}Kicking off webpack build${reset}";
  ./node_modules/.bin/webpack --optimize-minimize --optimize-dedupe;
  git rev-parse --short HEAD > ./dist/VERSION.txt;
fi
