export async function defineRouteToPush(categoryName: string, filterName: string) {
	if (filterName === "none") {
		return `/projects/${categoryName}`;
	}

	if (filterName === "") {
		return `/projects/${categoryName}/transition`;
	} else {
		return `/projects/${categoryName}/filter/${filterName}`;
	}
}
