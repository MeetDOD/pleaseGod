import { Request, Response } from "express";
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Controller function to handle legal case submission
exports.submitLegalCase = async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            phone, 
            preferredLanguage, 
            legalIssue, 
            caseDetails 
        } = req.body;

        // Basic validation
        if (!fullName || !email || !phone || !legalIssue || !caseDetails) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // Handle file information if any were uploaded
        let fileInfo = null;
        if (req.file) {
            fileInfo = {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
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
            documentInfo: fileInfo ? {
                name: fileInfo.originalname,
                type: fileInfo.mimetype,
                size: fileInfo.size
            } : null,
            submitTime: new Date().toISOString()
        });

        // Generate a simple reference number for the case
        const caseReference = `CASE-${Date.now().toString().slice(-6)}`;

        // Store case data in database (you can implement this later)
        // const newCase = await LegalCase.create({...})

        res.status(200).json({ 
            success: true, 
            message: 'Form submitted successfully',
            caseReference: caseReference,
            data: response.data 
        });
    } catch (error) {
        console.error('Error processing legal case submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit legal case',
            error: error.message || 'Failed to send data to Make.com' 
        });
    }
};

// Get all legal cases
exports.getAllLegalCases = async (req, res) => {
    try {
        // You would implement database retrieval here
        // const cases = await LegalCase.find().sort({ createdAt: -1 });
        
        // For now we'll return a placeholder
        res.status(200).json({
            success: true,
            message: 'Cases retrieved successfully',
            data: []
        });
    } catch (error) {
        console.error('Error retrieving legal cases:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve legal cases',
            error: error.message
        });
    }
};

// Get a single legal case by ID
exports.getLegalCaseById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // You would implement database retrieval here
        // const legalCase = await LegalCase.findById(id);
        
        // For now we'll return a placeholder
        res.status(200).json({
            success: true,
            message: 'Case retrieved successfully',
            data: null
        });
    } catch (error) {
        console.error('Error retrieving legal case:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve legal case',
            error: error.message
        });
    }
};

