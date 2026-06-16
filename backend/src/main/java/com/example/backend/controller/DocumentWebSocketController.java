package com.example.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class DocumentWebSocketController {

    // Listens for messages sent to /app/document/{documentId}
    @MessageMapping("/document/{documentId}")
    // Broadcasts the return value to /topic/document/{documentId}
    @SendTo("/topic/document/{documentId}")
    public Map<String, String> handleDocumentUpdate(@DestinationVariable String documentId, Map<String, String> payload) {
        // We simply forward the payload (which will contain the HTML content and sender ID) to all subscribers
        return payload; 
    }
}