#!/usr/bin/env python3
import http.server
import socketserver
import socket
import webbrowser
from urllib.parse import urlparse

# Configuration
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Get local IP address
def get_local_ip():
    try:
        # Create a socket to get the local IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Doesn't need to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
        s.close()
    except Exception:
        IP = '127.0.0.1'
    return IP

# Create server - binds to all interfaces (0.0.0.0) to allow external connections
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    local_ip = get_local_ip()
    local_url = f"http://{local_ip}:{PORT}"
    localhost_url = f"http://localhost:{PORT}"
    
    print(f"\nServing at:")
    print(f"- Local URL: {localhost_url}")
    print(f"- Network URL (for external devices): {local_url}")
    print("\nUse the Network URL to access from any device when connected to the same WiFi")
    print(f"Note: Make sure your firewall allows incoming connections on port {PORT}")
    print("\nPress Ctrl+C to stop the server")
    
    # Open browser automatically
    webbrowser.open(localhost_url)
    
    # Start server
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()