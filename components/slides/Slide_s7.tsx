import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

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
  
  return (
    <div className="slide markdown-slide">
      <h1>Wrap-up: Key takeaways and next steps</h1>
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