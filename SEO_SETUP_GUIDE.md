# SEO Configuration Guide

## Overview

The website now includes a comprehensive SEO management system that allows you to configure SEO meta tags for each page through the admin panel. This system provides:

- **Dynamic SEO meta tags** that update based on the current page
- **Admin panel integration** for easy SEO management
- **Database-driven SEO data** stored in Supabase
- **Automatic meta tag updates** on page navigation

## How It Works

### 1. Database Structure

The SEO data is stored in the `seo_metadata` table with the following structure:

```sql
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL UNIQUE,      -- Page slug/identifier (unique)
  title TEXT,                     -- SEO title
  description TEXT,               -- Meta description
  keywords TEXT,                  -- Meta keywords
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Page Mapping

The system automatically maps URLs to page slugs:

| URL Path | Page Slug |
|----------|-----------|
| `/` | `home` |
| `/tooted` | `products` |
| `/riidest-kotid` | `cotton-bags` |
| `/paberkotid` | `paper-bags` |
| `/nooriga-kotid` | `drawstring-bags` |
| `/sussikotid` | `shoebags` |
| `/kontakt` | `contact` |
| `/meist` | `about` |
| `/portfoolio` | `portfolio` |
| `/blogi` | `blog` |

### 3. Dynamic SEO Component

The `DynamicSEO` component automatically:
- Detects the current page route
- Fetches SEO data from the database
- Updates meta tags in real-time
- Handles missing SEO data gracefully

## Admin Panel Usage

### Accessing SEO Configuration

1. Go to **Admin Panel** → **Pages**
2. Click the **Edit** button for any page
3. Navigate to the **SEO Settings** tab
4. Configure the SEO data:
   - **SEO Title**: Page title for search results (50-60 characters recommended)
   - **SEO Description**: Meta description (150-160 characters recommended)
   - **SEO Keywords**: Keywords separated by commas (optional)

### SEO Status Indicators

In the Pages admin table, you'll see SEO status indicators:

- 🟢 **Configured**: Page has SEO data set
- ⚪ **Not set**: No SEO data configured

### Best Practices

#### SEO Title
- Keep between 50-60 characters
- Include your brand name
- Be descriptive and relevant
- Example: `"Riidest Kotid - Kvaliteetsed Puuvillakotid | Leatex"`

#### SEO Description
- Keep between 150-160 characters
- Include a call-to-action
- Be compelling and informative
- Example: `"Kvaliteetsed riidest kotid ja puuvillakotid erinevates suurustes ja värvides. Kohandatud trükk ja personaliseerimine. Küsi pakkumist!"`

#### SEO Keywords
- Use relevant, specific keywords
- Separate with commas
- Don't overstuff (5-10 keywords max)
- Example: `"riidest kotid, puuvillakotid, kohandatud trükk, personaliseerimine, kvaliteet"`

## Technical Implementation

### Files Modified/Created

1. **`src/pages/admin/Pages.tsx`**
   - Added SEO configuration tabs
   - Integrated with `seo_metadata` table
   - Added SEO status indicators

2. **`src/components/seo/DynamicSEO.tsx`**
   - New component for dynamic meta tag updates
   - Route-to-slug mapping
   - Real-time SEO data fetching

3. **`src/App.tsx`**
   - Added DynamicSEO component to main app

4. **`supabase/sample_seo_data.sql`**
   - Sample SEO data for testing (with UPSERT)

5. **`supabase/check_seo_data.sql`**
   - Script to check existing SEO data

### How Dynamic SEO Works

1. **Route Detection**: Component detects current URL path
2. **Slug Mapping**: Maps URL to database page slug
3. **Data Fetching**: Queries `seo_metadata` table
4. **Meta Tag Updates**: Updates document meta tags
5. **Fallback Handling**: Uses default tags if no SEO data found

## Setting Up Sample Data

### Step 1: Check Existing Data
First, check what SEO data already exists:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the contents of `supabase/check_seo_data.sql`

This will show you what's already in the database.

### Step 2: Add Sample Data
To populate the database with sample SEO data:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the contents of `supabase/sample_seo_data.sql`

**Important**: This script uses UPSERT (INSERT ... ON CONFLICT) to handle existing data without causing duplicate key errors.

### Step 3: Verify Setup
After running the sample data script, run the check script again to verify everything was added correctly.

## Troubleshooting

### Common Issues

1. **Duplicate Key Error (23505)**
   - **Error**: `duplicate key value violates unique constraint "seo_metadata_page_key"`
   - **Solution**: Use the updated `sample_seo_data.sql` with UPSERT, or manually delete existing entries first
   - **Manual Fix**: 
     ```sql
     DELETE FROM seo_metadata WHERE page = 'home';
     -- Then run the sample data script
     ```

2. **SEO data not updating**
   - Check browser console for errors
   - Verify database connection
   - Ensure page slug matches URL mapping

3. **Meta tags not changing**
   - Clear browser cache
   - Check if DynamicSEO component is loaded
   - Verify Supabase permissions

4. **Admin panel errors**
   - Check Supabase RLS policies
   - Verify table structure
   - Check authentication status

### Debug Mode

To enable debug logging, add this to the DynamicSEO component:

```typescript
console.log('Current path:', location.pathname);
console.log('Page slug:', getCurrentPageSlug());
console.log('SEO data:', seoData);
```

## Testing the SEO System

### 1. Check Admin Panel
- Go to Admin → Pages
- Edit any page and check the SEO tab
- Verify SEO status indicators

### 2. Test Dynamic Updates
- Navigate between pages
- Check browser developer tools → Elements
- Verify meta tags update correctly

### 3. Verify Search Engine Compatibility
- Use Google's Rich Results Test
- Check Facebook Sharing Debugger
- Test Twitter Card Validator

## Performance Considerations

- SEO data is cached for 5 minutes
- Database queries are optimized
- Meta tag updates are efficient
- No impact on page load performance

## Future Enhancements

Potential improvements:
- SEO preview in admin panel
- Character count indicators
- Bulk SEO import/export
- SEO analytics integration
- Multi-language SEO support
- Schema.org structured data integration

## Support

For technical support or questions about the SEO system, refer to the admin manual or contact the development team. 