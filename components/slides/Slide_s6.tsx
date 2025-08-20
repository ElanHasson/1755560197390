import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- In chat: 0 = never used devcontainers/Codespaces, 1 = tried, 2 = weekly user
- Poll: What hurts most today?
  - A) Setup time/onboarding
  - B) “Works on my machine” bugs
  - C) Switching branches/machines
  - D) Cross‑OS consistency
- Why ask: Uniform, repeatable environments cut setup time and reduce env-related bugs
- We’ll tailor the demo: basics if many are new; advanced Features, prebuilds, and compose if many are experienced
\`\`\`json
{
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": { "ghcr.io/devcontainers/features/node:1": { "version": "20" } },
  "postCreateCommand": "npm ci"
}
\`\`\`
\`\`\`mermaid
flowchart LR
A[Quick pulse] --> B{Experience level}
B -->|0-1| C[Focus: what & why + basics]
B -->|2| D[Focus: Features, prebuilds, compose]
A --> E{Top pain}
E --> E1[Uniformity & repeatability]
E --> E2[Time savings & onboarding]
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Quick pulse check</h1>
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