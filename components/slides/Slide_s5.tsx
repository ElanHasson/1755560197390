import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

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
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Pitfalls and quick fixes</h1>
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
                <Mermaid chart={String(children).replace(/\n$/, '')} />
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