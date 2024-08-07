import axios from 'axios';
import * as cheerio from 'cheerio';

// Function to scrape the web page and find <script> tags with nonce attribute
export async function scrapeScriptsWithNonce(keyword: string, language: string): Promise<Number> {
    try {
        // Get the developer account
        const creator = process.env.DEVELOPER_NAME

        // Fetch the web page content
        const response = await axios.get(`https://play.google.com/store/search?q=${keyword}&c=apps&hl=${language}`);
        const htmlContent = response.data;

        // Parse the HTML content with Cheerio
        const $ = cheerio.load(htmlContent);

        // Find all <script> tags with nonce attribute
        const creators = $('div.ULeU3b')
            .map((_, app) => $(app).find('span.wMUdtb').text().trim())
            .get() // Converts the cheerio object to a regular array
            .filter(appCreator => appCreator); // Filters out empty or falsy values

        const position = creators.indexOf(creator)

        return position === -1 ? -1 : position + 1
    } catch (error) {
        console.error(`Error fetching the URL: ${error}`);
    }
}
