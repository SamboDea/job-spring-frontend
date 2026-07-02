export default function handleChange() {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        console.log(e.target.name);
        console.log(e.target.value);
    };

    return {
        handleChange,
    };
}