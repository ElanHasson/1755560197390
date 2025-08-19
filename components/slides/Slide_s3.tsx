import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- Why this demo matters
  - Uniform, repeatable dev env in minutes
  - Eliminate "works on my machine" by encoding tools as code
  - Fast onboarding and context switching
- Steps we’ll do live
  1) Add .devcontainer/devcontainer.json
  2) Reopen in Container (VS Code)
  3) Run app; verify port forward

- Minimal config (Node via Feature, pinned)
\`\`\`json
{
  "name": "Node Dev",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" }
  },
  "postCreateCommand": "npm ci",
  "forwardPorts": [3000],
  "customizations": {
    "vscode": { "extensions": ["dbaeumer.vscode-eslint"] }
  }
}
\`\`\`
- App files
\`\`\`json
// package.json
{
  "name": "hello-devcontainer",
  "version": "1.0.0",
  "private": true,
  "scripts": { "start": "node index.js" },
  "dependencies": { "express": "^4.19.2" }
}
\`\`\`
\`\`\`js
// index.js
const express = require('express');
const app = express();
app.get('/', (_req, res) => res.send('Hello from a reproducible devcontainer!'));
app.listen(3000, () => console.log('Up on http://localhost:3000'));
\`\`\`
- Quick start commands
\`\`\`bash
# create repo skeleton
mkdir hello-devcontainer && cd hello-devcontainer && git init
mkdir -p .devcontainer
# add devcontainer.json, package.json, index.js (as above)
code .   # VS Code → Command Palette → Dev Containers: Reopen in Container
\`\`\`
- Headless/CI equivalent
\`\`\`bash
npx @devcontainers/cli up --workspace-folder .
\`\`\`
\`\`\`mermaid
flowchart LR
  A[Repo + .devcontainer/devcontainer.json] --> B[VS Code: Reopen in Container]
  B --> C[Build image + install Features]
  C --> D[postCreateCommand: npm ci]
  D --> E[Ready: uniform env + ports forwarded]
  E --> F[Repeatable on any machine/CI]
\`\`\`
- Key outcomes
  - Same tools and versions for everyone
  - One-click start; seconds to switch contexts
  - Config lives with code; easy to share and review`;
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
      <h1>Live Build: From zero to a working devcontainer</h1>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Handle inline code
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <pre className="language-mermaid">
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
              );
            }
            
            // Handle code blocks with syntax highlighting
            if (language) {
              return (
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  showLineNumbers={true}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            
            // Default code block without highlighting
            return (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}