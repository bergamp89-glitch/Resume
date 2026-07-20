import { google } from 'googleapis';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // PDF files can be a few MBs
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { pdfBase64, fileName } = req.body;

    if (!pdfBase64 || !fileName) {
      return res.status(400).json({ message: 'pdfBase64 and fileName are required' });
    }

    // Google xizmat ko'rsatish akkaunti ma'lumotlari environment variables'dan olinadi
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    
    // Tizim xatolarini oldini olish uchun kalitni 100% to'g'ri formatga qayta yig'amiz (Bulletproof PEM format)
    privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    const match = privateKey.match(/-----BEGIN PRIVATE KEY-----([\s\S]+)-----END PRIVATE KEY-----/);
    if (match) {
        const base64Content = match[1].replace(/\s+/g, '');
        const lines = base64Content.match(/.{1,64}/g).join('\n');
        privateKey = `-----BEGIN PRIVATE KEY-----\n${lines}\n-----END PRIVATE KEY-----\n`;
    }

    if (!clientEmail || !privateKey) {
      console.error("Google Service Account kalitlari topilmadi.");
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Google API bilan ulanish (Authentication)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Base64 stringni Buffer ga aylantiramiz
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Google Drive'ga yuklanadigan fayl parametrlari
    const fileMetadata = {
      name: fileName,
      parents: ['1eMXQFGXS2w6X37x2ONWifTMeNSLy63-x'] // Foydalanuvchining maxsus papkasi
    };

    const media = {
      mimeType: 'application/pdf',
      body: Readable.from(buffer),
    };

    // Google Drive API orqali faylni yaratish
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    return res.status(200).json({ 
      success: true, 
      message: 'File uploaded successfully',
      fileId: response.data.id 
    });

  } catch (error) {
    console.error("Google Drive API xatosi:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to upload to Google Drive',
      error: error.message 
    });
  }
}
