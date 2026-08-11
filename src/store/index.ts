import { defineStore } from "pinia";
import { computed, reactive, toRefs } from "vue";

import graphqlClient from "@/utils/graphql";
import { slugifyString } from "@/utils/slugify";

import { COLLECTION_TYPE_CATEGORIES_QUERY, COLLECTION_TYPE_NEWS_QUERY, COLLECTION_TYPE_FILTERS_QUERY, SINGLE_TYPE_ABOUT_QUERY, COLLECTION_TYPE_PROJECTS_QUERY } from "@/requests";
import { ThemeName } from "@/common/enums";
import type { State, Article, Category, Filter, Project } from "@/common/types";

// #region Helpers
function getSocialNetworkNameFromLink(link: string): string {
	const hostnameParts = new URL(link).hostname.split(".");

	return hostnameParts.length >= 2 ? hostnameParts[hostnameParts.length - 2] : hostnameParts[0];
}
// #endregion

export const useMainStore = defineStore("main", () => {
	const state = reactive<State>({
		app: {
			colorTheme: ThemeName.DARK,
			errorMessage: "",
			focusedImageIndex: 0,
			isLoading: true,
			isMenuOpen: false,
		},
		selected: {
			article: "",
			category: "",
			filter: "",
			project: "",
		},
		collectionTypes: {
			news: null,
			categories: null,
			projects: null,
			filters: null,
		},
		singleTypes: {
			about: {
				title: "",
				socialNetworks: [],
				cvLink: "",
				practices: [],
			},
		},
	});

	// #region Basic getters
	const filters = computed<Filter[]>(() => {
		return Object.values(state.collectionTypes.filters ?? {});
	});

	const projects = computed<Project[]>(() => {
		return Object.values(state.collectionTypes.projects ?? {});
	});

	const categories = computed<Category[]>(() => {
		return Object.values(state.collectionTypes.categories ?? {});
	});
	// #endregion

	// #region Other getters
	const sortedCategories = computed<Category[]>(() => {
		return categories.value.sort((category1, category2) => {
			if (category1.attributes.index < category2.attributes.index) {
				return -1;
			} else {
				return 1;
			}
		});
	});

	const sortedProjects = computed<Project[]>(() => {
		return projects.value
			.filter((project) => {
				return project.attributes.categories.data.some((category) => slugifyString(category.attributes.name) === state.selected.category);
			})
			.filter((project) => {
				if (state.selected.filter === "all") {
					return true;
				}

				if (!project.attributes.type.data) {
					return false;
				}

				return slugifyString(project.attributes.type.data.attributes.name) === state.selected.filter;
			})
			.sort((projectA, projectB) => {
				if (projectA.attributes.index < projectB.attributes.index) {
					return -1;
				}

				if (projectA.attributes.index > projectB.attributes.index) {
					return 1;
				}

				return 0;
			});
	});

	const filtersBySelectedCategory = computed<Filter[]>(() => {
		if (!state.selected.category) {
			return [];
		}

		return filters.value.filter((filter) => filter.attributes.categories.data.some((category) => slugifyString(category.attributes.name) === state.selected.category));
	});

	const socialNetworkIcons = computed<Record<string, string>>(() => {
		return state.singleTypes.about.socialNetworks.reduce((acc: Record<string, string>, socialNetwork: { id: string; link: string }) => {
			acc[socialNetwork.id] = getSocialNetworkNameFromLink(socialNetwork.link);

			return acc;
		}, {});
	});
	// #endregion

	const lightTheme = computed<boolean>(() => {
		return Boolean(state.collectionTypes.categories?.[state.selected.category]?.attributes.isLightTheme);
	});

	const themeMustBeLight = computed<boolean>(() => {
		// Theme must be light when we visit some categories, if the navbar menu is not open.
		if (state.app.isMenuOpen) {
			return false;
		} else {
			return lightTheme.value;
		}
	});
	// #endregion

	// #region Getters
	async function getData(): Promise<void> {
		console.debug("[app] data initialization...");

		const responseSingleTypeAbout = await graphqlClient.query({ query: SINGLE_TYPE_ABOUT_QUERY });
		console.debug("[app] single type - about:", responseSingleTypeAbout);
		state.singleTypes.about = responseSingleTypeAbout.data.about.data.attributes;

		const responseCollectionTypeNews = await graphqlClient.query({ query: COLLECTION_TYPE_NEWS_QUERY });
		state.collectionTypes.news = responseCollectionTypeNews.data.news.data.reduce((acc: Record<string, Article>, article: Article) => {
			acc[slugifyString(article.attributes.title)] = article;

			return acc;
		}, {});

		const responseCollectionTypeCategories = await graphqlClient.query({ query: COLLECTION_TYPE_CATEGORIES_QUERY });
		state.collectionTypes.categories = responseCollectionTypeCategories.data.categories.data.reduce((acc: Record<string, Category>, category: Category) => {
			acc[slugifyString(category.attributes.name)] = category;

			return acc;
		}, {});

		const responseCollectionTypeFilters = await graphqlClient.query({ query: COLLECTION_TYPE_FILTERS_QUERY });
		state.collectionTypes.filters = responseCollectionTypeFilters.data.types.data.reduce((acc: Record<string, Filter>, filter: Filter) => {
			acc[slugifyString(filter.attributes.name)] = filter;

			return acc;
		}, {});

		const responseProjects = await graphqlClient.query({ query: COLLECTION_TYPE_PROJECTS_QUERY });
		state.collectionTypes.projects = responseProjects.data.projects.data.reduce((acc: Record<string, Project>, project: Project) => {
			acc[slugifyString(project.attributes.name)] = project;

			return acc;
		}, {});

		console.debug("[app] collection type - news:", responseCollectionTypeNews);
		console.debug("[app] collection type - categories:", responseCollectionTypeCategories);
		console.debug("[app] collection type - filters:", responseCollectionTypeFilters);
		console.debug("[app] collection type - projects:", responseProjects);
	}
	// #endregion

	// #region Basic setters
	function setCategory(category: string | undefined): void {
		if (!category) {
			return;
		}

		const slugifiedCategory = slugifyString(category);

		window.localStorage.setItem("category", slugifiedCategory);
		state.selected.category = slugifiedCategory;

		const filterName = window.localStorage.getItem("filter");

		// If there's a filter stored, use it only if it belongs to the newly selected category.
		const isFilterValidForCategory = filtersBySelectedCategory.value.some((filter) => slugifyString(filter.attributes.name) === filterName);

		if (filterName && isFilterValidForCategory) {
			setFilter(filterName);

			return;
		}

		if (filtersBySelectedCategory.value.length) {
			const hasAllFilter = filtersBySelectedCategory.value.find((filter) => filter.attributes.name === "All");

			if (hasAllFilter) {
				setFilter(slugifyString(hasAllFilter.attributes.name));
			} else {
				setFilter(slugifyString(filtersBySelectedCategory.value[0].attributes.name));
			}
		} else {
			setFilter("all");
		}
	}

	function resetCategory(): void {
		window.localStorage.removeItem("category");
		state.selected.category = "";
	}

	function setFilter(filter: string | undefined): void {
		if (!filter) {
			return;
		}

		const slugifiedName = slugifyString(filter);

		window.localStorage.setItem("filter", slugifiedName);

		state.selected.filter = slugifiedName;
	}

	function setProject(name: string | undefined): void {
		if (!name) {
			return;
		}

		const slugifiedName = slugifyString(name);

		window.localStorage.setItem("project", slugifiedName);

		state.selected.project = slugifiedName;
	}

	function setArticle(title: string | undefined): void {
		if (!title) {
			return;
		}

		const slugifiedTitle = slugifyString(title);

		window.localStorage.setItem("article", slugifiedTitle);

		state.selected.article = slugifiedTitle;
	}
	// #endregion

	// #region Other setters
	function setIsLoading(isLoading: boolean): void {
		state.app.isLoading = isLoading;
	}

	function setIsMenuOpen(isMenuOpen: boolean): void {
		state.app.isMenuOpen = isMenuOpen;
	}

	function setErrorMessage(errorMessage: string): void {
		state.app.errorMessage = errorMessage;
	}

	function setColorTheme(colorTheme: ThemeName): void {
		state.app.colorTheme = colorTheme;
	}

	function setFocusedImageIndex(imageIndex: number): void {
		state.app.focusedImageIndex = imageIndex;
	}
	// #endregion

	return {
		// State
		...toRefs(state),

		// Basic getters
		filters,
		projects,
		categories,

		// Getters
		sortedCategories,
		sortedProjects,
		filtersBySelectedCategory,
		socialNetworkIcons,

		lightTheme,
		themeMustBeLight,

		// Getters
		getData,

		// Basic setters
		setCategory,
		resetCategory,
		setFilter,
		setProject,
		setArticle,

		// Other setters
		setIsLoading,
		setIsMenuOpen,
		setErrorMessage,
		setColorTheme,
		setFocusedImageIndex,
	};
});
