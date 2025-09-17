# Get Image API Documentation

## Overview
The Get Image API allows you to retrieve camera images within a specific date and time range. This API requires authentication and provides flexible date range options.

## Endpoint
```
POST /api/get-image/:projectId/:cameraId/
```

## Authentication
🔒 **Authentication Required** - This endpoint requires a valid authentication token.

## URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String | Yes | The project ID |
| `cameraId` | String | Yes | The camera ID |

**Note:** The developer ID is automatically set to `awj` and does not need to be specified in the URL.

## Request Body

### Required Parameters
| Parameter | Type | Format | Description |
|-----------|------|--------|-------------|
| `day1` | String | YYYYMMDD | Start date (e.g., "20231215") |
| `time1` | String | HHMMSS | Start time (e.g., "080000") |

### Optional Parameters
| Parameter | Type | Format | Description |
|-----------|------|--------|-------------|
| `day2` | String | YYYYMMDD | End date (optional - auto-calculated if not provided) |
| `time2` | String | HHMMSS | End time (optional - auto-calculated if not provided) |

### Auto-Calculation Behavior
When `day2` and `time2` are not provided, the API automatically calculates the end time as **1 hour later** from the start time.

**Examples:**
- Start: `20231215` + `080000` → End: `20231215` + `090000`
- Start: `20231215` + `233000` → End: `20231216` + `003000` (handles date rollover)

## Request Examples

### Example 1: Auto 1-Hour Range
```bash
curl -X POST http://localhost:5000/api/get-image/proj456/cam789/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "day1": "20231215",
    "time1": "080000"
  }'
```

### Example 2: Custom Date Range
```bash
curl -X POST http://localhost:5000/api/get-image/proj456/cam789/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "day1": "20231215",
    "time1": "080000",
    "day2": "20231215",
    "time2": "180000"
  }'
```

### Example 3: Cross-Day Range
```bash
curl -X POST http://localhost:5000/api/get-image/proj456/cam789/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "day1": "20231215",
    "time1": "220000",
    "day2": "20231216",
    "time2": "060000"
  }'
```

## Response Format

### Success Response (200 OK)
```json
{
  "images": [
    "20231215080000",
    "20231215080100",
    "20231215080200",
    "20231215080300"
  ],
  "count": 4,
  "dateRange": {
    "start": "20231215 08:00:00",
    "end": "20231215 09:00:00"
  },
  "path": "http://localhost:5000/media/upload/awj/proj456/cam789/",
  "autoCalculated": true
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `images` | Array | List of image filenames (without .jpg extension) |
| `count` | Number | Total number of images found |
| `dateRange` | Object | Human-readable start and end times |
| `dateRange.start` | String | Start time in "YYYYMMDD HH:MM:SS" format |
| `dateRange.end` | String | End time in "YYYYMMDD HH:MM:SS" format |
| `path` | String | Base URL for accessing the images |
| `autoCalculated` | Boolean | Indicates if end time was auto-calculated |

## Error Responses

### 400 Bad Request - Missing Parameters
```json
{
  "error": "Missing required parameters: day1, time1"
}
```

### 400 Bad Request - Invalid Date Format
```json
{
  "error": "Invalid date format. Use YYYYMMDD format for day1"
}
```

### 400 Bad Request - Invalid Time Format
```json
{
  "error": "Invalid time format. Use HHMMSS format for time1"
}
```

### 404 Not Found - Camera Directory
```json
{
  "error": "Camera directory not found"
}
```

### 404 Not Found - No Images
```json
{
  "error": "No pictures found in camera directory"
}
```

### 401 Unauthorized - Authentication Required
```json
{
  "error": "Authentication required"
}
```

## Image Access

Images can be accessed using the `path` field from the response:

```
{path}{image_filename}.jpg
```

**Example:**
- Response path: `http://localhost:5000/media/upload/awj/proj456/cam789/`
- Image filename: `20231215080000`
- Full URL: `http://localhost:5000/media/upload/awj/proj456/cam789/20231215080000.jpg`

## File Naming Convention

Images are stored with filenames in the format:
```
YYYYMMDDHHMMSS.jpg
```

Where:
- `YYYY` = 4-digit year
- `MM` = 2-digit month (01-12)
- `DD` = 2-digit day (01-31)
- `HH` = 2-digit hour (00-23)
- `MM` = 2-digit minute (00-59)
- `SS` = 2-digit second (00-59)

**Example:** `20231215080000.jpg` = December 15, 2023 at 08:00:00

## Use Cases

### 1. Quick Hourly Check
Get all images from the last hour:
```json
{
  "day1": "20231215",
  "time1": "140000"
}
```

### 2. Business Hours Monitoring
Get images during business hours:
```json
{
  "day1": "20231215",
  "time1": "080000",
  "day2": "20231215",
  "time2": "170000"
}
```

### 3. Night Shift Monitoring
Get images during night shift:
```json
{
  "day1": "20231215",
  "time1": "220000",
  "day2": "20231216",
  "time2": "060000"
}
```

### 4. Specific Event Investigation
Get images around a specific time:
```json
{
  "day1": "20231215",
  "time1": "143000",
  "day2": "20231215",
  "time2": "150000"
}
```

## Rate Limiting
No specific rate limiting is implemented, but consider implementing client-side throttling for high-frequency requests.

## Security Notes
- All requests require valid authentication
- Images are served through the authenticated media endpoint
- Ensure proper access control for sensitive camera feeds

## Troubleshooting

### Common Issues

1. **No images returned**
   - Check if the camera directory exists
   - Verify the date/time range contains actual images
   - Ensure proper authentication

2. **Authentication errors**
   - Verify the Authorization header is included
   - Check if the token is valid and not expired

3. **Invalid date/time format**
   - Ensure dates are in YYYYMMDD format
   - Ensure times are in HHMMSS format
   - Check for leading zeros (e.g., "08" not "8")

### Debug Tips
- Use the `autoCalculated` field to verify if your end time was auto-calculated
- Check the `dateRange` field for human-readable time ranges
- Verify the `path` field for correct image URL construction

## Version History
- **v1.0** - Initial release with full date range support
- **v1.1** - Added auto-calculation feature for 1-hour ranges
- **v1.2** - Added `autoCalculated` flag and improved error handling
