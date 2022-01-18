[CmdletBinding()]
param (
    [Parameter(Mandatory)]
    [string]
    $LambdaName
)

yarn build-one-dev $LambdaName