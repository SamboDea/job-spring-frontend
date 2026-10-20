<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Redux Toolkit Conventions

### Folder structure
Each feature has its own folder with these four files:

```
<feature>/
├── types.ts           # Payload, Response types
├── request.ts         # axios calls only
├── slice.ts           # createSlice, plain reducers only
└── use<Feature>.ts    # Hook: calls request, dispatches actions, shows errors
```

Reference example: the `languageLevel` feature. Copy its structure for every new feature.

### Data flow
Component → `use<Feature>` hook → `request.ts` (axios) → `dispatch(slice action)` → store

- Do NOT use `createAsyncThunk` or `extraReducers`.
- Do NOT use `useCallback`, `useMemo`, or `async/await` in hooks. Use plain functions with `.then().catch()`.

### types.ts
- `<Feature>Payload`: the body sent to the API (create/update).
- `<Feature>Response`: the object returned by the API (includes `id`).
- Use `interface`. No logic.

### request.ts
- Import `axios` directly and type each call with the response type, e.g. `axios.get<LanguageLevelResponse[]>('/languages/level')`.
- Function names start with `req`: `reqGet<Feature>`, `reqGet<Feature>ById`, `reqCreate<Feature>`, `reqUpdate<Feature>`, `reqDelete<Feature>`.
- Each function just `return`s the axios call. No Redux, no error handling, no `.then`.

### slice.ts
- State shape: `{ list: <Feature>Response[], current: <Feature>Response | null, loading: boolean }`.
- Only plain reducers: `setList`, `setCurrent`, `setLoading`. Type payloads with `PayloadAction<...>`.
- No API calls and no async logic.
- Export the actions as named exports and the reducer as default.
- Register the reducer in the root store using the feature's camelCase name (e.g. `languageLevel`).

### use<Feature>.ts
- Use `useAppDispatch` and `useAppSelector` from `@/src/redux/hooks`. Never use raw `useDispatch` / `useSelector`.
- Read state with `useAppSelector((state) => state.<feature>)`.
- Function names: `get<Feature>`, `get<Feature>ById`, `create<Feature>`, `update<Feature>`, `delete<Feature>`.
- Every function follows this pattern:
  1. `dispatch(setLoading(true))`
  2. `return req...().then(...).catch(...).finally(...)`
  3. In `.then`: dispatch the data to the slice (`setList` / `setCurrent`) when it's a GET, and `return res.data`.
  4. In `.catch`: `console.error("Failed to ...", err)`, show `Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message })`, and `return null`.
  5. In `.finally`: `dispatch(setLoading(false))`.
- Return `{ list, loading, ...functions }` from the hook.
- Callers use the returned value: data on success, `null` on failure.

### Rules
- Components never import from `slice.ts` or `request.ts`; they always use the hook.
- Error messages always go through `Swal`; do not store errors in the slice.
- Keep the same naming across all features so they look identical.

### Reference pattern (hook function)
```typescript
const getLanguageLevel = () => {
    dispatch(setLoading(true))
    return reqGetLanguageLevel()
        .then((res) => {
            dispatch(setList(res.data))
            return res.data
        })
        .catch((err) => {
            console.error("Failed to get language level", err)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message,
            })
            return null
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
}
```