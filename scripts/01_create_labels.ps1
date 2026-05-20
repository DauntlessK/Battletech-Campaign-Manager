param(
  [Parameter(Mandatory=$true)]
  [string]$Repo
)

$labels = Import-Csv ".\data\labels.csv"

foreach ($label in $labels) {
  Write-Host "Creating label: $($label.name)"
  gh label create "$($label.name)" --repo $Repo --color "$($label.color)" 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Label may already exist, skipping: $($label.name)"
  }
}
