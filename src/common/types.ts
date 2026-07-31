import { ThemeName, Layout } from "./enums";

// #region Common
export interface State {
	app: {
		colorTheme: ThemeName;
		errorMessage: string;
		focusedImageIndex: number;
		isLoading: boolean;
		isMenuOpen: boolean;
	};
	selected: {
		article: string;
		category: string;
		filter: string;
		project: string;
	};
	collectionTypes: {
		news: Record<string, Article> | null;
		categories: Record<string, Category> | null;
		filters: Record<string, Filter> | null;
		projects: Record<string, Project> | null;
	};
	singleTypes: {
		about: About;
	};
}

export interface Formats {
	large: Format;
	medium: Format;
	small: Format;
	thumbnail: Format;
}

export interface Format {
	ext: string;
	hash: string;
	height: number;
	mime: string;
	name: string;
	path: string;
	provider_metadata: {
		public_id: string;
		resource_type: string;
	};
	size: number;
	url: string;
	width: number;
}

/**
 * Can be an image or a video.
 */
export interface Media {
	copyright: string | null;
	id: string;
	link: string | null;
	src: {
		data: {
			attributes: {
				alternativeText: string | null;
				mime: string;
				url: string;
				formats: Formats;
			};
		};
	};
}

export interface ObjectById<T> {
	[key: string]: T;
}
export interface Link {
	id: number;
	src: string;
	name: string;
}
// #endregion

// #region Single type "About"
export interface Practice {
	id: string;
	image: Media;
	text: string;
	title: string;
}

export interface About {
	cvLink: string;
	practices: Practice[];
	socialNetworks: { id: string; link: string }[];
	title: string;
}
// #endregion

// #region Collection type "News"
export interface Article {
	id: string;
	attributes: {
		address: {
			name: string | null;
			street: string;
			cp: string;
			city: string;
		};
		date: {
			date: string;
			start: string;
			end: string;
		};
		email: string | null;
		id: string;
		title: string;
		publishedAt: string;
		image: Media;
		register: {
			email: string;
		} | null;
		text: string;
		website: string | null;
	};
}

export interface News {
	id: string;
	attributes: Article[];
}
// #endregion

// #region Collection types "Category"
export interface Category {
	id: string;
	attributes: {
		id: string;
		index: number;
		name: string;
		placeholder: {
			data: {
				attributes: {
					url: string;
				};
			};
		};
		types: string[];
		isLightTheme: boolean;
		defaultLayout: Layout;
	};
}
// #endregion

// #region Collection types "Filter"
export interface Filter {
	id: string;
	attributes: {
		categories: {
			data: {
				attributes: {
					id: string;
					name: string;
				};
			}[];
		};
		id: string;
		image: string;
		name: string;
		layout: Layout;
		index: number;
	};
}
// #endregion

// #region Collection types "Project"
export interface Project {
	id: string;
	attributes: {
		category: {
			data: {
				attributes: {
					name: string;
				};
			};
		};
		date: string;
		id: string;
		index: number;
		link: {
			src: string;
		};
		medias: Media[];
		name: string;
		text: string;
		type: {
			data: {
				attributes: {
					name: string;
				};
			} | null;
		};
	};
}
// #endregion
