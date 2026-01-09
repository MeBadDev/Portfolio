import React from 'react';
import Topbar from '../components/Topbar';

interface DevlogRenderData {
  title: string;
  slug: string;
  dateStr: string;
  timeSpent?: number;
  contentHtml: string;
}

interface StaticProjectLayoutProps {
  title: string;
  descriptionHtml: string;
  status: string;
  statusColor: string;
  demoLink?: string;
  repoLink?: string;
  totalTimeSpent: number;
  devlogs: DevlogRenderData[];
  cssLinks: string[];
  markdownCss: string;
  highlightCss: string;
  siteUrl?: string;
  slug: string;
}

export const StaticProjectLayout: React.FC<StaticProjectLayoutProps> = ({
  title,
  descriptionHtml,
  status,
  statusColor,
  demoLink,
  repoLink,
  totalTimeSpent,
  devlogs,
  cssLinks,
  markdownCss,
  highlightCss
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${title} - Project - MeBadDev`}</title>
        
        {/* Open Graph / Twitter could be added here similar to Blog Layout */}

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
                max-width: 56rem;
                margin: 2rem auto;
                padding: 0 1rem;
            }

            .project-header {
                background: white;
                border: 4px solid black;
                padding: 2rem;
                margin-bottom: 2rem;
                box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
            }
            
            .project-title {
                font-size: 3rem;
                margin: 0;
                line-height: 1;
            }
            
            .project-status {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                color: white;
                font-weight: bold;
                background-color: ${statusColor};
                margin-top: 1rem;
                font-size: 1.2rem;
            }

            .project-links {
                margin-top: 1rem;
                display: flex;
                gap: 1rem;
            }
            
            .project-link {
                color: #2563eb;
                text-decoration: underline;
                font-size: 1.25rem;
            }

            .devlogs-container {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .devlog-entry {
                background: white;
                border: 4px solid black;
                padding: 2rem;
                box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
            }

            .devlog-header {
                margin-bottom: 1.5rem;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 1rem;
            }

            .devlog-header h3 {
                margin: 0 0 0.5rem 0;
                font-size: 2rem;
            }

            .devlog-meta {
                color: #52525b;
                font-size: 1.25rem;
            }

            .separator {
                font-weight: bold;
                margin: 0 0.5rem;
            }

            .back-link {
              color: #f4f4f5;
              text-decoration: underline;
              font-size: 1.5rem;
              display: inline-block;
              margin-bottom: 2rem;
              background: #18181b;
              padding: 0.5rem 1rem;
              border: 2px solid #3f3f46; 
            }

            ${markdownCss}
            ${highlightCss}
            
            /* Override markdown css for this context */
            .markdown-body {
                font-family: inherit !important;
            }
        `}} />
      </head>
      <body>
        <Topbar />

        <div className="content-wrapper">
          <a href="/projects" className="back-link">← Back to Projects</a>
          
          <div className="project-header">
              <h1 className="project-title">{title}</h1>
              <span className="project-status">{status}</span>
              {totalTimeSpent > 0 && (
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#4b5563' }}>
                  Total Time Spent: {totalTimeSpent} hours
                </div>
              )}
              <div 
                style={{ fontSize: '1.5rem', marginTop: '1rem' }} 
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
              />
              
              <div className="project-links">
                  {demoLink && <a href={demoLink} className="project-link" target="_blank" rel="noreferrer">Live Demo</a>}
                  {repoLink && <a href={repoLink} className="project-link" target="_blank" rel="noreferrer">Source Code</a>}
              </div>
          </div>

          <div className="devlogs-container">
              <h2 style={{ color: 'white', textShadow: '2px 2px 0 #000', fontSize: '2.5rem', marginBottom: '1rem' }}>Devlogs</h2>
              {devlogs.length > 0 ? (
                devlogs.map((log) => (
                  <div key={log.slug} className="devlog-entry" id={log.slug}>
                      <div className="devlog-header">
                          <h3>{log.title}</h3>
                          <div className="devlog-meta">
                              <span className="date">Written on {log.dateStr}</span>
                              {log.timeSpent ? (
                                <>
                                  <span className="separator">•</span>
                                  <span className="time-spent">Time spent: {log.timeSpent} hours</span>
                                </>
                              ) : null}
                          </div>
                      </div>
                      <div 
                        className="markdown-body"
                        dangerouslySetInnerHTML={{ __html: log.contentHtml }}
                      />
                  </div>
                ))
              ) : (
                <div className="devlog-entry"><p>No devlogs yet.</p></div>
              )}
          </div>
        </div>
      </body>
    </html>
  );
};
