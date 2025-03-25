const axios = require('axios');

// Controller function for submitting a legal case
exports.submitLegalCase = async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            phone, 
            preferredLanguage, 
            legalIssue, 
            caseDetails,
            documentText // Add this to receive the extracted text
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

        // Create payload for webhook
        const webhookPayload = {
            fullName,
            email,
            phone,
            preferredLanguage,
            legalIssue,
            caseDetails,
            hasDocumentText: !!documentText,
            submitTime: new Date().toISOString()
        };

        // Add document text if available
        if (documentText) {
            webhookPayload.documentText = documentText;
            
            // Add a summary of the document text (first 100 chars)
            webhookPayload.documentTextSummary = 
                documentText.length > 100 
                    ? documentText.substring(0, 100) + '...' 
                    : documentText;
        }

        // Send data to Make.com webhook
        const response = await axios.post("https://hook.eu2.make.com/w5hhkqypyrb8kb69nlz4kxfh9v77591c", webhookPayload);
        
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
                hasDocumentText: !!documentText,
                documentTextLength: documentText ? documentText.length : 0
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
};
