import React from 'react';
import Topbar from '../components/Topbar';

interface StaticBlogLayoutProps {
  title: string;
  description: string;
  slug: string;
  dateStr: string;
  readingTime: number;
  contentHtml: string;
  cssLinks: string[];
  markdownCss: string;
  highlightCss: string;
  siteUrl?: string;
}

export const StaticBlogLayout: React.FC<StaticBlogLayoutProps> = ({
  title,
  description,
  slug,
  dateStr,
  readingTime,
  contentHtml,
  cssLinks,
  markdownCss,
  highlightCss,
  siteUrl = 'https://mebaddev.net',
}) => {
  const pageUrl = `${siteUrl}/blog/${slug}.html`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${title} - MeBadDev`}</title>
        <meta name="description" content={description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="MeBadDev" />

        {/* Twitter (i refuse to call it X)*/}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={pageUrl} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet" />
        
        {cssLinks.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}

        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0;
            padding: 0;
            font-family: 'Jersey 10', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
            background: linear-gradient(-45deg, rgb(54, 116, 181) 25%, rgb(87, 143, 202) 25%, rgb(87, 143, 202) 50%, rgb(54, 116, 181) 50%, rgb(54, 116, 181) 75%, rgb(87, 143, 202) 75%, rgb(87, 143, 202) 100%);
            background-size: 48px 48px;
            animation: pan 40s linear infinite;
            min-height: 100vh;
          }
          @keyframes pan {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 0%; }
          }
          
          .content-wrapper {
            max-width: 48rem;
            margin: 0 auto;
            padding: 1rem 1rem 2rem;
          }
          .back-link {
            color: #f4f4f5;
            text-decoration: underline;
            font-size: 1.25rem;
            display: inline-block;
            margin-bottom: 1rem;
          }
          .article-container {
            background: white;
            color: #18181b;
            border: 6px solid #000000;
            padding: 2rem;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
          }
          .article-title {
            font-size: 3.75rem;
            margin-bottom: 1rem;
            color: #111827;
          }
          .blog-meta {
            font-size: 1.25rem;
            color: #52525b;
            margin-bottom: 2rem;
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: wrap;
          }
          .separator {
            font-weight: bold;
          }
          ${markdownCss}
          ${highlightCss}
        `}} />
      </head>
      <body>
        <Topbar />
        
        <div className="content-wrapper">
          <a href="/blogs" className="back-link">← Back to Blogs</a>
          <div className="article-container">
            <h1 className="article-title">{title}</h1>
            <div className="blog-meta">
              <span>Written on {dateStr}</span>
              <span className="separator">•</span>
              <span className="reading-time">~{readingTime} minute read</span>
            </div>
            <article 
              className="markdown-body" 
              dangerouslySetInnerHTML={{ __html: contentHtml }} 
            />
          </div>
        </div>
      </body>
    </html>
  );
};

export default StaticBlogLayout;
