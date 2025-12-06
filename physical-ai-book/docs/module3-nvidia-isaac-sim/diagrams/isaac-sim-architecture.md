```mermaid
graph TD
    A[Isaac Sim Platform] --> B(USD Scene Description)
    B --> C{Core Simulation Engine}
    C --> D[Physics Engine]
    C --> E[Rendering Engine]
    C --> F[Sensor Simulation]
    F --> G[Camera Data]
    F --> H[LiDAR Data]
    F --> I[IMU Data]
    C --> J[ROS 2 Bridge]
    J --> K[ROS 2 Nodes (Isaac ROS, Nav2, VSLAM)]
    K --> L[Robot Control Commands]
    L --> M[Humanoid Robot Model]
    M --> C
    J --> G
    J --> H
    J --> I
    subgraph Isaac Sim Ecosystem
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
    end
    subgraph ROS 2 / External Systems
        K
        L
        M
    end
```