import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

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