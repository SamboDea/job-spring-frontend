import { configureStore } from "@reduxjs/toolkit";
import candidateReducer from "@/src/features/candidate/slice";
import userReducer from "@/src/features/users/slice";
import workExperienceReducer from "@/src/features/candidate/work-experience/slice";
import educationReducer from "@/src/features/candidate/education/slice";
import educationLevelReducer from "@/src/features/candidate/educattion-level/slice";
import majorReducer from "@/src/features/candidate/major/slice";
import countryReducer from "@/src/features/country/slice"
import skillReducer from "@/src/features/candidate/skills/slice"
import languageLevelReducer from "@/src/features/candidate/languageLevel/slice"
import achievementReducer from "@/src/features/candidate/achievement/slice"
import languageReducer from "@/src/features/candidate/languages/slice"
import referenceReducer from "@/src/features/candidate/reference/slice"

export const store = configureStore({
    reducer: {
        candidate: candidateReducer,
        user: userReducer,
        workExperience: workExperienceReducer,
        education: educationReducer,
        educationLevel: educationLevelReducer,
        major: majorReducer,
        country: countryReducer,
        skill: skillReducer,
        languageLevel: languageLevelReducer,
        achievement: achievementReducer,
        language: languageReducer,
        reference: referenceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
