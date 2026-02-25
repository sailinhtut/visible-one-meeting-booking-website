export function capitalizeFirstLetter(content: string) {
	if (!content) return ''; // Handle empty or null strings safely
	return content.charAt(0).toUpperCase() + content.slice(1);
}
