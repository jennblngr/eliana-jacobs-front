import { createRouter, createWebHistory } from "vue-router";

import { useMainStore } from "@/store";

const PROJECTS_CATEGORY_ROUTE_NAMES = ["projects-without-transition", "projects-with-transition", "projects-and-filter", "project", "project-without-filter"];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/home-view.vue"),
		},
		{
			path: "/about",
			name: "about",
			component: () => import("../views/about-view.vue"),
		},
		{
			path: "/contact",
			name: "contact",
			component: () => import("../views/contact-view.vue"),
		},
		{
			path: "/legal-notices",
			name: "legal-notices",
			component: () => import("../views/legal-notices-view.vue"),
		},
		{
			path: "/error",
			name: "error",
			component: () => import("../components/shared-components/error-component.vue"),
		},
		{
			path: "/news",
			name: "news",
			component: () => import("../views/news-view.vue"),
		},
		{
			path: "/news/:article",
			name: "article",
			component: () => import("../views/article-view.vue"),
		},
		{
			path: "/projects/:category",
			name: "projects-without-transition",
			component: () => import("../views/projects-view.vue"),
		},
		{
			path: "/projects/:category/transition",
			name: "projects-with-transition",
			component: () => import("../views/transition-view.vue"),
		},
		{
			path: "/projects/:category/filter/:filter",
			name: "projects-and-filter",
			component: () => import("../views/projects-view.vue"),
		},
		{
			path: "/projects/:category/filter/:filter/project/:project",
			name: "project",
			component: () => import("../views/project-view.vue"),
		},
		{
			path: "/projects/:category/project/:project",
			name: "project-without-filter",
			component: () => import("../views/project-view.vue"),
		},
		{
			path: "/:pathMatch(.*)*",
			name: "not-found",
			component: () => import("../components/shared-components/error-component.vue"),
		},
	],
});

router.beforeEach(async (to, from, next) => {
	const store = useMainStore();

	if (PROJECTS_CATEGORY_ROUTE_NAMES.includes(from.name) && !PROJECTS_CATEGORY_ROUTE_NAMES.includes(to.name)) {
		store.resetCategory();
	}

	try {
		await store.getData();

		store.setIsLoading(false);
		console.debug("[app] data initialized.");
		next();
	} catch (error) {
		store.setIsLoading(false);
		store.setErrorMessage("An error occurred while retrieving the data.");

		console.error(error);

		next();
	}
});

export default router;
