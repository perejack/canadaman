# PowerShell script to download company images for Canadian job listings
# Run this script from the project root directory

Write-Host "Downloading Company Images for Canadian Job Listings..." -ForegroundColor Green

# Create company images directory
$companyDir = "public/images/companies"
if (!(Test-Path $companyDir)) {
    New-Item -ItemType Directory -Path $companyDir -Force
    Write-Host "Created directory: $companyDir" -ForegroundColor Yellow
}

# Company rectangular images and their target paths
$companyImages = @{
    # Major Canadian Companies - Office/Store Images
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop" = "public/images/companies/tim-hortons.jpg"
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=250&fit=crop" = "public/images/companies/shoppers-drug-mart.jpg"
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop" = "public/images/companies/canadian-tire.jpg"
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop" = "public/images/companies/loblaws.jpg"
    "https://images.unsplash.com/photo-1604719312566-878b4c7b6c7c?w=400&h=250&fit=crop" = "public/images/companies/metro.jpg"
    
    # Hospitality & Hotels
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop" = "public/images/companies/marriott.jpg"
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop" = "public/images/companies/hilton.jpg"
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop" = "public/images/companies/four-seasons.jpg"
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop" = "public/images/companies/best-western.jpg"
    
    # Healthcare & Childcare
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=250&fit=crop" = "public/images/companies/bright-horizons.jpg"
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop" = "public/images/companies/rexall.jpg"
    
    # Construction & Trades
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop" = "public/images/companies/home-depot.jpg"
    "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop" = "public/images/companies/lowes.jpg"
    
    # Food & Restaurant
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop" = "public/images/companies/mcdonalds.jpg"
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop" = "public/images/companies/subway.jpg"
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=250&fit=crop" = "public/images/companies/boston-pizza.jpg"
    
    # Cleaning & Maintenance
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop" = "public/images/companies/molly-maid.jpg"
    
    # Transportation
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop" = "public/images/companies/uber.jpg"
    
    # Security
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop" = "public/images/companies/garda.jpg"
    
    # Manufacturing
    "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=250&fit=crop" = "public/images/companies/bombardier.jpg"
    
    # Generic Canadian Company Images
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop" = "public/images/companies/generic-canadian-1.jpg"
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop" = "public/images/companies/generic-canadian-2.jpg"
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=250&fit=crop" = "public/images/companies/generic-canadian-3.jpg"
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=250&fit=crop" = "public/images/companies/generic-canadian-4.jpg"
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop" = "public/images/companies/generic-canadian-5.jpg"
    
    # Additional Professional Workplace Images
    "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=400&h=250&fit=crop" = "public/images/companies/atlantic-seafood.jpg"
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop" = "public/images/companies/northern-landscapes.jpg"
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=250&fit=crop" = "public/images/companies/maple-cleaners.jpg"
}

# Download function with error handling
function Download-Logo {
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
function Download-Logo-Alternative {
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

# Download all company images
$successCount = 0
$totalCount = $companyImages.Count

Write-Host ""
Write-Host "Starting download of $totalCount company images..." -ForegroundColor Magenta

foreach ($imageUrl in $companyImages.Keys) {
    $outputPath = $companyImages[$imageUrl]
    
    # Try primary download method
    $success = Download-Logo -Url $imageUrl -OutputPath $outputPath
    
    # If primary method fails, try alternative
    if (-not $success) {
        Write-Host "Retrying with alternative method..." -ForegroundColor Yellow
        $success = Download-Logo-Alternative -Url $imageUrl -OutputPath $outputPath
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
Write-Host "Successfully downloaded: $successCount/$totalCount company images" -ForegroundColor Green

if ($successCount -eq $totalCount) {
    Write-Host "All company images downloaded successfully!" -ForegroundColor Green
    Write-Host "You can now run your application with professional company images!" -ForegroundColor Cyan
} else {
    Write-Host "Some images failed to download. Check the errors above." -ForegroundColor Yellow
    Write-Host "You may need to manually download the failed images." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Company images saved in:" -ForegroundColor Cyan
Write-Host "   • public/images/companies/ - Professional rectangular company images" -ForegroundColor White

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Magenta
Write-Host "   1. Run: npm run dev" -ForegroundColor White
Write-Host "   2. Check the job listings with beautiful company images" -ForegroundColor White
Write-Host "   3. Enjoy the enhanced visual appeal!" -ForegroundColor White
