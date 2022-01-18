#!/bin/bash

# function to run terraform commands for a given tf project
# usage: "terraform_for_proj tf_dirname workspace_name [tfvar_file]"
function terraform_for_proj {
  _TERRAFORM="${TERRAFORM:-terraform14}"
  _TF_ACTION="${TF_ACTION:-apply}"
  TF_DIRNAME=$1
  WORKSPACE_NAME=$2
  VAR_FILE=$3

  VAR_FILE_OPTION=
  if [ -n "${VAR_FILE}" ]; then
    VAR_FILE_OPTION="-var-file=\"${VAR_FILE}\""
  fi

  (
   echo switching to "${TF_DIRNAME}/"
   cd "${TF_DIRNAME}/" || \
	   ( echo "failed to cd" && return 1 )
   eval "${_TERRAFORM} init" || \
	   ( echo "failed to init" && return 1 )
   # escaping 'select' and 'new' because it is a special word and helps keep IDE clean
   eval "${_TERRAFORM} workspace 'new' ${WORKSPACE_NAME}" || \
	   ( echo "failed to workspace new... continuing..." )
   eval "${_TERRAFORM} workspace 'select' ${WORKSPACE_NAME}" || \
	   ( echo "failed to workspace select" && return 1 )
   eval "${_TERRAFORM} init" || \
	   ( echo "failed to init" && return 1 )
   if [[ "${_TF_ACTION}" =~ ^(apply|plan|validate|destroy)$ ]]; then
    # using eval so options string expands without extra quotes
    eval "${_TERRAFORM} ${_TF_ACTION} -auto-approve ${VAR_FILE_OPTION}" || \
            ( echo "failed to apply" && return 1 )
   else
    echo "skipping tf action"
   fi
  )
}


# following a convention to copy a tfvar from local directory to the tf project directory
# usage: "copy_tfvars_for_any tf_dirname workspace_name"
# expects to find ./workspace_name.tfvars that has any variables needed across all projects
function copy_tfvars_for_any {
  TF_DIRNAME=$1
  WORKSPACE_NAME=$2

  SECRET_FILE="./${WORKSPACE_NAME}.tfvars"
  if [ -f "$SECRET_FILE" ]; then
    cp "${SECRET_FILE}" "${TF_DIRNAME}/${WORKSPACE_NAME}.tfvars"
  else
    echo "${SECRET_FILE} does not exist."
    exit 1
  fi
}

function infrastructure_up {
  WORKSPACE_NAME=$1

  terraform_for_proj "network" "${WORKSPACE_NAME}" || exit 1
  terraform_for_proj "cdn" "${WORKSPACE_NAME}" || exit 1
  terraform_for_proj "database" "${WORKSPACE_NAME}" "${WORKSPACE_NAME}.tfvars" || exit 1
  terraform_for_proj "api" "${WORKSPACE_NAME}" "${WORKSPACE_NAME}.tfvars" || exit 1

}

function infrastructure_down {
  WORKSPACE_NAME=$1

  TF_ACTION=destroy terraform_for_proj "api" "${WORKSPACE_NAME}" "${WORKSPACE_NAME}.tfvars" || exit 1
  TF_ACTION=destroy terraform_for_proj "database" "${WORKSPACE_NAME}" "${WORKSPACE_NAME}.tfvars" || exit 1
}

######
# MAIN
######
export AWS_PROFILE=switchcase
ARG_WORKSPACE=${1:?arg 1 missing: please specify workspace}
ARG_ACTION=${2:?arg 2 missing: please specify action "up" or "down"}

WORKSPACE_NAME="${ARG_WORKSPACE}"

# prepare and validate
copy_tfvars_for_any "database" "${WORKSPACE_NAME}" || exit 1
copy_tfvars_for_any "api" "${WORKSPACE_NAME}" || exit 1

if [ $ARG_ACTION = "down" ]; then
  echo "downing infrastucture"
  infrastructure_down "${WORKSPACE_NAME}"
elif [ $ARG_ACTION = "up" ]; then
  echo "updating infrastucture"
  infrastructure_up "${WORKSPACE_NAME}"
else
  echo "arg action did not match a known value"
fi

