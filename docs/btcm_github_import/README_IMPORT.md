# BattleTech Campaign Manager GitHub Import Package

This package contains CSV data, Markdown issue bodies, and PowerShell scripts to import the planned roadmap into GitHub Issues.

## Contents

- `data/labels.csv` — labels to create.
- `data/milestones.csv` — milestones to create.
- `data/github_issues.csv` — issue import list.
- `issue_bodies/epics/` — Markdown bodies for epic issues.
- `issue_bodies/tasks/` — Markdown bodies for child/task issues.
- `scripts/01_create_labels.ps1`
- `scripts/02_create_milestones.ps1`
- `scripts/03_import_issues.ps1`
- `scripts/04_list_recent_issues.ps1`

## Issue Count

- Total issues: 127
- Epics: 31
- Child/task issues: 96

## Recommended Use

Copy this entire folder into your repository root, then run the commands below from the root of that copied folder.

## Commands

Replace `OWNER/REPO` with your repository, for example:

```powershell
$REPO = "YourGitHubUsername/Battletech-Campaign-Manager"
```

Then run:

```powershell
.\scripts\01_create_labels.ps1 -Repo $REPO
.\scripts\02_create_milestones.ps1 -Repo $REPO
.\scripts\03_import_issues.ps1 -Repo $REPO
.\scripts\04_list_recent_issues.ps1 -Repo $REPO
```

## Important Notes

1. These scripts create repository issues. They do not automatically attach issues to your GitHub Project board.
2. After import, add the issues to your Project from GitHub's Project interface or by bulk selecting from the repo Issues tab.
3. Parent/child relationships are documented in each issue body. Attach child issues as sub-issues manually after import.
4. Run one test issue first if you want to verify labels/milestones/repo targeting.
5. If a label or milestone already exists, the script skips it.

## Suggested After-Import Cleanup

After all issues are imported:

1. Add all issues to the GitHub Project.
2. Bulk-edit Project fields based on labels/milestones.
3. Attach child task issues as sub-issues under epic issues.
4. Use milestone views to manage the roadmap.
5. Use labels to filter by area, phase, priority, and type.
