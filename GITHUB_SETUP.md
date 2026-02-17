# GitHub Repository Setup for jsDelivr CDN

This guide walks you through setting up a GitHub repository for CDN distribution via jsDelivr.

## Prerequisites

- GitHub account
- Git installed on your machine
- Completed widget build in `cdn/dist/` directory

## Step 1: Create GitHub Repository

### Option A: Create New Repository on GitHub.com

1. Go to https://github.com/new
2. Repository name: `voice-widget` (or your preferred name)
3. Description: "AI-powered voice navigation widget for any website"
4. Visibility: Public (required for jsDelivr)
5. Initialize with README: No (we have our own)
6. Click "Create repository"

### Option B: Create via GitHub CLI

```bash
gh repo create liaplus/voice-widget --public --description "AI-powered voice navigation widget"
```

## Step 2: Initialize Git and Push

From your project root:

```bash
# Navigate to CDN directory
cd cdn

# Initialize git (if not already initialized)
git init

# Add GitHub remote
git remote add origin https://github.com/[USERNAME]/voice-widget.git

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.DS_Store
*.log
.env
EOF

# Add all files
git add .

# Initial commit
git commit -m "feat: initial release of LiaPlus Voice Navigation Widget v1.0.0"

# Push to GitHub
git push -u origin main
```

## Step 3: Create a Release

Releases are essential for jsDelivr versioning.

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description: Copy from CHANGELOG.md
6. Attach files (optional): dist/voice-widget.min.js, dist/voice-widget.css
7. Click "Publish release"

### Via GitHub CLI

```bash
# Create a tag
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"

# Push tag
git push origin v1.0.0

# Create release
gh release create v1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "See CHANGELOG.md for details" \
  dist/voice-widget.min.js \
  dist/voice-widget.css
```

## Step 4: jsDelivr CDN URLs

After publishing a release, your files will be available via jsDelivr:

### Latest Version (Auto-updates)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@latest/dist/voice-widget.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@latest/dist/voice-widget.min.js"></script>
```

### Specific Version (Recommended for production)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@1.0.0/dist/voice-widget.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@1.0.0/dist/voice-widget.min.js"></script>
```

### With SRI (Subresource Integrity) - Extra Security

Generate SRI hash:

```bash
# Install sri-toolbox
npm install -g sri-toolbox

# Generate SRI for CSS
sri-toolbox generate -a sha384 dist/voice-widget.css

# Generate SRI for JavaScript
sri-toolbox generate -a sha384 dist/voice-widget.min.js
```

Use in HTML:

```html
<link rel="stylesheet" 
      href="https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@1.0.0/dist/voice-widget.css"
      integrity="sha384-[HASH]"
      crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@1.0.0/dist/voice-widget.min.js"
        integrity="sha384-[HASH]"
        crossorigin="anonymous"></script>
```

## Step 5: Repository Structure

Ensure your repository has this structure:

```
voice-widget/
├── README.md              # Main documentation
├── CHANGELOG.md           # Version history
├── LICENSE                # MIT license
├── package.json           # Build dependencies
├── webpack.config.js      # Build configuration
├── .gitignore            # Git ignore rules
├── src/                   # Source files
│   ├── index.js
│   ├── VoiceWidget.js
│   ├── UIComponents.js
│   ├── CommandProcessor.js
│   ├── ApiManager.js
│   ├── AudioManager.js
│   ├── Icons.js
│   └── styles.css
├── dist/                  # Built files (commit these!)
│   ├── voice-widget.min.js
│   ├── voice-widget.dev.js
│   └── voice-widget.css
└── examples/              # Example files
    ├── basic.html
    ├── custom-keys.html
    └── advanced.html
```

**Important:** Unlike typical npm packages, CDN projects **must commit** the `dist/` folder!

## Step 6: Add Topics and Description

On GitHub repository page:

1. Click "About" gear icon
2. Add description: "AI-powered voice navigation widget for any website. Enable hands-free browsing with natural language commands."
3. Add topics:
   - `voice-navigation`
   - `accessibility`
   - `azure-speech`
   - `ai`
   - `cdn`
   - `javascript`
   - `widget`
   - `voice-commands`
   - `web-accessibility`
4. Add website: `https://liaplus.com`

## Step 7: Configure GitHub Pages (Optional)

Host example pages:

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: `main`, folder: `/examples`
4. Save

Examples will be available at:
`https://[USERNAME].github.io/voice-widget/basic.html`

## Step 8: Add License

Create LICENSE file:

```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 LiaPlus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "docs: add MIT license"
git push
```

## Step 9: Verify CDN Access

Test jsDelivr is working:

1. Wait 5-10 minutes after creating release
2. Visit: `https://cdn.jsdelivr.net/gh/[USERNAME]/voice-widget@1.0.0/dist/voice-widget.min.js`
3. Should see minified JavaScript

Check stats: `https://www.jsdelivr.com/package/gh/[USERNAME]/voice-widget`

## Step 10: Update Documentation

Update all documentation with your actual GitHub username:

```bash
# Find and replace [USERNAME] with your actual GitHub username
find . -type f -name "*.md" -exec sed -i 's/\[USERNAME\]/your-actual-username/g' {} +
find examples -type f -name "*.html" -exec sed -i 's/\[USERNAME\]/your-actual-username/g' {} +
```

## Future Releases

For subsequent releases:

```bash
# Make your changes
# ...

# Build
npm run build

# Commit
git add .
git commit -m "feat: add new feature"

# Tag new version
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# Create GitHub release
gh release create v1.1.0 --title "v1.1.0 - Feature Release" --notes "See CHANGELOG.md"
```

jsDelivr will automatically pick up new releases within minutes!

## Troubleshooting

### CDN not updating
- Wait 5-10 minutes after release
- Try purging cache: `https://purge.jsdelivr.net/gh/[USERNAME]/voice-widget@1.0.0/dist/voice-widget.min.js`

### 404 errors
- Ensure repository is public
- Verify file paths are correct (case-sensitive!)
- Check that dist/ folder is committed

### Old version cached
- Use specific version tag instead of `@latest`
- Clear browser cache
- Use jsDelivr purge tool

## Additional Resources

- [jsDelivr Documentation](https://www.jsdelivr.com/documentation)
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Semantic Versioning](https://semver.org/)

---

Need help? Contact support@liaplus.com
