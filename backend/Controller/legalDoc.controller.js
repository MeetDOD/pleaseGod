const LegalDoc = require("../Models/generatedLegalDocs");

exports.getLegalDocs = async (req, res) => {
	try {
		const userId = req.user.id;
		const { category, page = 1, limit = 10 } = req.query;

		let query = {};
		if (category) {
			query.category = category;
		}

		const docs = await LegalDoc.find({ userId, ...query })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });

		const count = await LegalDoc.countDocuments(query);

		res.status(200).json({
			success: true,
			data: docs,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		});
	} catch (error) {
		console.error("Error fetching legal docs:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch legal documents",
			error: error.message,
		});
	}
};

exports.getLegalDocById = async (req, res) => {
	try {
		const userId = req.user.id;
		const doc = await LegalDoc.findOne({ _id: req.params.id, userId });
		if (!doc) {
			return res.status(404).json({
				success: false,
				message: "Document not found",
			});
		}
		res.status(200).json({
			success: true,
			data: doc,
		});
	} catch (error) {
		console.error("Error fetching legal doc:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch legal document",
			error: error.message,
		});
	}
};

exports.getRecentLegalDocs = async (req, res) => {
	try {
		const docs = await LegalDoc.find().sort({ createdAt: -1 }).limit(10);

		res.status(200).json({
			success: true,
			data: docs,
		});
	} catch (error) {
		console.error("Error fetching recent legal docs:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch recent legal documents",
			error: error.message,
		});
	}
};
