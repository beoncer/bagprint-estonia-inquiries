<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Leatex.ee Sitemap</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; }
          .stats { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
          th { background: #dc2626; color: white; font-weight: bold; }
          tr:hover { background: #f8f9fa; }
          .url { color: #1d4ed8; text-decoration: none; }
          .url:hover { text-decoration: underline; }
          .priority { text-align: center; }
          .high { color: #059669; font-weight: bold; }
          .medium { color: #d97706; }
          .low { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Leatex.ee Sitemap</h1>
          <div class="stats">
            <p><strong>Total URLs:</strong> <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
            <p><strong>Last Generated:</strong> <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/></p>
          </div>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}" class="url">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td class="priority">
                    <xsl:attribute name="class">
                      priority
                      <xsl:choose>
                        <xsl:when test="sitemap:priority &gt;= 0.8"> high</xsl:when>
                        <xsl:when test="sitemap:priority &gt;= 0.5"> medium</xsl:when>
                        <xsl:otherwise> low</xsl:otherwise>
                      </xsl:choose>
                    </xsl:attribute>
                    <xsl:value-of select="sitemap:priority"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>