```mermaid
graph TD
    A[Human Goal (Natural Language)] --> B{LLM: Goal Interpretation & Decomposition}
    B --> C[Hierarchical Plan (Sub-goals)]
    
    subgraph World Model
        D[Perceived World State] --> E(Knowledge Base / Scene Graph)
        E --> B
        E --> F
    end
    
    C --> F{LLM: Action Sequencing & Constraint Checking}
    F --> G[Low-Level Executable Actions]
    
    G --> H[Robot Action Execution]
    H --> I[Physical Robot]
    
    I --> D
    
    H -- Execution Feedback --> J[Monitor & Evaluate Execution]
    J -- Error / Deviation --> B
    J -- Success --> K[Task Completed]
    
    B -- Clarification --> A

    subgraph Cognitive Planner Flow
        A
        B
        C
        D
        E
        F
        G
        H
        I
        J
        K
    end
```