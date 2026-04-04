# RdRx API Key Documentation

## Overview

RdRx now supports API key authentication, allowing you to create short URLs programmatically from iOS Shortcuts, scripts, or other applications without needing to manage session cookies.

## Getting Your API Key

1. Log in to your RdRx account
2. Navigate to **Account Settings** (`/account`)
3. Scroll to the **API Key** section
4. Click **"Regenerate API Key"** to create your first API key
5. Copy the key immediately (it will be masked after you navigate away)

⚠️ **Important**: Keep your API key secure! Anyone with your API key can create short URLs on your behalf.

## API Key Format

API keys follow this format:
```
rdrx_live_[24 random characters]
```

Example: `rdrx_live_A7xK9mP2nQ8vR4wS6tY1zB3c`

## Using Your API Key

### Authentication Header

Include your API key in the `Authorization` header of your requests:

```
Authorization: Bearer rdrx_live_YOUR_API_KEY_HERE
```

### Creating a Short URL

**Endpoint:** `POST https://rdrx.co/`

**Headers:**
```
Authorization: Bearer rdrx_live_YOUR_API_KEY_HERE
Content-Type: application/json
```

**Request Body (Random Shortcode):**
```json
{
  "url": "https://example.com/very/long/url",
  "custom": false
}
```

**Request Body (Custom Shortcode):**
```json
{
  "url": "https://example.com/very/long/url",
  "custom": true,
  "custom_code": "mylink"
}
```

**Response (Success):**
```json
{
  "shortcode": "abc123"
}
```

**Response (Error - Shortcode Exists):**
```json
{
  "message": "Shortcode already exists"
}
```

**Your Short URL:** `https://rdrx.co/{shortcode}`

## iOS Shortcuts Integration

### Step 1: Create a Shortcut

1. Open the **Shortcuts** app on your iPhone/iPad
2. Tap the **+** button to create a new shortcut
3. Name it "Create Short URL" or similar

### Step 2: Add Actions

Add the following actions to your shortcut:

1. **Ask for Input**
   - Prompt: `Enter URL to shorten`
   - Input Type: `URL`

2. **Text**
   - Content: 
   ```json
   {"url":"[Provided Input]","custom":false}
   ```
   - Replace `[Provided Input]` with the output from step 1

3. **Get Contents of URL**
   - URL: `https://rdrx.co/`
   - Method: `POST`
   - Headers:
     - Add Header: `Authorization` = `Bearer rdrx_live_YOUR_API_KEY_HERE`
     - Add Header: `Content-Type` = `application/json`
   - Request Body: `Text` (select the Text from step 2)

4. **Get Dictionary from Input**
   - Input: `Contents of URL` (from step 3)

5. **Get Dictionary Value**
   - Key: `shortcode`
   - Dictionary: `Dictionary` (from step 4)

6. **Text**
   - Content: `https://rdrx.co/[Dictionary Value]`
   - Replace `[Dictionary Value]` with output from step 5

7. **Copy to Clipboard**
   - Content: `Text` (from step 6)

8. **Show Result**
   - Content: `Clipboard`

### Step 3: Run the Shortcut

- Run the shortcut from the Shortcuts app
- Or add it to your Home Screen for quick access
- Or use Siri: "Hey Siri, create short URL"

## Example: cURL

```bash
curl -X POST https://rdrx.co/ \
  -H "Authorization: Bearer rdrx_live_YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very/long/url",
    "custom": false
  }'
```

## Example: Python

```python
import requests

API_KEY = "rdrx_live_YOUR_API_KEY_HERE"
BASE_URL = "https://rdrx.co"

def create_short_url(long_url, custom_code=None):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "url": long_url,
        "custom": custom_code is not None
    }
    
    if custom_code:
        data["custom_code"] = custom_code
    
    response = requests.post(
        BASE_URL,
        headers=headers,
        json=data
    )
    
    if response.status_code == 200:
        result = response.json()
        return f"{BASE_URL}/{result['shortcode']}"
    else:
        raise Exception(f"Error: {response.text}")

# Usage
short_url = create_short_url("https://example.com/very/long/url")
print(f"Short URL: {short_url}")
```

## Example: JavaScript/Node.js

```javascript
const API_KEY = "rdrx_live_YOUR_API_KEY_HERE";
const BASE_URL = "https://rdrx.co";

async function createShortUrl(longUrl, customCode = null) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: longUrl,
      custom: customCode !== null,
      custom_code: customCode
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    return `${BASE_URL}/${data.shortcode}`;
  } else {
    throw new Error(`Error: ${await response.text()}`);
  }
}

// Usage
createShortUrl("https://example.com/very/long/url")
  .then(shortUrl => console.log(`Short URL: ${shortUrl}`))
  .catch(error => console.error(error));
```

## Security Best Practices

1. **Never commit API keys to version control**
   - Use environment variables
   - Add `.env` files to `.gitignore`

2. **Rotate keys regularly**
   - Regenerate your API key periodically
   - Update all applications using the old key

3. **Use HTTPS only**
   - Never send API keys over unencrypted connections

4. **Limit key exposure**
   - Don't share keys in public forums or screenshots
   - Don't embed keys in client-side code

5. **Monitor usage**
   - Check your dashboard regularly for unexpected activity
   - Regenerate your key if you suspect it's been compromised

## Rate Limiting

⚠️ **Note**: Currently, there is no rate limiting on API key requests. This will be added in a future update. Please use the API responsibly.

## Troubleshooting

### "Unauthorized" Error

- Check that your API key is correct
- Ensure you're including the `Bearer ` prefix in the Authorization header
- Verify your API key hasn't been regenerated

### "Invalid request body" Error

- Ensure you're sending valid JSON
- Check that the `Content-Type` header is set to `application/json`
- Verify the `url` field is present in your request

### Shortcode Already Exists

- If using custom shortcodes, choose a different code
- For random shortcodes, try the request again (collision is rare)

## API Endpoints Reference

### Create Short URL
- **Method**: `POST`
- **Endpoint**: `/`
- **Auth**: Required (API Key or Session)
- **Body**: `{ "url": string, "custom"?: boolean, "custom_code"?: string }`
- **Response**: `{ "shortcode": string }`

### Create Code Snippet
- **Method**: `POST`
- **Endpoint**: `/`
- **Auth**: Required (API Key or Session)
- **Body**: `{ "snippet": string, "custom"?: boolean, "custom_code"?: string }`
- **Response**: `{ "shortcode": string }`

### Upload Files
- **Method**: `POST`
- **Endpoint**: `/upload`
- **Auth**: Required (API Key or Session)
- **Body**: `multipart/form-data` with files
- **Response**: `{ "urls": string[], "shortcode": string }`

### Create Temporary URL (No Auth Required)
- **Method**: `POST`
- **Endpoint**: `/temp`
- **Auth**: Not required
- **Body**: `{ "url": string }`
- **Response**: `{ "shortcode": string, "url": string, "expires_at": string, "full_url": string }`
- **Note**: Expires in 2 days

## Future Enhancements

Planned features for API key functionality:

- [ ] Rate limiting per API key
- [ ] Multiple API keys per user
- [ ] API key scopes/permissions
- [ ] API key usage analytics
- [ ] Webhook support for URL events
- [ ] Batch URL creation endpoint

## Support

If you encounter issues or have questions:

1. Check this documentation first
2. Review the [main README](README.md)
3. Open an issue on [GitHub](https://github.com/clarkhacks/RdRx/issues)

---

**Last Updated**: April 4, 2026  
**Version**: 1.0.0
