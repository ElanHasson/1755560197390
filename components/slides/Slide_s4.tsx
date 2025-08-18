import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function Slide() {
  const markdown = `- Best practices that unlock speed:
  - Pin everything: base image tags and Feature versions to eliminate surprise drift.
  - Use Features first, keep images lean, and run as a non-root remoteUser.
  - Split lifecycle hooks: postCreate for one-time installs, postStart for per-run tasks.
  - Prebuild in CI/Codespaces to cache image layers and dependencies.
  - Compose for app + DB to standardize local integration tests.

- Example: fast, repeatable setup
\`\`\`json
{
  "name": "Web + API",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu-22.04",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" },
    "ghcr.io/devcontainers/features/python:1": { "version": "3.11" }
  },
  "remoteUser": "vscode",
  "postCreateCommand": "npm ci && pip install -r requirements.txt",
  "postStartCommand": "npm run db:migrate",
  "forwardPorts": [3000],
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint", "ms-python.python"]
    }
  }
}
\`\`\`

- Where the time savings come from
\`\`\`mermaid
flowchart LR
A[Clone repo] --> B[Open in Dev Container]
B --> C{Prebuild available?}
C -- No --> D[Build image + install deps\n10–20 min first run]
C -- Yes --> E[Pull prebuilt image + cached deps\n<1–2 min]
D --> F[Ready to code]
E --> F
F --> G[Switch branch or repo]
G --> H[Rebuild only what's changed\n~1–3 min]
\`\`\`

- Measurable impact
  - Onboarding: hours/days → minutes
  - Context switching: 30–60 min → ~2–5 min
  - Fewer env bugs: consistent toolchains reduce “works on my machine” time`;
  const mermaidRef = useRef(0);
  
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#5a67d8',
        secondaryColor: '#764ba2',
        tertiaryColor: '#667eea',
        background: '#1a202c',
        mainBkg: '#2d3748',
        secondBkg: '#4a5568',
        tertiaryBkg: '#718096',
        textColor: '#fff',
        nodeTextColor: '#fff',
      }
    });
    
    // Find and render mermaid diagrams
    const renderDiagrams = async () => {
      const diagrams = document.querySelectorAll('.language-mermaid');
      for (let i = 0; i < diagrams.length; i++) {
        const element = diagrams[i];
        const graphDefinition = element.textContent;
        const id = `mermaid-${mermaidRef.current++}`;
        
        try {
          const { svg } = await mermaid.render(id, graphDefinition);
          element.innerHTML = svg;
          element.classList.remove('language-mermaid');
          element.classList.add('mermaid-rendered');
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };
    
    renderDiagrams();
  }, [markdown]);
  
  return (
    <div className="slide markdown-slide">
      <h1>Best practices + where the time savings come from</h1>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, className, children, ...props}: any) {
            const match = /language-(w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !className;
            
            if (!isInline && language === 'mermaid') {
              return (
                <pre className="language-mermaid">
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
              );
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}