#!/usr/bin/env node

/**
 * Environment validation script for build-time security checks
 */

const fs = require('fs');
const path = require('path');

// Required environment variables for production
const REQUIRED_PROD_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL'
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'CSRF_SECRET',
  'RATE_LIMIT_SECRET'
];

// Sensitive patterns that should not be in environment variables
const SENSITIVE_PATTERNS = [
  /password/i,
  /secret.*key/i,
  /private.*key/i,
  /api.*key/i
];

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const isProduction = process.env.NODE_ENV === 'production';
  const errors = [];
  const warnings = [];
  
  // Check required variables
  REQUIRED_PROD_VARS.forEach(varName => {
    if (!process.env[varName]) {
      if (isProduction) {
        errors.push(`Missing required environment variable: ${varName}`);
      } else {
        warnings.push(`Missing environment variable: ${varName} (required for production)`);
      }
    }
  });
  
  // Check recommended variables for production
  if (isProduction) {
    RECOMMENDED_VARS.forEach(varName => {
      if (!process.env[varName]) {
        warnings.push(`Missing recommended environment variable: ${varName}`);
      }
    });
  }
  
  // Validate URL formats
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not a valid URL');
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL && !isValidUrl(process.env.NEXT_PUBLIC_APP_URL)) {
    errors.push('NEXT_PUBLIC_APP_URL is not a valid URL');
  }
  
  // Check HTTPS requirement in production
  if (isProduction && process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_APP_URL must use HTTPS in production');
  }
  
  // Check for sensitive data exposure
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      SENSITIVE_PATTERNS.forEach(pattern => {
        if (pattern.test(key)) {
          errors.push(`Potentially sensitive data exposed in public environment variable: ${key}`);
        }
      });
    }
  });
  
  // Check .env.local exists and .env.example is up to date
  checkEnvFiles(warnings);
  
  // Report results
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`   ${error}`));
    console.log('\n💡 Tip: Check your .env.local file and ensure all required variables are set.');
    process.exit(1);
  }
  
  console.log('✅ Environment variables check passed');
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function checkEnvFiles(warnings) {
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envLocalPath)) {
    warnings.push('.env.local file not found - create one based on .env.example');
  }
  
  if (!fs.existsSync(envExamplePath)) {
    warnings.push('.env.example file not found - this helps other developers');
    return;
  }
  
  // Check if .env.example has all the keys we expect
  try {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const exampleKeys = exampleContent
      .split('\n')
      .filter(line => line.includes('=') && !line.startsWith('#'))
      .map(line => line.split('=')[0].trim());
    
    REQUIRED_PROD_VARS.forEach(varName => {
      if (!exampleKeys.includes(varName)) {
        warnings.push(`${varName} missing from .env.example`);
      }
    });
  } catch (error) {
    warnings.push('Could not read .env.example file');
  }
}

function checkSecurityConfiguration() {
  console.log('🔒 Checking security configuration...');
  
  const errors = [];
  const warnings = [];
  
  // Check if security middleware exists
  const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
  if (!fs.existsSync(middlewarePath)) {
    errors.push('Security middleware not found at src/middleware.ts');
  }
  
  // Check if security headers are configured
  const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
  if (fs.existsSync(nextConfigPath)) {
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    if (!configContent.includes('Content-Security-Policy')) {
      warnings.push('Content Security Policy not found in next.config.ts');
    }
    if (!configContent.includes('X-Frame-Options')) {
      warnings.push('X-Frame-Options header not found in next.config.ts');
    }
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Security warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Security errors:');
    errors.forEach(error => console.log(`   ${error}`));
    process.exit(1);
  }
  
  console.log('✅ Security configuration check passed');
}

// Run checks
console.log('🚀 Running pre-build security checks...\n');

try {
  checkEnvironmentVariables();
  checkSecurityConfiguration();
  console.log('\n🎉 All security checks passed!');
} catch (error) {
  console.error('\n💥 Security check failed:', error.message);
  process.exit(1);
}
