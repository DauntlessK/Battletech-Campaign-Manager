param(
  [Parameter(Mandatory=$true)]
  [string]$Repo
)

$milestones = Import-Csv ".\data\milestones.csv"

foreach ($m in $milestones) {
  Write-Host "Creating milestone: $($m.title)"
  gh api "repos/$Repo/milestones" -f "title=$($m.title)" 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Milestone may already exist, skipping: $($m.title)"
  }
}
