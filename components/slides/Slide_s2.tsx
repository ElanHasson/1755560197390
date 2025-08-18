import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function Slide() {
  const markdown = `- **Dev environment as code**
  - Declarative, versioned setup defined by the Dev Container Specification (containers.dev)
  - A devcontainer.json declares tools, runtimes, extensions, ports, and setup scripts
  - Runs consistently in VS Code Remote - Containers, GitHub Codespaces, or Dev Container CLI

- **Why it matters**
  - Uniformity across macOS/Windows/Linux → fewer “works on my machine” issues
  - Repeatability across machines, branches, and CI
  - Speed: faster onboarding and context switches with prebuilds and lifecycle hooks
  - Portability: config lives in the repo; great for teams and open source

- **Minimal example**
\`\`\`json
{
  "name": "Node Dev",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" }
  },
  "postCreateCommand": "npm ci",
  "customizations": {
    "vscode": { "extensions": ["dbaeumer.vscode-eslint"] }
  }
}
\`\`\`

\`\`\`mermaid
flowchart LR
  Repo[Repo with .devcontainer] --> Manifest[devcontainer.json + optional Dockerfile/Features]
  Manifest --> Image[Containerized dev image]
  Image --> Local[VS Code Remote - Containers]
  Image --> Cloud[GitHub Codespaces]
  Image --> CI[Dev Container CLI in CI]
  Local --> Same[Same tools, versions, extensions]
  Cloud --> Same
  CI --> Same
\`\`\`

- **Key outcomes**
  - Hours-to-minutes onboarding; fewer env-related bugs
  - Consistent app + DB via optional docker-compose
  - Clear, auditable environment definition in version control`;
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
      <h1>What and Why: Dev environment as code</h1>
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