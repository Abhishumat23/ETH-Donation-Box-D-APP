# GitHub Setup Guide

## 🚀 Publishing to GitHub

### Before You Push:

1. **Security Check ✅**
   - All private keys removed from code
   - .env.example created (not .env)
   - .gitignore properly configured
   - No sensitive data in commit history

2. **Files to Include:**
   ```
   ✅ Smart contracts (contracts/)
   ✅ Tests (test/)
   ✅ Frontend (frontend/)
   ✅ Scripts (scripts/)
   ✅ Configuration files
   ✅ Documentation
   ✅ .gitignore
   ✅ .env.example
   ```

3. **Files to Exclude:**
   ```
   ❌ node_modules/
   ❌ .env files
   ❌ Private keys
   ❌ artifacts/ (auto-generated)
   ❌ cache/ (auto-generated)
   ```

### Repository Setup:

1. **Initialize Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Donation Box dApp"
   ```

2. **Create GitHub Repository:**
   - Go to GitHub.com
   - Click "New Repository"
   - Name: "donation-box-dapp"
   - Description: "Beginner-friendly Ethereum donation dApp built with Solidity and Hardhat"
   - Make it Public (for academic projects)

3. **Push to GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/donation-box-dapp.git
   git push -u origin main
   ```

### README Badges (Optional):
Add these to make your project look professional:

```markdown
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
```

### Academic Project Tags:
- blockchain
- ethereum
- solidity
- dapp
- smart-contracts
- web3
- hardhat
- academic-project
