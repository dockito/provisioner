#!/bin/bash

APP_NAME=$1
FIG_FILE=$2
SERVICES_DIRECTORY=`mktemp -d /tmp/dockito-deployer-${APP_NAME}.XXXXXX` || exit 1

echo "Generating service files"

fig2coreos $APP_NAME $FIG_FILE $SERVICES_DIRECTORY
fleetctl destroy $(fleetctl list-units -fields=unit -no-legend | grep ^$APP_NAME)
fleetctl start $SERVICES_DIRECTORY/*
