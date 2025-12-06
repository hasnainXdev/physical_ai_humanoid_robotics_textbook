```mermaid
graph TD
    A[Human Voice Command] --> B{Speech-to-Text (Whisper)}
    B --> C[Transcribed Text]
    C --> D{LLM (Cognitive Planner)}
    D --> E[High-Level Action Plan]
    
    subgraph Robot Perception
        F[Robot Sensors (Camera, LiDAR)] --> G(Perception Processing)
        G --> H[World State / Object Detections]
    end
    
    H --> D
    E --> I[Action Executor (ROS 2 Manipulation/Navigation)]
    I --> J[Robot Actuators]
    J --> F
    
    I --> K[Execution Feedback]
    K --> D

    D -- Clarification / Query --> A

    subgraph VLA Pipeline
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