# This code block provides examples of LLM prompt engineering strategies for robotics.
# The goal is to guide the LLM to generate executable plans or commands for a robot.

class LLMPromptEngineer:
    def __init__(self, robot_capabilities, environment_context):
        self.robot_capabilities = robot_capabilities # e.g., list of functions: navigate, grasp, open_door
        self.environment_context = environment_context # e.g., list of objects, locations

    def generate_task_decomposition_prompt(self, user_command):
        # Prompt for breaking down a complex command into sub-tasks
        prompt = f"""
        You are a robotic task planner. Your goal is to break down complex human commands
        into a sequence of simpler, high-level robotic actions. 
        
        Here are the robot's available capabilities:
        {', '.join(self.robot_capabilities)}

        Here is the current environment context:
        {', '.join(self.environment_context)}
        
        Decompose the following command into a numbered list of high-level steps, using only the available capabilities and referencing objects/locations from the environment context:
        Command: "{user_command}"
        """
        return prompt

    def generate_action_execution_prompt(self, high_level_action, current_robot_state, perception_feedback):
        # Prompt for refining a high-level action into a specific, executable command
        prompt = f"""
        You are a low-level robotic action generator. Given a high-level action, the current robot state,
        and real-time perception feedback, generate the exact, unambiguous command for the robot to execute.
        
        Robot Capabilities: {self.robot_capabilities}
        High-Level Action: "{high_level_action}"
        Current Robot State: "{current_robot_state}"
        Perception Feedback: "{perception_feedback}"
        
        Generate the precise robot command (e.g., function call with arguments): """
        return prompt
        
    def generate_error_recovery_prompt(self, failed_action, error_message, current_robot_state, perception_feedback):
        # Prompt for guiding the LLM to suggest recovery strategies
        prompt = f"""
        The robot attempted to execute an action but failed. Analyze the situation and suggest
        a recovery strategy or an alternative action. 
        
        Failed Action: "{failed_action}"
        Error Message: "{error_message}"
        Current Robot State: "{current_robot_state}"
        Perception Feedback: "{perception_feedback}"
        
        Suggest a recovery plan in a numbered list:
        """
        return prompt

# Example Usage:
robot_caps = ["navigate(location)", "grasp(object_name)", "release(object_name)", "open_door(door_name)"]
env_context = ["kitchen", "living_room", "red_cube", "blue_sphere", "kitchen_door"]

prompt_engineer = LLMPromptEngineer(robot_caps, env_context)

# --- Task Decomposition Example ---
user_cmd = "Go to the kitchen, open the door, and bring me the blue sphere."
decomp_prompt = prompt_engineer.generate_task_decomposition_prompt(user_cmd)
print("\n--- Task Decomposition Prompt ---")
print(decomp_prompt)
# LLM Response might be:
# 1. navigate(kitchen)
# 2. open_door(kitchen_door)
# 3. grasp(blue_sphere)
# 4. navigate(human_location)

# --- Action Execution Example ---
high_level_action = "grasp(blue_sphere)"
current_state = "robot_at_kitchen_counter, blue_sphere_at_kitchen_counter"
perception = "blue_sphere_detected_at_pose(x,y,z)"
exec_prompt = prompt_engineer.generate_action_execution_prompt(high_level_action, current_state, perception)
print("\n--- Action Execution Prompt ---")
print(exec_prompt)
# LLM Response might be:
# execute_grasp_primitive(target_pose=(x,y,z), gripper_force=0.5)

# --- Error Recovery Example ---
failed_act = "grasp(blue_sphere)"
error_msg = "Grasp failed: object slipped."
recovery_prompt = prompt_engineer.generate_error_recovery_prompt(failed_act, error_msg, current_state, perception)
print("\n--- Error Recovery Prompt ---")
print(recovery_prompt)
# LLM Response might be:
# 1. retry_grasp(blue_sphere, increased_force=0.7)
# 2. if still fails, ask_human_for_help("Cannot grasp blue sphere.")
