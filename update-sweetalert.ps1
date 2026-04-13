# Script para actualizar todas las referencias de custom-sweetalert.js
$files = Get-ChildItem -Path "app" -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "custom-sweetalert\.js") {
        $newContent = $content -replace "custom-sweetalert\.js", "custom-sweetalert-safe.js"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "All files updated successfully!"


