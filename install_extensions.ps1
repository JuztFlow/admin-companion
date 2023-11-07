$extensions = Get-Content ".\extensions.txt"

foreach ($extension in $extensions) {
    code --install-extension $extension
    Write-Host "-> $extension..."
}

Write-Host "All extensions have been installed."