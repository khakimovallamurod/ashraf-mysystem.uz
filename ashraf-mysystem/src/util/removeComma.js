export default function removeComma(string) {
    if (typeof string === "string") {
        return string.replace(/,/g, "").replace(/ /g, '');
    } else {
        return string
    }
}

