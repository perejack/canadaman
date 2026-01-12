# PowerShell script to download images for the Canadian job application form
# Run this script from the project root directory

Write-Host "Downloading Canadian Job Application Form Images..." -ForegroundColor Green

# Create directories if they don't exist
$directories = @(
    "public/images/steps",
    "public/images/success", 
    "public/images/ui"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Image URLs and their target paths
$images = @{
    # Step background images
    "https://images.stockcake.com/public/6/d/0/6d09ff1e-9aff-456b-b5b7-e4a7c2fe7b22_large/busy-office-scene-stockcake.jpg" = "public/images/steps/contact-step.jpg"
    
    # Success and processing images
    "https://www.canadaimmigration-express.com/wp-content/uploads/2024/12/Canada-Immigration-Express-CIE-3.jpg" = "public/images/success/processing-1.jpg"
    "https://www.vmcdn.ca/f/files/glaciermedia/images/holidays/canada-flag-day.jpg" = "public/images/success/processing-2.jpg"
    "https://img.freepik.com/free-photo/people-celebrating-canada-day_23-2151440536.jpg" = "public/images/success/success-celebration.jpg"
    "https://www.shutterstock.com/image-photo/happy-latin-man-sitting-flag-600nw-2223425931.jpg" = "public/images/success/canadian-workplace.jpg"
    
    # UI enhancement images
    "https://thumbs.dreamstime.com/b/red-maple-leaf-check-mark-logo-canadian-checkmark-238633887.jpg" = "public/images/ui/form-success.jpg"
    "https://i.pinimg.com/736x/85/a8/1b/85a81b165c9632df3875540f51f74f13.jpg" = "public/images/ui/form-error.jpg"
    "https://www.shutterstock.com/image-vector/business-milestones-businessman-jumping-air-260nw-2027989907.jpg" = "public/images/ui/progress-milestone.jpg"
}

# Download function with error handling
function Download-Image {
    param(
        [string]$Url,
        [string]$OutputPath
    )
    
    try {
        Write-Host "Downloading: $(Split-Path $OutputPath -Leaf)" -ForegroundColor Cyan
        
        # Create a web client with headers to avoid blocking
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        
        # Download the file
        $webClient.DownloadFile($Url, $OutputPath)
        $webClient.Dispose()
        
        # Check if file was downloaded successfully
        if (Test-Path $OutputPath) {
            $fileSize = (Get-Item $OutputPath).Length
            $fileSizeKB = [math]::Round($fileSize/1KB, 2)
            Write-Host "Success: $(Split-Path $OutputPath -Leaf) ($fileSizeKB KB)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Failed: File not created for $(Split-Path $OutputPath -Leaf)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Error downloading $(Split-Path $OutputPath -Leaf): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Alternative download function using Invoke-WebRequest
function Download-Image-Alternative {
    param(
        [string]$Url,
        [string]$OutputPath
    )
    
    try {
        Write-Host "Downloading (alternative method): $(Split-Path $OutputPath -Leaf)" -ForegroundColor Cyan
        
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        
        if (Test-Path $OutputPath) {
            $fileSize = (Get-Item $OutputPath).Length
            $fileSizeKB = [math]::Round($fileSize/1KB, 2)
            Write-Host "Success: $(Split-Path $OutputPath -Leaf) ($fileSizeKB KB)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Failed: File not created for $(Split-Path $OutputPath -Leaf)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Error downloading $(Split-Path $OutputPath -Leaf): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Download all images
$successCount = 0
$totalCount = $images.Count

Write-Host ""
Write-Host "Starting download of $totalCount images..." -ForegroundColor Magenta

foreach ($imageUrl in $images.Keys) {
    $outputPath = $images[$imageUrl]
    
    # Try primary download method
    $success = Download-Image -Url $imageUrl -OutputPath $outputPath
    
    # If primary method fails, try alternative
    if (-not $success) {
        Write-Host "Retrying with alternative method..." -ForegroundColor Yellow
        $success = Download-Image-Alternative -Url $imageUrl -OutputPath $outputPath
    }
    
    if ($success) {
        $successCount++
    }
    
    # Small delay between downloads to be respectful
    Start-Sleep -Milliseconds 500
}

# Summary
Write-Host ""
Write-Host "Download Summary:" -ForegroundColor Magenta
Write-Host "Successfully downloaded: $successCount/$totalCount images" -ForegroundColor Green

if ($successCount -eq $totalCount) {
    Write-Host "All images downloaded successfully!" -ForegroundColor Green
    Write-Host "You can now run your application with enhanced visuals!" -ForegroundColor Cyan
} else {
    Write-Host "Some images failed to download. Check the errors above." -ForegroundColor Yellow
    Write-Host "You may need to manually download the failed images." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Images saved in:" -ForegroundColor Cyan
Write-Host "   • public/images/steps/ - Step background images" -ForegroundColor White
Write-Host "   • public/images/success/ - Success and processing images" -ForegroundColor White
Write-Host "   • public/images/ui/ - UI enhancement images" -ForegroundColor White

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Magenta
Write-Host "   1. Run: npm run dev" -ForegroundColor White
Write-Host "   2. Test the application form with new images" -ForegroundColor White
Write-Host "   3. Enjoy the enhanced visual experience!" -ForegroundColor White
