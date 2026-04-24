// s3-upload.js

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Set up AWS S3 credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1' // Change to your region
});

// Create an S3 instance
const s3 = new AWS.S3();

// Function to upload file to S3
async function uploadToS3(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const bucketName = 'your-bucket-name'; // Replace with your S3 bucket name
  const s3Key = path.basename(filePath); // Use the file name as the S3 key

  const params = {
    Bucket: bucketName,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'text/html',
    ACL: 'public-read', // Make the files publicly accessible
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. URL: ${data.Location}`);
    return data.Location; // Return the S3 file URL
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to handle article generation and upload
async function generateAndUploadArticle(title, content, keyword) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filePath = `./generated_articles/${slug}.html`;

  // Save the article locally with SEO Meta Tags
  const seoMetaTags = generateSEOArticleMetaTags(title, keyword);
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${title}</title>
      ${seoMetaTags}
    </head>
    <body>
      <article>
        <h1>${title}</h1>
        <div>${content.replace(/\n/g, "<br>")}</div>
      </article>
    </body>
    </html>
  `;
  fs.writeFileSync(filePath, htmlContent);

  // Upload the article to S3 and get the public URL
  const fileUrl = await uploadToS3(filePath);
  return fileUrl;
}

// Example usage
const exampleArticle = {
  title: 'How to Start Amazon FBA with JungleScout',
  content: 'Content for the article goes here...',
  keyword: 'Amazon FBA, JungleScout',
};

// Generate and upload the article
generateAndUploadArticle(exampleArticle.title, exampleArticle.content, exampleArticle.keyword)
  .then((url) => {
    console.log('Article uploaded and available at:', url);
  })
  .catch((error) => {
    console.error('Error generating and uploading article:', error);
  });
