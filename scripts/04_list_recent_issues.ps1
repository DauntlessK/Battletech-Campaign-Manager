param(
  [Parameter(Mandatory=$true)]
  [string]$Repo
)

Write-Host "Recent issues:"
gh issue list --repo $Repo --state open --limit 150
