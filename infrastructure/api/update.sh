export AWS_PROFILE=switchcase
workspace=${1:?arg 1 missing: please specify workspace}
tf="terraform14"
plan="tf.plan"
eval "${tf} workspace select ${workspace}" || exit 1
eval "${tf} init" || exit 1
eval "${tf} plan -var-file=${workspace}.tfvars -out ${plan}" || exit 1
eval "${tf} apply -auto-approve ${plan}" || exit 1
eval "rm ${plan}" || exit 1