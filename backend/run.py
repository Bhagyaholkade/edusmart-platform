import os
import sys

# Granian can be run programmatically, but usually it's run via CLI.
# This runner can be used for quick debugging or setup.
if __name__ == "__main__":
    import subprocess
    print("Starting Granian server...")
    subprocess.run(["granian", "--interface", "asgi", "app.main:app", "--port", "5000", "--reload"])
