# API Documentation

RdRx provides a RESTful API for programmatic access to all features.

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```http
Authorization: Bearer rdrx_live_your_api_key_here
```

See [API Keys](../api-keys.md) for information on generating and managing API keys.

## Base URL

```
https://your-domain.com/api
```

## Endpoints

### Create Short URL

Create a new short URL.

**Endpoint:** `POST /api/create`

**Request Body:**
```json
{
  "url": "https://example.com",
  "custom": false,
  "custom_code": "optional-custom-code",
  "delete_after": "2024-12-31T23:59:59Z",
  "password_protected": false,
  "password": "optional-password"
}
```

**Response:**
```json
{
  "shortcode": "abc123",
  "url": "https://your-domain.com/abc123"
}
```

### Create Code Snippet

Create a new code snippet.

**Endpoint:** `POST /api/create`

**Request Body:**
```json
{
  "snippet": "console.log('Hello, World!');",
  "custom": false,
  "custom_code": "optional-custom-code",
  "delete_after": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "shortcode": "c-abc123"
}
```

### Upload Files

Upload files for sharing.

**Endpoint:** `POST /upload`

**Request:** Multipart form data
- `files`: File(s) to upload
- `customCode`: Custom shortcode (optional)
- `deleteAfter`: Expiration date (optional)
- `password_protected`: Boolean (optional)
- `password`: Password for protection (optional)

**Response:**
```json
{
  "urls": ["https://r2.example.com/uploads/abc123-file.pdf"],
  "shortcode": "f-abc123"
}
```

### Create Temporary URL

Create a temporary URL that expires in 2 days (no authentication required).

**Endpoint:** `POST /api/temp`

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "shortcode": "xyz789",
  "url": "https://example.com",
  "expires_at": "2024-04-06T12:00:00Z",
  "full_url": "https://your-domain.com/xyz789"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid or missing API key)
- `409` - Conflict (shortcode already exists)
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:

- 100 requests per minute per API key
- 1000 requests per hour per API key

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1617235200
```

## Examples

### cURL

```bash
# Create short URL
curl -X POST https://your-domain.com/api/create \
  -H "Authorization: Bearer rdrx_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Upload file
curl -X POST https://your-domain.com/upload \
  -H "Authorization: Bearer rdrx_live_your_api_key" \
  -F "files=@document.pdf" \
  -F "customCode=my-doc"
```

### JavaScript

```javascript
// Create short URL
const response = await fetch('https://your-domain.com/api/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer rdrx_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    custom: true,
    custom_code: 'my-link'
  })
});

const data = await response.json();
console.log(data.shortcode);
```

### Python

```python
import requests

# Create short URL
response = requests.post(
    'https://your-domain.com/api/create',
    headers={'Authorization': 'Bearer rdrx_live_your_api_key'},
    json={'url': 'https://example.com'}
)

data = response.json()
print(data['shortcode'])
```

## Best Practices

1. **Store API keys securely** - Never commit API keys to version control
2. **Use HTTPS** - Always use HTTPS for API requests
3. **Handle errors gracefully** - Implement proper error handling
4. **Respect rate limits** - Implement exponential backoff for retries
5. **Validate input** - Validate URLs and other input before sending requests

## Support

For API support:
- [GitHub Issues](https://github.com/clarkhacks/RdRx/issues)
- [Documentation](/)
- Email: support@rdrx.co
