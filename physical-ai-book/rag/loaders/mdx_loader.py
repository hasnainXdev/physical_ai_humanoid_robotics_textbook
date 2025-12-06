import os
import re
from typing import List, Dict

class MDXLoader:
    def __init__(self, path: str):
        self.path = path

    def load_documents(self) -> List[Dict[str, str]]:
        """Loads all .mdx files from the given path and extracts their content."""
        documents = []
        for root, _, files in os.walk(self.path):
            for file in files:
                if file.endswith(".mdx"):
                    file_path = os.path.join(root, file)
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    text_content = self._extract_text(content)
                    
                    documents.append({
                        "source": file_path,
                        "content": text_content
                    })
        return documents

    def _extract_text(self, mdx_content: str) -> str:
        """Extracts plain text from MDX content, removing frontmatter and JSX."""
        # Remove frontmatter
        content = re.sub(r'---\n(.*?)\n---', '', mdx_content, flags=re.DOTALL)
        # Remove JSX tags
        content = re.sub(r'<[^>]+>', '', content)
        # Remove markdown images and links
        content = re.sub(r'!\['.*?']\(.*\)', '', content)
        content = re.sub(r'\[(.*?)]\(.*\)', r'\1', content)
        # Remove mermaid diagrams
        content = re.sub(r'```mermaid.*?\n```', '', content, flags=re.DOTALL)
        # Clean up extra newlines
        content = re.sub(r'\n{2,}', '\n', content)
        return content.strip()

if __name__ == '__main__':
    # Example usage
    loader = MDXLoader("../../docs")
    docs = loader.load_documents()
    for doc in docs:
        print(f"Loaded document: {doc['source']}")
        # print(doc['content'])
