```mermaid
graph TD
    A[Camera Input] --> B{Feature Extraction & Matching}
    B --> C[Visual Odometry]
    C --> D[Local Map Update]
    D --> E[Pose Graph]
    E --> F{Loop Closure Detection}
    F -- Loop Detected --> G[Global Optimization (Bundle Adjustment)]
    G --> H[Consistent Map & Poses]
    F -- No Loop --> E
    A --> J[IMU Input (Optional)]
    J --> C
    H --> K[Localization Output]
    H --> L[Map Output]
    subgraph Front-end
        A
        B
        C
        D
        J
    end
    subgraph Back-end
        E
        F
        G
    end
    subgraph Outputs
        K
        L
    end
```