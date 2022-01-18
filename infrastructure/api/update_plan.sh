#!/bin/bash

workspace=${1:?arg 1 missing: please specify workspace}
tf="terraform14"
eval "${tf} workspace select ${workspace}" || exit 1
eval "${tf} init" || exit 1
eval "${tf} plan -var-file=${workspace}.tfvars" || exit 1
