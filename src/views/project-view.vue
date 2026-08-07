<template>
	<section
		class="project"
		:class="{ 'project--light': mainStore.lightTheme }"
	>
		<div v-if="project">
			<arrow-back-component :on-click="backOnProjectsPage" />

			<div class="project__container">
				<div class="project__content">
					<h1 class="project__title">
						{{ project.attributes.name }}
					</h1>

					<div class="project__date">
						{{ project.attributes.date }}
					</div>

					<button-custom-component
						v-if="project.attributes.link?.src"
						:link="project.attributes.link.src"
						text="Website"
						:external="true"
						class="button--visit"
					/>

					<p
						v-if="project.attributes.text"
						class="project__text"
						v-html="marked.parse(project.attributes.text)"
					/>

					<div
						v-if="project.attributes.medias.length > 1"
						class="project__images"
					>
						<gallery-component
							:images="project.attributes.medias"
							:on-click="changeImageFocused"
						/>
					</div>
				</div>

				<div
					v-if="project.attributes.medias[mainStore.app.focusedImageIndex]"
					class="project__highlight"
				>
					<media-component
						:media="project.attributes.medias[mainStore.app.focusedImageIndex]"
						:copyright="project.attributes.medias[mainStore.app.focusedImageIndex].copyright"
						:has-preview="true"
					/>
				</div>
			</div>
		</div>

		<!-- Placeholder for the project page. -->
		<div v-else>
			Oops, an error occurred while fetching the project.
			<br />
			Try again later, and don't hesitate to contact me if the problem persists!
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { marked } from "marked";

import { useMainStore } from "@/store";
import { useRoute, useRouter } from "vue-router";

import ArrowBackComponent from "@/components/shared-components/arrow-back-component.vue";
import MediaComponent from "@/components/shared-components/media-component.vue";
import GalleryComponent from "@/components/shared-components/gallery-component.vue";
import ButtonCustomComponent from "@/components/shared-components/button-custom-component.vue";
import { defineRouteToPush } from "@/utils/pushRoute";

import type { Project } from "@/common/types";

// #region Dependencies
const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
// #endregion

// #region Data
let viewportWidth = ref<number>(0);
// #endregion

// #region Computed
const categorySlug = computed<string | undefined>(() => {
	const categorySlug = route.params.category;

	if (typeof categorySlug === "string") {
		return categorySlug;
	}

	return categorySlug.length > 0 ? categorySlug[0] : undefined;
});

const filterSlug = computed<string | undefined>(() => {
	const filterSlug = route.params.filter;

	if (typeof filterSlug === "string") {
		return filterSlug;
	}

	return filterSlug.length > 0 ? filterSlug[0] : undefined;
});

const project = computed<Project | null>(() => {
	if (mainStore.selected.project === "" || !mainStore.collectionTypes.projects) {
		return null;
	}

	return mainStore.collectionTypes.projects[mainStore.selected.project] ?? null;
});
// #endregion

// #region Functions
// Change the image focused in the window.
function changeImageFocused({ index }: { index: number }): void {
	mainStore.setFocusedImageIndex(index);
}

// Clicking on the "Back" arrow takes the user back to the page of the projects.
async function backOnProjectsPage(): Promise<void> {
	if (!categorySlug.value || !filterSlug.value) {
		return;
	}

	mainStore.setCategory(categorySlug.value);
	mainStore.setFilter(filterSlug.value);

	const routeToPush = await defineRouteToPush(mainStore.selected.category, mainStore.selected.filter);

	await router.push(routeToPush);
}

// Set the viewport width in the "viewportWidth" data.
function setViewportWidth(event: Event): void {
	if (!(event.target instanceof Window)) {
		return;
	}

	viewportWidth.value = event.target.innerWidth;
}
// #endregion

// #region Lifecycles
// Retrieve the selected project and the category with the slug,
// and according to the viewport width, decides if the selected image
// must be previewed or displayed in the "media-component".
onMounted(async () => {
	viewportWidth.value = window.innerWidth;
	window.addEventListener("resize", setViewportWidth);

	mainStore.setFocusedImageIndex(0);

	const categorySlug = route.params.category;
	const projectSlug = route.params.project;
	const filterSlug = route.params.filter;

	mainStore.setCategory(typeof categorySlug === "string" ? categorySlug : categorySlug[0]);
	mainStore.setProject(typeof projectSlug === "string" ? projectSlug : projectSlug[0]);
	mainStore.setFilter(typeof filterSlug === "string" ? filterSlug : filterSlug[0]);
});
// Remove listener on the window resizing.
onUnmounted(() => {
	window.removeEventListener("resize", setViewportWidth);
});
// #endregion
</script>

<style scoped lang="scss">
.project {
	min-height: 100vh;
	background: radial-gradient(circle at 27.28% 77.78%, #110f10, transparent 61%), radial-gradient(circle at 42.94% 50.05%, #110f10, transparent 100%),
		radial-gradient(circle at 45.89% 30.01%, #110f10, transparent 100%), radial-gradient(circle at 99.17% 46.73%, #205251, transparent 100%),
		radial-gradient(circle at 66.28% 54.41%, #110f10, transparent 100%), radial-gradient(circle at 50% 50%, #110f10, #110f10 100%);

	&--light {
		background-image: none;
		background-color: var(--color-white);
		color: var(--color-black);
	}

	&__container {
		display: flex;
		flex-direction: column-reverse;
	}

	&__text {
		white-space: pre-wrap;
	}

	&__content,
	&__highlight {
		width: 100%;
	}

	&__title {
		margin: 30px 0;
	}

	&__date {
		margin-bottom: 30px;
	}

	&__highlight {
		height: 100%;
		margin-left: 0;
	}
}

@media (min-width: 768px) {
	.project {
		&__container {
			flex-direction: row;
		}

		&__date {
			margin-bottom: 50px;
		}

		&__content,
		&__highlight {
			width: 50%;
		}

		&__highlight {
			position: sticky;
			top: 30px;
			height: 100%;
			margin-left: 30px;

			:deep(.image__src) {
				cursor: pointer;
				width: 100%;
				object-fit: cover;
				object-position: top center;
			}
		}
	}
}

:deep(.button--visit) {
	color: white !important;
	margin-bottom: 30px;

	&:hover {
		color: var(--color-main) !important;
		border-color: var(--color-main) !important;
		background-color: white !important;
	}
}
</style>
