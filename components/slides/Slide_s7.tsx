import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function Slide() {
  const markdown = `**Key takeaways**
- Devcontainers = development environment as code: uniform, repeatable, portable
- Fewer “works on my machine” issues; faster onboarding and context switches
- Scales from single-service to full-stack (compose) and aligns dev with CI
- Prebuilds and Features cut setup time and drift

**Next steps**
- Start minimal, then layer in Features, compose, and prebuilds
- Validate builds in CI with Dev Container CLI
- Standardize editor settings and extensions in devcontainer.json

**Starter devcontainer.json**
\`\`\`json
{
  "name": "Node Dev",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" }
  },
  "postCreateCommand": "npm ci"
}
\`\`\`

**Adoption flow**
\`\`\`mermaid
flowchart TD
  A[Repo] --> B[Add .devcontainer/devcontainer.json]
  B --> C[Reopen in Container]
  C --> D[Add Features and editor settings]
  D --> E[Compose for services]
  E --> F[Enable prebuilds]
  F --> G[Validate in CI with Dev Container CLI]
\`\`\`

**Resources**
- Dev Container Spec: https://containers.dev
- Features catalog: https://github.com/devcontainers/features
- Dev Container CLI: https://github.com/devcontainers/cli
- Codespaces docs: https://docs.github.com/codespaces`;
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
      <h1>Wrap-up: Key takeaways and next steps</h1>
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