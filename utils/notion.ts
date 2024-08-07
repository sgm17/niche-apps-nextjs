import { Client } from '@notionhq/client'

// Initialize the Notion client with your token
const notion = new Client({ auth: process.env.NOTION_API_KEY })

export interface KeywordLanguageObject {
    Keyword: string
    Language: string
}

export const updateNotionDatabase = async (keyword: string, position: number, language: string, databaseId: string): Promise<Object> => {
    const body = {
        parent: {
            type: "database_id",
            database_id: databaseId
        },
        properties: {
            "Keyword": {
                type: "title",
                title: [
                    {
                        type: "text",
                        text: {
                            content: keyword
                        }
                    }
                ]
            },
            "Position": {
                type: "number",
                number: position
            },
            "Language": {
                select: {
                    name: language
                }
            }
        }
    }

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Notion-Version': '2022-06-28',
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + process.env.NOTION_API_KEY,
        },
        body: JSON.stringify(body),
    };

    const response = await fetch('https://api.notion.com/v1/pages', options)
    const json = await response.json()
    return json
}

export const fetchNotionDatabase = async (databaseId: string): Promise<KeywordLanguageObject[]> => {
    const response = await notion.databases.query({
        database_id: databaseId,
    })

    return response.results.map((page: any) => {
        const keyword = page.properties.Keyword.title[0].text.content
        const language = page.properties.Language.select.name

        return {
            Keyword: keyword,
            Language: language,
        }
    })
}
