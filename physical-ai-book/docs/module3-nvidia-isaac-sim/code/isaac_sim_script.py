```python
import omni.isaac.core.utils.nucleus as nucleus_utils
from omni.isaac.kit import SimulationApp

# This is a sample script for setting up a basic Isaac Sim environment.
# It demonstrates loading a robot, creating a simple environment, and setting up basic physics.

# Start the simulation app
config = {"headless": False}
simulation_app = SimulationApp(config)

from omni.isaac.core import World
from omni.isaac.core.objects import DynamicCuboid
from omni.isaac.franka import Franka

class IsaacSimEnvironment:
    def __init__(self):
        self.world = World(stage_units_in_meters=1.0)
        self.world.scene.add_default_ground_plane()

    def load_robot(self):
        # Example: Load a Franka Emika Panda robot
        # Replace with your humanoid robot model if available
        robot_path = nucleus_utils.get_assets_root_path() + "/Isaac/Robots/Franka/franka_alt_fingers.usd"
        self.franka = self.world.scene.add(Franka(prim_path="/World/Franka", 
                                                name="franka_robot", 
                                                usd_path=robot_path,
                                                position=(0.0, 0.0, 0.0)))
        self.world.reset()

    def create_environment(self):
        # Add a simple cuboid obstacle
        cuboid = self.world.scene.add(DynamicCuboid(
            prim_path="/World/random_cube",
            name="random_cube",
            position=[0.5, 0.5, 0.25],
            scale=[0.5, 0.5, 0.5],
            color=[[0.0, 0.0, 1.0]],
        ))
        print(f"Cuboid created at {cuboid.get_world_pose()[0]}")

    def run_simulation(self):
        self.world.reset()
        self.load_robot()
        self.create_environment()

        # Simulate for a few steps
        for i in range(500):
            self.world.step(render=True)
            if i % 50 == 0:
                print(f"Simulation step {i}")

        self.simulation_app.close()

if __name__ == "__main__":
    env = IsaacSimEnvironment()
    env.run_simulation()
```