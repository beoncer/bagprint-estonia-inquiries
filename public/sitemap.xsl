<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>XML Sitemap</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            font-size: 14px;
            background-color: #0f172a;
            color: #e2e8f0;
            margin: 0;
            padding: 20px;
        }
        .wrap {
            max-width: 1200px;
            margin: 0 auto;
            background-color: #1e293b;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        .header {
            background-color: #dc2626;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #334155;
            border-radius: 6px;
            overflow: hidden;
        }
        th {
            background-color: #475569;
            color: #f1f5f9;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid #64748b;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #475569;
        }
        tr:hover {
            background-color: #3f4e5f;
        }
        .url {
            color: #60a5fa;
            text-decoration: none;
            word-break: break-all;
        }
        .url:hover {
            color: #93c5fd;
            text-decoration: underline;
        }
        .priority {
            text-align: center;
            font-weight: 600;
        }
        .priority-high { color: #10b981; }
        .priority-medium { color: #f59e0b; }
        .priority-low { color: #94a3b8; }
        .changefreq {
            text-align: center;
            text-transform: capitalize;
        }
        .lastmod {
            text-align: center;
            font-family: monospace;
            color: #cbd5e1;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #94a3b8;
            font-size: 12px;
            border-top: 1px solid #475569;
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="header">
            <h1>XML Sitemap</h1>
            <p>This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</p>
        </div>
        <div class="content">
            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Priority</th>
                        <th>Change Frequency</th>
                        <th>Last Modified</th>
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
                            <td class="priority">
                                <xsl:choose>
                                    <xsl:when test="sitemap:priority &gt;= 0.8">
                                        <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                                    </xsl:when>
                                    <xsl:when test="sitemap:priority &gt;= 0.5">
                                        <span class="priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <span class="priority-low"><xsl:value-of select="sitemap:priority"/></span>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </td>
                            <td class="changefreq">
                                <xsl:value-of select="sitemap:changefreq"/>
                            </td>
                            <td class="lastmod">
                                <xsl:value-of select="sitemap:lastmod"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                </tbody>
            </table>
        </div>
        <div class="footer">
            Generated on <xsl:value-of select="substring(string(current-dateTime()), 1, 19)"/>
        </div>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>