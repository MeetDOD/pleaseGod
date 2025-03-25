import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LegalDocuments = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const API_URL = import.meta.env.VITE_BASE_URL;

    const fetchDocs = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.get(
                `${API_URL}/api/legal/docs?page=${page}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setDocs(response.data.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Error fetching legal documents:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Legal Documents</h2>
            
            <div className="grid gap-4">
                {docs.map(doc => (
                    <div key={doc._id} className="p-4 border rounded-lg shadow">
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-sm text-gray-600">{doc.category}</p>
                        {/* Add more fields as needed */}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => fetchDocs(i + 1)}
                        className={`px-3 py-1 rounded ${
                            currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LegalDocuments; 