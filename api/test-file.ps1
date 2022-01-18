[CmdletBinding()]
param (
    [Parameter(Mandatory)]
    [string]
    $TestFiloPath,
    [Parameter(Mandatory)]
    [switch]
    $Watch
)
if ($Watch.IsPresent) {
    yarn test-file $TestFiloPath --watch
}
else {
    yarn test-file $TestFiloPath 
}