import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function Slide() {
  const markdown = `- Common pitfalls and quick fixes
  - Slow first build/start
    - Fix: Prebuild images; pin base image and Feature versions; move heavy OS/tool installs into Dockerfile layers.
  - File I/O slowness on macOS/Windows
    - Fix: Use cached mounts; keep node_modules in a named volume; prefer WSL2 on Windows.
  - ARM/x86 mismatch
    - Fix: Choose multi-arch images/features; only set platform as a last resort.
  - Secrets committed by accident
    - Fix: Use .env (git-ignored) and IDE/platform secret stores; never bake secrets into images.
  - Drift between dev and CI
    - Fix: Validate/build with Dev Container CLI in CI; pin versions; run tests inside the container.

\`\`\`yaml
docker-compose.yml
services:
  app:
    build: .
    volumes:
      - .:/workspace:cached          # faster bind mount
      - node_modules:/workspace/node_modules
    # Only if unavoidable (prefer multi-arch images first)
    platform: linux/amd64
volumes:
  node_modules:
\`\`\`

\`\`\`bash
# Validate in CI with Dev Container CLI
# (e.g., in GitHub Actions step)
devcontainer build --workspace-folder .
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . npm test
\`\`\`

\`\`\`mermaid
flowchart TD
  A[Symptom] --> B{Slow build?}
  B -->|Yes| B1[Prebuilds + cache in Dockerfile/Features]
  A --> C{File I/O slow?}
  C -->|Yes| C1[:cached mounts + named volumes + WSL2]
  A --> D{ARM/x86 mismatch?}
  D -->|Yes| D1[Use multi-arch images; fallback platform]
  A --> E{Secrets risk?}
  E -->|Yes| E1[.env + secret stores; never commit]
  A --> F{Dev/CI drift?}
  F -->|Yes| F1[Dev Container CLI in CI; pin versions]
\`\`\`
`;
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
      <h1>Pitfalls and quick fixes</h1>
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