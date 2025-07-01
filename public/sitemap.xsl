
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - BagPrint.ee</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: #545353;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
          }
          table {
            border: none;
            border-collapse: collapse;
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th {
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            background: #dc2626;
            text-align: left;
            padding: 12px;
          }
          td {
            padding: 8px 12px;
            border-bottom: 1px solid #f0f0f0;
          }
          tr:hover {
            background: #f8f9fa;
          }
          .url {
            color: #0066cc;
            text-decoration: none;
          }
          .url:hover {
            text-decoration: underline;
          }
          .priority {
            text-align: center;
            color: #666;
          }
          .changefreq {
            text-align: center;
            color: #666;
          }
          .lastmod {
            text-align: center;
            color: #666;
          }
          .header {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header h1 {
            color: #dc2626;
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .header p {
            color: #666;
            margin: 0;
          }
          .stats {
            background: white;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>XML Sitemap</h1>
          <p>This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs for BagPrint.ee</p>
        </div>
        
        <div class="stats">
          Generated on <xsl:value-of select="format-date(current-date(), '[D1] [MNn] [Y]')"/> | 
          <a href="https://bagprint.ee" style="color: #dc2626; text-decoration: none;">← Back to BagPrint.ee</a>
        </div>
        
        <table>
          <tr>
            <th>URL</th>
            <th>Priority</th>
            <th>Change Frequency</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <xsl:variable name="itemURL">
                  <xsl:value-of select="sitemap:loc"/>
                </xsl:variable>
                <a href="{$itemURL}" class="url">
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>
              <td class="priority">
                <xsl:value-of select="concat(sitemap:priority*100,'%')"/>
              </td>
              <td class="changefreq">
                <xsl:value-of select="sitemap:changefreq"/>
              </td>
              <td class="lastmod">
                <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
