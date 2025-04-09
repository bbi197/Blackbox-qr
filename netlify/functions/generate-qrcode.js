const QRCode = require('qrcode');

exports.handler = async (event) => {
    try {
        const { bizId, businessName } = JSON.parse(event.body);
        
        if (!bizId || !businessName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields: bizId and businessName' })
            };
        }

        // Encode parameters for URL
        const encodedName = encodeURIComponent(businessName);
        const siteURL = process.env.SITE_URL || 'https://your-domain.com'; // Set in Netlify env vars
        
        // Create URL with query parameters
        const paymentURL = `${siteURL}/pay?bizId=${bizId}&name=${encodedName}&type=payment`;
        
        // Generate QR code with the URL
        const qrUrl = await QRCode.toDataURL(paymentURL, {
            errorCorrectionLevel: 'H', // High error correction
            type: 'image/png',
            margin: 2,
            scale: 8
        });

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            },
            body: JSON.stringify({ 
                qrUrl,
                paymentUrl: paymentURL,
                bizId,
                businessName 
            })
        };
    } catch (error) {
        console.error('QR Generation Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'QR generation failed',
                details: error.message 
            })
        };
    }
};