const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Only keep the submit-legal-case route, but without multer
router.post('/submit-legal-case', async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            phone, 
            preferredLanguage, 
            legalIssue, 
            caseDetails 
        } = req.body;

        console.log('Request body:', req.body);

        // Basic validation
        if (!fullName || !email || !phone || !legalIssue || !caseDetails) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields',
                receivedData: req.body
            });
        }

        // File info (using express-fileupload)
        let fileInfo = null;
        if (req.files && req.files.document) {
            const document = req.files.document;
            const uploadsDir = path.join(__dirname, '../uploads/documents');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExt = path.extname(document.name);
            const filename = `legal-doc-${uniqueSuffix}${fileExt}`;
            const filepath = path.join(uploadsDir, filename);
            
            // Move the file to uploads directory
            await document.mv(filepath);
            
            fileInfo = {
                filename: filename,
                originalname: document.name,
                path: filepath,
                mimetype: document.mimetype,
                size: document.size
            };
        }

        // Send data to Make.com webhook
        const response = await axios.post("https://hook.eu2.make.com/w5hhkqypyrb8kb69nlz4kxfh9v77591c", {
            fullName,
            email,
            phone,
            preferredLanguage,
            legalIssue,
            caseDetails,
            hasDocument: !!fileInfo,
            documentInfo: fileInfo,
            submitTime: new Date().toISOString()
        });
        console.log(response);
        // Generate a simple reference number for the case
        const caseReference = `CASE-${Date.now().toString().slice(-6)}`;

        res.status(200).json({ 
            success: true, 
            message: 'Form submitted successfully',
            caseReference: caseReference,
            receivedData: {
                fullName,
                email,
                phone,
                preferredLanguage,
                legalIssue,
                caseDetailsLength: caseDetails.length,
                hasFile: !!fileInfo
            }
        });
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit legal case',
            error: error.message || 'Failed to process submission'
        });
    }
});

// Simple route for getting all cases
router.get('/cases', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Feature coming soon',
        data: []
    });
});

// Simple route for getting a case by ID
router.get('/case/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Feature coming soon',
        data: null
    });
});

module.exports = router;


