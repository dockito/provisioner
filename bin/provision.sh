#!/bin/bash
set -e

APP_NAME=$1
COMPOSE_FILE=$2
SERVICES_DIRECTORY=`mktemp -d /tmp/dockito-deployer-${APP_NAME}.XXXXXX` || exit 1

echo "Generating service files"
compose2bash -app=$APP_NAME \
             -yml=$COMPOSE_FILE \
             -output=$SERVICES_DIRECTORY

cp -r $SERVICES_DIRECTORY/* /usr/src/app/output
