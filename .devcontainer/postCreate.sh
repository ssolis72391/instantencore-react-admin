if [ "$CODESPACES" = "true" ]; then

  if [ -n "${AWS_ACCESS_KEY_ID__SWITCHCASE+1}" ] && [ -n "${AWS_SECRET_ACCESS_KEY__SWITCHCASE+1}" ]; then
    aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID__SWITCHCASE}" --profile switchcase
    aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY__SWITCHCASE}" --profile switchcase
    # expect the user to set role_arn manually
    aws configure set role_arn "arn:aws:iam::MY_SANDBOX_ACCOUNT_ID:role/OrganizationAccountAccessRole" --profile sandbox
    aws configure set source_profile switchcase --profile sandbox
  else
    echo "env var AWS_ACCESS_KEY_ID__SWITCHCASE or AWS_SECRET_ACCESS_KEY__SWITCHCASE not set skipping aws configure"
  fi

  # codespaces uses a short lived token for authentication instead of the long lived ssh key
  # terraform repos and other scripts expect ssh and therefore in this environment forcing https to use token
  git config --global url."https://github.com/".insteadOf git@github.com:
  git config --global url."https://".insteadOf git://
  git config --global --add url."https://".insteadOf ssh://

fi