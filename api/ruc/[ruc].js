// Using native fetch (available in Node.js 18+ and Vercel)

module.exports = async function handler(req, res) {
    const { ruc } = req.query;

    if (!ruc) {
        return res.status(400).json({ error: 'RUC is required' });
    }

    const token = 'sk_12666.QHtvrYeLy5bhexkDFkVRIhJZg5mhOMLb';
    const apiUrl = `https://api.decolecta.com/v1/sunat/ruc/full?numero=${ruc}`;

    try {
        // Check if fetch is available globally (Node 18+), otherwise use dynamic import above or fallback
        // Vercel standard runtime usually has global fetch now.
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
        }

        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: error.message });
    }
}
