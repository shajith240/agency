# Deployment Security Guide

## Pre-Deployment Security Checklist

### 1. Environment Configuration

Before deploying to production, ensure all environment variables are properly configured:

```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=https://ltmwapridldsxphvduer.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://sharpflow.xyz

# Security configuration
CSRF_SECRET=your_32_character_minimum_secret_key
RATE_LIMIT_SECRET=your_rate_limit_secret

# Optional monitoring
SENTRY_DSN=your_sentry_dsn_for_error_monitoring
```

### 2. Security Validation

Run the complete security check before deployment:

```bash
# Run all security checks
npm run security-check

# Individual checks
npm run env-check        # Validate environment variables
npm run type-check       # TypeScript validation
npm run lint:security    # Security linting
npm run build           # Production build test
```

### 3. Vercel Deployment Configuration

#### Domain Setup
1. Configure custom domain: `sharpflow.xyz`
2. Ensure SSL/TLS is enabled (automatic with Vercel)
3. Set up domain redirects if needed

#### Environment Variables in Vercel
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all required environment variables
3. Set appropriate environments (Production, Preview, Development)

#### Security Headers Verification
After deployment, verify security headers using:
- [Security Headers Checker](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

Expected headers:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security (production only)

### 4. Post-Deployment Testing

#### Functional Testing
1. **Form Submission**: Test contact form with valid/invalid data
2. **Rate Limiting**: Test multiple rapid submissions
3. **CSRF Protection**: Verify token validation
4. **HTTPS Redirection**: Ensure HTTP redirects to HTTPS

#### Security Testing
1. **XSS Prevention**: Test script injection in forms
2. **SQL Injection**: Test malicious input patterns
3. **Path Traversal**: Test directory traversal attempts
4. **CSRF Attacks**: Test cross-site request forgery

#### Performance Testing
1. **Load Testing**: Test under high traffic
2. **Rate Limit Testing**: Verify rate limiting works under load
3. **Error Handling**: Test error scenarios

## Production Security Monitoring

### 1. Error Monitoring
Set up error monitoring with Sentry or similar service:

```bash
# Add to environment variables
SENTRY_DSN=your_sentry_dsn
```

### 2. Security Event Logging
Monitor security events in production:
- Rate limit violations
- CSRF token failures
- Suspicious request patterns
- Form validation failures

### 3. Regular Security Audits
- **Weekly**: Review error logs and security events
- **Monthly**: Dependency security updates
- **Quarterly**: Full security audit

## Incident Response Plan

### 1. Security Incident Detection
Monitor for:
- Unusual traffic patterns
- High error rates
- Security header failures
- Rate limit violations

### 2. Response Procedures
1. **Immediate**: Block malicious IPs if identified
2. **Short-term**: Investigate and contain the issue
3. **Long-term**: Implement additional security measures

### 3. Communication Plan
- Internal team notification
- User communication if data is affected
- Security team escalation procedures

## Backup and Recovery

### 1. Data Backup
- Supabase handles database backups automatically
- Form submissions are sent to Formspree (external service)
- No sensitive data stored locally

### 2. Application Recovery
- Vercel provides automatic deployments from Git
- Previous deployments can be rolled back instantly
- Environment variables are backed up in Vercel

## Compliance and Auditing

### 1. Security Compliance
- OWASP Top 10 protection implemented
- GDPR compliance for data handling
- Industry-standard security practices

### 2. Audit Trail
- All security events are logged
- Deployment history maintained in Vercel
- Environment changes tracked

### 3. Documentation
- Security implementation documented
- Deployment procedures documented
- Incident response procedures documented

## Maintenance Schedule

### Daily
- Monitor error logs
- Check security event logs

### Weekly
- Review security metrics
- Update dependencies if needed

### Monthly
- Security audit
- Performance review
- Documentation updates

### Quarterly
- Full security assessment
- Penetration testing
- Policy review

## Emergency Contacts

### Security Issues
- **Primary**: security@sharpflow.xyz
- **Response Time**: 2-4 hours for critical issues
- **Escalation**: CTO notification for data breaches

### Technical Issues
- **Primary**: tech@sharpflow.xyz
- **Response Time**: 1-2 hours during business hours
- **24/7 Support**: Available for critical production issues

## Additional Security Resources

- [Vercel Security Documentation](https://vercel.com/docs/security)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Supabase Security Documentation](https://supabase.com/docs/guides/platform/security)

---

**Deployment Date**: TBD  
**Security Review**: Completed  
**Next Review**: 3 months from deployment
