from pydantic import BaseModel


class SourceCitation(BaseModel):
    """
    SourceCitation entity representing document citations
    """
    document_id: str
    source_reference: str
    quoted_text: str