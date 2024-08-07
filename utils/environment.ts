export const retrieveTrackingDatabasesIds = () => {
    return process.env.TRACKING_DATABASE_IDS.split(",")
}

export const retrieveKeywordDatabasesIds = () => {
    return process.env.KEYWORDS_DATABASE_IDS.split(",")
}