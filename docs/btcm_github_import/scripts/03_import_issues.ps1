param(
  [Parameter(Mandatory=$true)]
  [string]$Repo
)

$issues = Import-Csv ".\data\github_issues.csv"

foreach ($issue in $issues) {
  Write-Host "Creating issue: $($issue.title)"
  gh issue create `
    --repo $Repo `
    --title "$($issue.title)" `
    --body-file "$($issue.body_file)" `
    --label "$($issue.labels)" `
    --milestone "$($issue.milestone)"
}
