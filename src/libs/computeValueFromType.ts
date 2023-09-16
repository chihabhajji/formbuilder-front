export function computeValueFromType(type?: string): string | [] | {} | boolean {
    if(!type) return '';
    switch (type) {
        case "string":
        case "number":
            return "";
        case "array":
            return [];
        case "object":
            return {};
        case "boolean":
            return false;
        default:
            return "";
    }

}