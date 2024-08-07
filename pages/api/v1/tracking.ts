import { NextApiRequest, NextApiResponse } from 'next'
import { fetchNotionDatabase, updateNotionDatabase } from '../../../utils/notion'
import { retrieveKeywordDatabasesIds, retrieveTrackingDatabasesIds } from '../../../utils/environment'
import { scrapeScriptsWithNonce } from '../../../utils/ranking'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            try {
                // Retrieve array of keyword databases
                const keywordDatabasesIds = retrieveKeywordDatabasesIds()
                // Retrieve array of tracking databases
                const trackingDatabasesIds = retrieveTrackingDatabasesIds()

                keywordDatabasesIds.forEach(async (keywordsDatabaseId, index) => {
                    // Fetch the default keywords of the database
                    const data = await fetchNotionDatabase(keywordsDatabaseId)

                    const item = data[0]
                    // data.forEach(async (item) => {
                    const keyword = item.Keyword
                    const language = item.Language === "en" ? "en_US" : "es_ES"
                    const position = await scrapeScriptsWithNonce(keyword, language)

                    // Update the tracking database with the new position of the keyword
                    await updateNotionDatabase(keyword, position, item.Language, trackingDatabasesIds[index])
                    // })

                })
                res.status(200).json({ message: "The request has been processed" })
            } catch (e) {
                res.status(500).json({ message: "Something has gone wrong when retrieving the apps", error: e })
            }
    }
}