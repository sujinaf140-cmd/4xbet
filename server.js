const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// স্ট্যাটিক ফাইল বা ফ্রন্টএন্ড রান করার জন্য (যদি একই সাথে রাখতে চান)
app.use(express.static('public'));

const API_TOKEN = 'C9360812-A9D5-4B4F-A07C-6247BD8543F1';
const BASE_URL = 'https://api.meganodesv2.com'; // মেগানোডস এপিআই বেস ইউআরএল

// প্রক্সি রাউট: গেম প্রোভাইডার বা গেম লিস্ট ফেচ করার জন্য
app.all('/api/*', async (req, res) => {
    try {
        const endpoint = req.params[0];
        const targetUrl = `${BASE_URL}/${endpoint}`;
        
        console.log(`Proxying request to: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                ...req.headers
            },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
