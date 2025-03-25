const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY =
	"d83d8b4aa8aab567a6982e70d4b4451d73bdb8acc78487230950f70d0460d7a9";

// Fetch Google News
router.get("/news", async (req, res) => {
	try {
		const response = await axios.get("https://serpapi.com/search", {
			params: {
				engine: "google_news",
				api_key: API_KEY,
				q: req.query.q || "indian legal news",
			},
		});

		// Extract first 10 results
		const newsResults = response.data.news_results?.slice(0, 10) || [];

		res.json({ news_results: newsResults });
	} catch (error) {
		res.status(500).json({ error: "Error fetching news", message: error.message });
	}
});

// Fetch YouTube Videos
router.get("/youtube", async (req, res) => {
	try {
		const response = await axios.get("https://serpapi.com/search", {
			params: {
				engine: "youtube",
				api_key: API_KEY, // Include API key here
				search_query: req.query.q || "indian legal news",
			},
		});

		// Extract first 10 video results if available
		const youtubeResults = response.data.video_results?.slice(0, 10) || [];

		res.json({ youtube_results: youtubeResults });
	} catch (error) {
		res.status(500).json({ error: "Error fetching YouTube results", message: error.message });
	}
});

module.exports = router;
