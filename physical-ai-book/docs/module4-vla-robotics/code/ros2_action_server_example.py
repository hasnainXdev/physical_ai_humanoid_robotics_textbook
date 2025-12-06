```python
# This code block demonstrates a basic ROS 2 Action Server and Client for a simple robot task.
# This pattern is crucial for long-running, goal-oriented tasks in VLA pipelines.

import rclpy
from rclpy.action import ActionServer, ActionClient
from rclpy.node import Node

# Import your custom action definition. 
# For this example, let's assume you have a custom action named 'PickAndPlace.action'
# in a package called 'robot_actions' with fields:
#   int32 object_id
#   geometry_msgs/Pose target_pose
# ---
#   bool success
# ---
#   float32 progress

# For demonstration, we'll use a placeholder structure.
# In a real scenario, you'd generate these from your .action file.
class PickAndPlace_Feedback:
    def __init__(self, progress):
        self.progress = progress

class PickAndPlace_Result:
    def __init__(self, success):
        self.success = success

class PickAndPlace_Goal:
    def __init__(self, object_id, target_pose):
        self.object_id = object_id
        self.target_pose = target_pose

class PickAndPlace_Action:
    Goal = PickAndPlace_Goal
    Result = PickAndPlace_Result
    Feedback = PickAndPlace_Feedback

class RobotActionServer(Node):

    def __init__(self):
        super().__init__('robot_action_server')
        self._action_server = ActionServer(
            self,
            PickAndPlace_Action, # Replace with your generated action type
            'pick_and_place',
            self.execute_callback)
        self.get_logger().info('PickAndPlace Action Server started.')

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')

        object_id = goal_handle.request.object_id
        target_pose = goal_handle.request.target_pose

        self.get_logger().info(f'Received pick and place command for object ID {object_id} to pose {target_pose}')

        # --- Simulate robot execution ---
        feedback_msg = PickAndPlace_Feedback(0.0)
        for i in range(1, 11):
            feedback_msg.progress = float(i / 10.0)
            self.get_logger().info(f'Feedback: {feedback_msg.progress * 100}% complete')
            goal_handle.publish_feedback(feedback_msg)
            # In a real robot, this would involve complex motion planning, perception, and control
            # For simplicity, we just sleep
            rclpy.sleep(0.5) 
        # --- End simulation ---

        goal_handle.succeed()
        result = PickAndPlace_Result(True)
        self.get_logger().info('Goal succeeded!')
        return result

class RobotActionClient(Node):

    def __init__(self):
        super().__init__('robot_action_client')
        self._action_client = ActionClient(
            self,
            PickAndPlace_Action, # Replace with your generated action type
            'pick_and_place')
        self.get_logger().info('PickAndPlace Action Client started.')

    def send_goal(self, object_id, target_pose):
        self.get_logger().info('Waiting for action server...')
        self._action_client.wait_for_server()

        goal_msg = PickAndPlace_Goal(object_id, target_pose)
        self.get_logger().info(f'Sending goal: pick object {object_id} to {target_pose}')

        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback)

        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected :(')
            return

        self.get_logger().info('Goal accepted :)')

        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def get_result_callback(self, future):
        result = future.result().result
        self.get_logger().info(f'Result: {result.success}')
        rclpy.shutdown()

    def feedback_callback(self, feedback_msg):
        self.get_logger().info(f'Received feedback: {feedback_msg.feedback.progress * 100}%')

def main(args=None):
    rclpy.init(args=args)

    # Start the server in a separate thread for demonstration
    server_node = RobotActionServer()
    executor = rclpy.executors.MultiThreadedExecutor()
    executor.add_node(server_node)
    server_thread = threading.Thread(target=executor.spin_once, args=(1,))
    server_thread.daemon = True
    server_thread.start()

    client_node = RobotActionClient()
    # Example goal: pick object 1 to a placeholder pose
    class Pose:
        def __init__(self, x, y, z):
            self.x = x
            self.y = y
            self.z = z
    target_pose_example = Pose(x=1.0, y=0.5, z=0.1)

    client_node.send_goal(1, target_pose_example)
    rclpy.spin(client_node) # Spin the client to receive response

    # Clean up
    server_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```