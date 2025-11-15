# CORS Setup for Railway + Vercel

## Quick Fix Steps

### 1. Set Environment Variable in Railway

1. Go to your Railway project: https://railway.app
2. Select your backend service
3. Go to **Variables** tab
4. Add/Update the `FRONTEND_URL` variable:

```
FRONTEND_URL=https://skills-engine-psjm-7ii6dw848-roaas-projects-70865844.vercel.app,https://*.vercel.app
```

**Important:** Replace with your actual Vercel URL(s). You can add multiple URLs separated by commas.

### 2. Redeploy Backend

After setting the environment variable:
- Railway should auto-redeploy, OR
- Manually trigger a redeploy from the Railway dashboard

### 3. Verify CORS is Working

After redeployment, check the browser console. CORS errors should be gone.

## How It Works

The backend now:
- ✅ Handles CORS **before** Helmet middleware (critical for preflight requests)
- ✅ Supports wildcard patterns (`*.vercel.app` matches all Vercel subdomains)
- ✅ Allows multiple origins (comma-separated)
- ✅ Properly handles OPTIONS preflight requests
- ✅ Configures Helmet to not block cross-origin requests

## Testing

You can test CORS with curl:

```bash
curl -H "Origin: https://your-vercel-url.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://skillsengine-production.up.railway.app/api/frontend/profile/user_123 \
     -v
```

You should see `Access-Control-Allow-Origin` header in the response.

## Troubleshooting

If CORS errors persist:

1. **Check Railway logs** - Look for CORS-related errors
2. **Verify environment variable** - Make sure `FRONTEND_URL` is set correctly
3. **Check origin matching** - The origin must exactly match one of the allowed origins
4. **Clear browser cache** - Sometimes cached CORS responses cause issues

## Default Behavior

If `FRONTEND_URL` is not set, the backend defaults to:
- `http://localhost:3001` (local development)
- `http://localhost:5173` (Vite dev server)
- `https://*.vercel.app` (all Vercel deployments)

**For production, always set `FRONTEND_URL` explicitly!**

