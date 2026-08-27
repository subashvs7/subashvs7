<#
  setup-repos.ps1
  ---------------
  Fills in the description + topics for every public repo, which is what
  actually makes the "Repositories" tab look designed. GitHub gives you no
  CSS control over that tab - description, topics, language bar and the
  pinned set are the only levers, so this script pulls all of them.

  NOTE: this file is deliberately ASCII-only. Windows PowerShell 5.1 reads
  BOM-less files as cp1252, where the third byte of a UTF-8 em-dash decodes
  to a smart quote and silently terminates string literals. Keep it ASCII.

  Requires the GitHub CLI:
      winget install --id GitHub.cli
      gh auth login          # needs the "repo" scope

  Dry run first:
      .\scripts\setup-repos.ps1 -WhatIf

  Then apply:
      .\scripts\setup-repos.ps1

  -- EDIT ME ---------------------------------------------------------
  The descriptions below are best-effort guesses inferred from repo names
  and primary language. Read through and correct them BEFORE running - a
  wrong description is worse than none.
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$Owner = "subashvs7"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI not found. Install with: winget install --id GitHub.cli"
}

# name = @{ desc = "..."; topics = @("...") }
$Repos = @{
    "CRM-ZAZU" = @{
        desc   = "Laravel CRM with lead pipeline, contact history and follow-up scheduling, backed by MySQL."
        topics = @("laravel", "php", "crm", "mysql", "blade", "sales-pipeline")
    }
    "task-ci" = @{
        desc   = "Task tracker wired to a CI pipeline: Laravel API with automated checks on every push."
        topics = @("laravel", "php", "ci-cd", "github-actions", "task-management")
    }
    "db-compare" = @{
        desc   = "Schema diff utility that compares two MySQL databases and reports structural drift."
        topics = @("mysql", "database", "schema-diff", "devtools", "migration")
    }
    "approval_project" = @{
        desc   = "Multi-level approval workflow engine on Laravel with configurable stages and role-based sign-off."
        topics = @("laravel", "php", "workflow", "approval-workflow", "rbac", "mysql")
    }
    "spicemart" = @{
        desc   = "E-commerce storefront with catalogue, cart and checkout, plus an admin side for inventory and orders."
        topics = @("laravel", "php", "ecommerce", "blade", "mysql", "shopping-cart")
    }
    "task-management" = @{
        desc   = "Board-based task tracker in TypeScript: assignments, status transitions and filtering, fully typed end to end."
        topics = @("typescript", "react", "task-management", "kanban", "frontend")
    }
    "myeonfashions" = @{
        desc   = "Fashion storefront front-end with product grid, detail views and a responsive catalogue layout."
        topics = @("javascript", "ecommerce", "frontend", "responsive-design", "storefront")
    }
    "pmk" = @{
        desc   = "Pasumai Murpokku Kalagam organisation website with member and event pages."
        topics = @("website", "php", "community", "cms")
    }
    "e-com" = @{
        desc   = "Laravel e-commerce build covering product catalogue, cart flow and order management in Blade."
        topics = @("laravel", "blade", "ecommerce", "php", "mysql")
    }
    "laravel-dashboard" = @{
        desc   = "Reusable Laravel admin panel with charts, sortable data tables and role-based access control."
        topics = @("laravel", "blade", "dashboard", "admin-panel", "charts", "rbac")
    }
    "budgetapp" = @{
        desc   = "Personal finance tracker on Laravel with category budgets, transaction history and monthly rollups."
        topics = @("laravel", "blade", "mysql", "personal-finance", "budgeting")
    }
    "projects" = @{
        desc   = "Collection of small web development builds in HTML, CSS and vanilla JavaScript."
        topics = @("javascript", "html", "css", "web-development", "practice-projects")
    }
    "practice" = @{
        desc   = "Scratchpad for JavaScript exercises and language drills."
        topics = @("javascript", "practice", "algorithms", "learning")
    }
    "react-reddit" = @{
        desc   = "Reddit client on the public API with live subreddit feeds, search and client-side filtering via hooks."
        topics = @("react", "javascript", "reddit-api", "rest-api", "hooks")
    }
}

$done = 0
foreach ($name in ($Repos.Keys | Sort-Object)) {
    $repo   = "$Owner/$name"
    $desc   = $Repos[$name].desc
    $topics = $Repos[$name].topics -join ","

    if ($PSCmdlet.ShouldProcess($repo, "set description and topics")) {
        try {
            gh repo edit $repo --description $desc
            if ($LASTEXITCODE -ne 0) { throw "description update failed" }

            gh repo edit $repo --add-topic $topics
            if ($LASTEXITCODE -ne 0) { throw "topic update failed" }

            Write-Host "  ok    $repo" -ForegroundColor Green
            $done++
        }
        catch {
            Write-Host "  FAIL  $repo - $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  would set $repo" -ForegroundColor DarkGray
        Write-Host "      desc   : $desc"
        Write-Host "      topics : $topics"
    }
}

Write-Host ""
Write-Host "Updated $done repositories." -ForegroundColor Cyan
Write-Host "Next: pin your six best at https://github.com/$Owner (Overview -> Customize your pins)."
