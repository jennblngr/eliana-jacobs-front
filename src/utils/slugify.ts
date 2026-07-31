import slugify from "slugify";

export function slugifyString(stringToSlug: string): string {
	const forbiddenCharacters = ['"', "&", ".", "(", ")", "!", "?", ",", ", "];

	const slugedString = stringToSlug
		.replace("_", "-")
		.split("")
		.filter((character) => !forbiddenCharacters.includes(character))
		.join("");

	return slugify(slugedString, {
		lower: true,
	});
}
