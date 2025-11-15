# Troubleshooting CORS Issues

## Current Issue
CORS errors persist even after fixes. This guide helps diagnose and fix the problem.

## Step 1: Verify Railway Deployment

1. **Check if Railway has redeployed:**
   - Go to Railway dashboard → Your service → Deployments
   - Verify the latest deployment includes commit `3a034ab` or later
   - If not, trigger a manual redeploy

2. **Check Railway logs:**
   - Go to Railway dashboard → Your service → Logs
   - Look for: `CORS Configuration:` log message on startup
   - This shows what origins are allowed

## Step 2: Set Environment Variable

**CRITICAL:** Set `FRONTEND_URL` in Railway:

1. Railway dashboard → Your service → Variables
2. Add/Update variable:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://skills-engine-psjm-7ii6dw848-roaas-projects-70865844.vercel.app,https://*.vercel.app`
3. **Save** and **redeploy**

## Step 3: Verify CORS is Working

### Check Railway Logs

After redeployment, check logs for:
```
CORS Configuration: { allowedOrigins: [...], nodeEnv: 'production', ... }
```

If you see requests being blocked:
```
CORS: Blocked origin https://... Allowed origins: ...
```

### Test with curl

```bash
# Test OPTIONS preflight
curl -X OPTIONS \
  -H "Origin: https://skills-engine-psjm-7ii6dw848-roaas-projects-70865844.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v \
  https://skillsengine-production.up.railway.app/api/frontend/profile/user_123

# Should see: Access-Control-Allow-Origin header in response
```

## Step 4: Temporary Fix (If Still Not Working)

If CORS still fails, temporarily allow all origins to test:

1. In Railway, set environment variable:
   - **Name:** `NODE_ENV`
   - **Value:** `development`
   
   ⚠️ **WARNING:** This allows ALL origins. Only for testing!

2. Redeploy and test

3. If it works, the issue is with origin matching. Check:
   - Exact URL match (no trailing slashes)
   - Wildcard pattern matching
   - Environment variable format

## Common Issues

### Issue 1: Environment Variable Not Set
**Symptom:** Logs show `frontendUrl: 'not set (using defaults)'`
**Fix:** Set `FRONTEND_URL` in Railway

### Issue 2: URL Mismatch
**Symptom:** Logs show `CORS: Blocked origin ...`
**Fix:** Ensure exact URL match or wildcard pattern works

### Issue 3: Railway Not Redeployed
**Symptom:** Old code still running
**Fix:** Trigger manual redeploy in Railway

### Issue 4: Helmet Blocking
**Symptom:** CORS headers not present
**Fix:** Already fixed in code - ensure latest code is deployed

## Quick Diagnostic Commands

```bash
# Check if CORS headers are present
curl -I -H "Origin: https://your-vercel-url.vercel.app" \
  https://skillsengine-production.up.railway.app/health

# Should see: access-control-allow-origin header
```

## Next Steps

1. ✅ Set `FRONTEND_URL` in Railway
2. ✅ Redeploy backend
3. ✅ Check Railway logs for CORS configuration
4. ✅ Test frontend - CORS should work

If still failing, check Railway logs for the exact error message and origin being blocked.

