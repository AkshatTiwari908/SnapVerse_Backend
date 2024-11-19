
    let socket;
    let isOnline = false;  // Flag to track if the user is online

    // Initialize socket connection when the page loads
    function initializeSocket() {
        const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage (or cookie)
        if (!token) {
            console.error('No JWT token found');
            return;
        }

        // Connect to the server with the JWT token
        socket = io('http://localhost:3000'/* , {
            auth: { token: token }  // Send JWT token for authentication
        } */);

        // Event: Connected to WebSocket server
        socket.on('connect', () => {
            isOnline = true;  // User is online and connected to WebSocket
            console.log('Connected to WebSocket');
            const userId = extractUserIdFromToken(token); 
            socket.emit('join', { userId });
        });

        socket.on('disconnect', () => {
            isOnline = false;  
            console.log('Disconnected from WebSocket');
        });

        socket.on('receiveMessage', (data) => {
            console.log('Received message:', data);
            displayMessage(data);
        });

        // Event: Undelivered messages received when reconnecting
        socket.on('undeliveredMessages', (messages) => {
            console.log('Undelivered messages:', messages);
            messages.forEach(displayMessage);
        });
    }

    // Function to extract userId from the JWT token (you can modify this based on how your token is structured)
    function extractUserIdFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token
        return payload.userId;  // Assuming the token has the userId
    }

    // Send a message to another user
    function sendMessage() {
        const senderId = extractUserIdFromToken(localStorage.getItem('jwtToken'));
        const receiverId = 'user456';  // Example receiver ID (this can vary based on who the user is chatting with)
        const messageContent = document.getElementById('messageInput').value;

        if (!messageContent.trim()) {
            alert('Message cannot be empty!');
            return;
        }

        if (isOnline) {
            // If the user is online, send the message via WebSocket
            socket.emit('sendMessage', { senderId, receiverId, messageContent });
            console.log('Message sent via WebSocket');
        } else {
            // If the user is offline, save the message via the REST API
            sendMessageViaAPI(senderId, receiverId, messageContent);
        }
        document.getElementById('messageInput').value = ''; // Clear the message input field
    }

    // Send message via REST API (for offline users)
    async function sendMessageViaAPI(senderId, receiverId, messageContent) {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderId, receiverId, messageContent }),
        });

        const result = await response.json();
        if (result.success) {
            console.log('Message saved to database (offline mode)');
        } else {
            console.log('Failed to send message via API');
        }
    }

    // Display a message in the chat box
    function displayMessage(data) {
        const chatBox = document.getElementById('chatBox');
        const message = document.createElement('div');
        message.textContent = `${data.senderId}: ${data.messageContent} (sent at ${new Date(data.timestamp).toLocaleString()})`;
        chatBox.appendChild(message);

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Initialize WebSocket connection when the page loads
    initializeSocket();

