import chromadb
from chromadb.utils import embedding_functions

class FrameIndexer:
    def __init__(self):
        # Local persistent storage for the index
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="drone_frames", 
            embedding_function=self.embedding_fn
        )

    def index_frame(self, frame_id, description, metadata):
        """Stores a frame description and its telemetry metadata."""
        self.collection.add(
            ids=[str(frame_id)],
            documents=[description],
            metadatas=[metadata]
        )

    def search_frames(self, query, n_results=3):
        """Finds frames based on a natural language query (e.g., 'blue truck')."""
        return self.collection.query(query_texts=[query], n_results=n_results)