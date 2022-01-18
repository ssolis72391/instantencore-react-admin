#!/bin/bash

LAMBDA_FUNCTION_PREFIX=${LAMBDA_FUNCTION_PREFIX:-"ie-dpb-api-"}
LAMBDA_ALIAS=${LAMBDA_ALIAS:-"live"}

BASE_DIR=$(dirname "$0")
PROGNAME=$(basename "$0")

DIST_DIR=${DIST_DIR:-"${BASE_DIR}/../dist"}

# Updating Lambda functions

usage() {
  echo "usage: ${PROGNAME} <function>"
  exit 1
}

# used by terraform
zipLambda() {
  f=$1
  n=${f%.*}
  z=$2
  if [ "X" = "X$z" ]; then
    z="${LAMBDA_FUNCTION_PREFIX}$n.zip"
  else
    z=$2
  fi
  if [ "X$n" = "Xjwt_authenticate" ]; then
    echo "zipping up certs"
    if [ -r key.pem ]; then
      zip -r $z $f $f.map key.pem > /dev/null
    else
      echo "unable to upload $n, dist/key.pem is not readable" 1>&2
      exit 1
    fi
  elif [ "X$n" = "Xjwt_authorize" ]; then
    echo "zipping up certs"
    if [ -r cert.pem ]; then
      zip -r $z $f $f.map cert.pem > /dev/null
    else
      echo "unable to upload $n, dist/cert.pem is not readable" 1>&2
      exit 1
    fi
  else
    zip -r $z $f $f.map > /dev/null
  fi
}

updateLambda () {
  f=$1
  n=${f%.*}
  tmpfile="$(mktemp)"
  if [ $f = $n ]; then
    f="${f}.js"
  fi
  zipLambda $f ${tmpfile}.zip
  if [ $? -eq 0 ]; then
    aws lambda update-function-code --function-name ${LAMBDA_FUNCTION_PREFIX}${n} --zip-file fileb://${tmpfile}.zip > /dev/null
    if [ $? -eq 0 ]; then
      echo "Updated function $n"
    else
      echo "Could not update function $n: $!" >&2
    fi
    rm ${tmpfile}
    rm ${tmpfile}.zip
  else
    echo "Could not write zipfile of function $n to ${tmpfile}.zip: $!" >&2
  fi
}

updateAlias () {
  f=$1
  n=${f%.*}
  VERSION=$(aws lambda publish-version --function-name ${LAMBDA_FUNCTION_PREFIX}${n} | jq -r .Version)
  aws lambda update-alias --function-name ${LAMBDA_FUNCTION_PREFIX}${n} --name ${LAMBDA_ALIAS} --function-version $VERSION > /dev/null
}

lambda=$1
MYCWD=$(pwd)
cd ${DIST_DIR}

if [ "X${lambda}" = "X" ]; then
  for f in $(ls -1); do
    if [[ $f != *.js ]]; then
      continue
    fi
    zipLambda $f
  done
else
 updateLambda $lambda
 updateAlias $lambda
fi

cd ${MYCWD}
