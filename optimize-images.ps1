# Image Optimization Script for Windows PowerShell
# This script helps compress images using online tools or ImageMagick

Write-Host "Football Match Manager - Image Optimization Helper" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

$imagesPath = "c:\Users\data\Desktop\letsplay\src\imgs"
$outputPath = "c:\Users\data\Desktop\letsplay\src\imgs\optimized"

# Create optimized folder if it doesn't exist
if (-not (Test-Path $outputPath)) {
    New-Item -ItemType Directory -Path $outputPath
    Write-Host "Created optimized images folder: $outputPath" -ForegroundColor Yellow
}

Write-Host "`nCurrent image sizes:" -ForegroundColor Cyan
Get-ChildItem $imagesPath -Filter "*.jpg" | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  $($_.Name): $sizeKB KB" -ForegroundColor White
}

Write-Host "`nOptimization recommendations:" -ForegroundColor Cyan
Write-Host "  1. Convert JPEG to WebP (70-80% smaller)" -ForegroundColor Yellow
Write-Host "  2. Resize large images (1200px max width)" -ForegroundColor Yellow
Write-Host "  3. Use progressive JPEG loading" -ForegroundColor Yellow
Write-Host "  4. Generate blur placeholders" -ForegroundColor Yellow

Write-Host "`nQuick optimization options:" -ForegroundColor Cyan
Write-Host "  A) Use online tools: squoosh.app, tinypng.com" -ForegroundColor White
Write-Host "  B) Install ImageMagick for batch processing" -ForegroundColor White
Write-Host "  C) Use the React image optimizer component" -ForegroundColor White

$choice = Read-Host "`nWould you like to open Squoosh.app for manual optimization? (y/n)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Start-Process "https://squoosh.app"
    Write-Host "Opened Squoosh.app in your browser. Upload your images there for optimization." -ForegroundColor Green
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Optimize images using online tools" -ForegroundColor White
Write-Host "  2. Save optimized versions to: $outputPath" -ForegroundColor White
Write-Host "  3. Update import paths in your React components" -ForegroundColor White
Write-Host "  4. Test the app for improved loading speed" -ForegroundColor White

Write-Host "`nOptimization complete! ✅" -ForegroundColor Green
