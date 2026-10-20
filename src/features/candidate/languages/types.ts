export interface LanguagePayload {
    candidateId: number
    languageName: string
    languageLevelId: number
}

export interface LanguageResponse {
    languageId: string
    candidateId: number
    languageName: string
    languageLevelId: number
    languageLevelName: string
}

// One row coming from the form. languageId is null for new rows.
export interface LanguageSaveRow {
    languageId: string | null
    languageName: string
    languageLevelId: number
}