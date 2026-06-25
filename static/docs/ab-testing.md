# A/B Testing & Link Rotation

RdRx includes a powerful link rotation feature that allows you to create a single short URL that distributes traffic across multiple destinations. This is perfect for A/B testing, load balancing, and campaign optimization.

## Overview

A rotator link is a special type of short URL that redirects visitors to different destinations based on a chosen strategy. Instead of one URL pointing to one destination, you can have one URL pointing to multiple destinations with intelligent distribution.

## Features

- **Multiple Rotation Strategies**: Choose between round-robin, weighted, or random distribution
- **Unlimited Destinations**: Add as many destination URLs as needed
- **Click Tracking**: Track clicks for each destination individually
- **Real-time Analytics**: Monitor performance of each variant
- **Easy Management**: Beautiful UI for creating and managing rotators

## Rotation Strategies

### Round Robin
Cycles through destinations in order, ensuring equal distribution.

**Use Cases:**
- Load balancing across multiple servers
- Equal testing of multiple variants
- Fair distribution of traffic

**Example:**
- Visitor 1 → Destination A
- Visitor 2 → Destination B
- Visitor 3 → Destination C
- Visitor 4 → Destination A (cycles back)

### Weighted Distribution
Distribute traffic by percentage. Perfect for A/B testing where you want to control the split.

**Use Cases:**
- A/B testing (e.g., 70% control, 30% variant)
- Gradual rollouts (e.g., 10% new version, 90% old version)
- Multi-variant testing with custom splits

**Example:**
- Destination A: 70% of traffic
- Destination B: 30% of traffic

**Note:** Weights must add up to 100%

### Random
Truly random selection for each visitor.

**Use Cases:**
- Unpredictable distribution
- Simple A/B testing without tracking order
- When you want pure randomness

**Example:**
Each visitor gets a random destination with equal probability.

## Creating a Rotator Link

### Via Web Interface

1. **Navigate to A/B Testing**
   - Log in to your RdRx account
   - Click "A/B Testing" in the sidebar
   - Or visit `/rotator`

2. **Fill in Basic Information**
   - **Campaign Name**: Internal name to identify this rotator (e.g., "Landing Page Test")
   - **Short URL**: The shortcode for your rotator (e.g., "my-test")
   - **Description**: Optional notes about what you're testing

3. **Choose Strategy**
   - Select one of the three rotation strategies
   - For weighted distribution, you'll see percentage inputs

4. **Add Destinations**
   - Start with 2 default destination fields
   - Click "+ Add URL" to add more destinations
   - Enter full URLs (e.g., `https://example.com/page-a`)
   - For weighted strategy, set the percentage for each destination
   - Remove destinations with the X button (minimum 2 required)

5. **Create**
   - Click "Create Rotator Link"
   - Your rotator link will be created instantly
   - Copy the short URL and start using it!

### Via API

```bash
POST /api/rotator/create
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "shortcode": "my-test",
  "name": "Landing Page A/B Test",
  "description": "Testing new landing page design",
  "strategy": "weighted",
  "destinations": [
    { "url": "https://example.com/page-a", "weight": 70 },
    { "url": "https://example.com/page-b", "weight": 30 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "shortcode": "my-test",
  "message": "Rotator link created successfully"
}
```

## Viewing Statistics

### Via Web Interface

Coming soon: View detailed statistics for each rotator including:
- Total clicks per destination
- Click distribution percentages
- Performance over time

### Via API

```bash
GET /api/rotator/stats/my-test
Authorization: Bearer YOUR_API_KEY
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "rotator": {
      "id": 1,
      "shortcode": "my-test",
      "name": "Landing Page A/B Test",
      "strategy": "weighted",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "destinations": [
      {
        "id": 1,
        "target_url": "https://example.com/page-a",
        "weight": 70,
        "click_count": 142,
        "is_active": true
      },
      {
        "id": 2,
        "target_url": "https://example.com/page-b",
        "weight": 30,
        "click_count": 58,
        "is_active": true
      }
    ],
    "totalClicks": 200
  }
}
```

## Best Practices

### A/B Testing
1. **Start with 70/30 split**: Test your control (70%) against a variant (30%)
2. **Run for sufficient time**: Collect enough data before making decisions
3. **Test one thing at a time**: Isolate variables for clear results
4. **Monitor continuously**: Check stats regularly to catch issues early

### Load Balancing
1. **Use round-robin**: Ensures equal distribution across servers
2. **Monitor health**: Remove unhealthy destinations promptly
3. **Add redundancy**: Have backup destinations ready

### Campaign Testing
1. **Use descriptive names**: Make it easy to identify tests later
2. **Document your tests**: Use the description field
3. **Archive old tests**: Clean up completed tests

## Limitations

- Minimum 2 destinations required
- Weighted strategy requires weights to total 100%
- Shortcodes must be unique across all link types
- Statistics are tracked per destination, not per visitor

## Database Schema

Rotator links use three tables:

### rotator_links
Stores rotator configuration
- `id`: Primary key
- `shortcode`: Unique shortcode
- `name`: Campaign name
- `strategy`: Rotation strategy (round-robin, weighted, random)
- `creator_id`: User who created it
- `is_active`: Active status

### rotator_destinations
Stores destination URLs
- `id`: Primary key
- `rotator_id`: Foreign key to rotator_links
- `target_url`: Destination URL
- `weight`: Weight for weighted strategy
- `click_count`: Number of clicks
- `is_active`: Active status

### rotator_state
Tracks state for round-robin
- `rotator_id`: Primary key
- `last_destination_id`: Last used destination
- `last_rotated_at`: Timestamp of last rotation

## Troubleshooting

### Rotator not working
- Verify shortcode exists and is active
- Check that destinations are valid URLs
- Ensure at least 2 active destinations

### Uneven distribution
- For round-robin: This is expected with low traffic
- For weighted: Verify weights add up to 100%
- For random: True randomness may appear uneven with small samples

### Statistics not updating
- Statistics update in real-time
- Check that you're viewing the correct shortcode
- Verify destinations are active

## Examples

### Simple A/B Test
```json
{
  "shortcode": "landing-test",
  "name": "Homepage Redesign Test",
  "strategy": "weighted",
  "destinations": [
    { "url": "https://example.com/", "weight": 50 },
    { "url": "https://example.com/new-design", "weight": 50 }
  ]
}
```

### Multi-variant Test
```json
{
  "shortcode": "pricing-test",
  "name": "Pricing Page Variants",
  "strategy": "weighted",
  "destinations": [
    { "url": "https://example.com/pricing-v1", "weight": 40 },
    { "url": "https://example.com/pricing-v2", "weight": 30 },
    { "url": "https://example.com/pricing-v3", "weight": 30 }
  ]
}
```

### Load Balancer
```json
{
  "shortcode": "api-endpoint",
  "name": "API Load Balancer",
  "strategy": "round-robin",
  "destinations": [
    { "url": "https://api1.example.com/endpoint" },
    { "url": "https://api2.example.com/endpoint" },
    { "url": "https://api3.example.com/endpoint" }
  ]
}
```

## Related Documentation

- [Analytics](./api/README.md#analytics) - Track overall link performance
- [API Reference](./api/README.md) - Complete API documentation
- [Getting Started](./getting-started.md) - Initial setup guide
