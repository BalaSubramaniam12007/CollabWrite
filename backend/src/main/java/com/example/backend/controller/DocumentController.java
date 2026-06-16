package com.example.backend.controller;

import com.example.backend.entity.Document;
import com.example.backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;

    public DocumentController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    // 1. Create a new document
    @PostMapping
    public Document createDocument(@RequestBody Document document) {
        return documentRepository.save(document);
    }

    // 2. Get all documents
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // 3. Get a specific document
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Update a document
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestBody Document updatedDocument
    ) {
        return documentRepository.findById(id)
                .map(existing -> {
                    if (updatedDocument.getTitle() != null) {
                        existing.setTitle(updatedDocument.getTitle());
                    }
                    if (updatedDocument.getContent() != null) {
                        existing.setContent(updatedDocument.getContent());
                    }
                    return ResponseEntity.ok(documentRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        if (!documentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        documentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}