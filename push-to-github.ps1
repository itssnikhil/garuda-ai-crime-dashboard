# PowerShell script to push GARUDA-AI to GitHub
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  GARUDA-AI: Push Project to Your GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    Write-Host "[ERROR] Git was not found in your environment PATH." -ForegroundColor Red
    Write-Host "Please download Git from: https://git-scm.com/downloads" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$repoUrl = Read-Host "Enter your GitHub Repository URL (e.g., https://github.com/your-username/garuda-ai.git)"
if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "[ERROR] GitHub repository URL cannot be empty." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n[1/4] Initializing git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init -b main
} else {
    git branch -M main
}

Write-Host "`n[2/4] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "`n[3/4] Creating initial commit..." -ForegroundColor Yellow
git commit -m "feat: GARUDA-AI MP Police & Indore Commissionerate Crime Intelligence Dashboard"

Write-Host "`n[4/4] Pushing to $repoUrl..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl
git push -u origin main --force

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  SUCCESS: Code pushed to $repoUrl" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Read-Host "Press Enter to finish"
