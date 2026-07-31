<template>
	<section
		class="projects"
		:class="{ 'projects--light': mainStore.lightTheme }"
	>
		<!-- Placeholder when there's no projects or layout defined for the category -->
		<placeholder-component v-if="!layout || !mainStore.sortedProjects.length" />

		<div
			v-else
			class="projects__container"
		>
			<!-- Filters -->
			<div
				v-if="filters.length > 0"
				class="projects__filters"
			>
				<div
					v-for="filter of filters"
					:key="filter.id"
					class="projects__filter"
					:class="{ 'projects__filter--active': slugifyString(filter.attributes.name) === mainStore.selected.filter }"
					@click="onSelectFilter(filter.attributes.name)"
				>
					<span>
						{{ filter.attributes.name }}
					</span>
				</div>
			</div>

			<!-- Projects -->
			<div class="projects__content">
				<div class="projects__content">
					<!-- Gallery layout-->
					<div
						v-if="layout === Layout.GALLERY"
						class="projects__gallery"
					>
						<div
							v-if="medias?.length"
							class="projects__gallery-images"
						>
							<gallery-component
								:on-click="onChangeImageFocused"
								:images="medias"
							/>
						</div>
						<div
							v-if="focusedMedia"
							class="projects__gallery-highlight"
						>
							<media-component
								:media="focusedMedia"
								:has-preview="true"
							/>
						</div>
					</div>

					<!-- List layout -->
					<div
						v-if="layout === Layout.LIST"
						class="projects__list"
					>
						<card-component
							v-for="project of mainStore.sortedProjects"
							:key="project.id"
							:project="project"
						/>
					</div>
				</div>

				<!-- Shape in the background -->
				<img
					v-if="layout === Layout.GALLERY"
					class="projects__shape"
					:src="shapeBottom"
					alt="Shape in the bottom of the site."
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useMainStore } from "@/store";

import shapeBottom from "@/assets/images/shapes/projects-01.png";

import GalleryComponent from "@/components/shared-components/gallery-component.vue";
import MediaComponent from "@/components/shared-components/media-component.vue";
import CardComponent from "@/components/projects-components/card-component.vue";
import PlaceholderComponent from "@/components/projects-components/placeholder-component.vue";

import { slugifyString } from "@/utils/slugify";
import { shuffleArray } from "@/utils/shuffleArray";

import { Layout } from "@/common/enums";
import type { Media, Filter } from "@/common/types";

// #region Dependencies
const mainStore = useMainStore();

const route = useRoute();
const router = useRouter();
// #endregion

// #region Computed
const filters = computed<Filter[]>(() => {
	if (!mainStore.filtersBySelectedCategory) {
		return [];
	}

	return [...mainStore.filtersBySelectedCategory].sort((filterA, filterB) => {
		if (filterA.attributes.index < filterB.attributes.index) {
			return -1;
		}

		if (filterA.attributes.index > filterB.attributes.index) {
			return 1;
		}

		return 0;
	});
});

const focusedMedia = computed<Media | null>(() => {
	if (!medias.value?.[mainStore.app.focusedImageIndex]) {
		return null;
	}

	return medias.value[mainStore.app.focusedImageIndex];
});

const layout = computed<Layout>(() => {
	if (!mainStore.selected.category) {
		return Layout.LIST;
	}

	const selectedCategory = mainStore.collectionTypes.categories?.[mainStore.selected.category];
	const selectedFilter = mainStore.filtersBySelectedCategory.find((filter) => slugifyString(filter.attributes.name) === mainStore.selected.filter);

	return selectedFilter?.attributes.layout ?? selectedCategory?.attributes.defaultLayout ?? Layout.LIST;
});

const medias = computed<Media[]>(() => {
	if (!mainStore.sortedProjects || layout.value !== Layout.GALLERY) {
		return [];
	}

	return shuffleArray(
		mainStore.sortedProjects.reduce((acc: Media[], project) => {
			acc.push(
				...project.attributes.medias.map((media) => ({
					...media,
					type: slugifyString(project.attributes.type.data?.attributes.name ?? "All"),
				})),
			);

			return acc;
		}, []),
	);
});
// #endregion

// #region Functions
function onChangeImageFocused({ index }: { index: number }): void {
	mainStore.setFocusedImageIndex(index);
}

async function onSelectFilter(name: string): Promise<void> {
	mainStore.setFocusedImageIndex(0);
	mainStore.setFilter(name);

	await router.push(`/projects/${mainStore.selected.category}/filter/${mainStore.selected.filter}`);
}
// #endregion

// #region Lifecycles
watch(
	() => [route.params.category, route.params.filter],
	([categorySlug, filterSlug]) => {
		mainStore.setCategory(typeof categorySlug === "string" ? categorySlug : categorySlug?.[0]);

		if (filterSlug) {
			mainStore.setFilter(typeof filterSlug === "string" ? filterSlug : filterSlug[0]);
		}
	},
	{ immediate: true },
);
// #endregion
</script>

<style scoped lang="scss">
.projects {
	min-height: 100vh;
	background: radial-gradient(circle at 27.28% 77.78%, #110f10, transparent 61%), radial-gradient(circle at 42.94% 50.05%, #110f10, transparent 100%),
		radial-gradient(circle at 45.89% 30.01%, #110f10, transparent 100%), radial-gradient(circle at 99.17% 46.73%, #205251, transparent 100%),
		radial-gradient(circle at 66.28% 54.41%, #110f10, transparent 100%), radial-gradient(circle at 50% 50%, #110f10, #110f10 100%);

	&--light {
		background-color: var(--color-white);
		background-image: none;

		.projects {
			&__filter {
				background-color: var(--color-white);
				border: 1px solid var(--color-main);
				color: var(--color-main);

				&:hover {
					background-color: var(--color-black);
					border-color: var(--color-black);
					color: var(--color-white);
				}

				&--active {
					background-color: var(--color-main);
					color: var(--color-white);
				}
			}
		}
	}

	&__container {
		min-height: 100vh;
		padding: var(--padding-page-mobile);
	}

	&__filters {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 30px;
	}

	&__filter {
		display: table-cell;
		vertical-align: middle;
		cursor: pointer;
		padding: 0 12px;
		font-family: var(--font-primary);
		text-transform: uppercase;
		transition: 0.2s ease-in all;
		height: 32px;
		background-color: var(--color-background-filter);
		border: 1px solid var(--color-border-filter);

		&:last-child {
			margin-right: 0;
		}

		span {
			line-height: 32px;
		}

		&:hover {
			background-color: var(--color-background-filter-hovered);
			border: 1px solid var(--color-border-filter-hovered);
			color: var(--color-text-filter-hovered);
		}

		&--active {
			background-color: var(--color-background-filter-active);
			border: 1px solid var(--color-border-filter-active);
		}
	}

	&__content {
		position: relative;
		z-index: 10;
	}

	&__gallery {
		display: flex;

		&-images,
		&-highlight {
			width: 50%;
			:deep(.image__src) {
				cursor: pointer;
			}
		}

		&-highlight {
			position: sticky;
			top: 30px;
			height: 100%;
			margin-left: 30px;
		}
	}

	&__list {
		display: grid;
		grid-template-columns: 1fr;
		grid-column-gap: 30px;
		grid-row-gap: 30px;
	}

	&__shape {
		position: fixed;
		height: 60%;
		bottom: 0;
		right: 20%;
	}
}

@media (min-width: 968px) {
	.projects {
		&__container {
			padding: var(--padding-page-desktop);
		}

		&__list {
			grid-template-columns: repeat(2, 1fr);
		}
	}
}
</style>
