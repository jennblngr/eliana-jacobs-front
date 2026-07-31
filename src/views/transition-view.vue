<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "@/store";

import { slugifyString } from "@/utils/slugify";

// #region Dependencies
const route = useRoute();
const router = useRouter();

const mainStore = useMainStore();
// #endregion

// #region Data
const filtersLength = ref<number>(mainStore.filtersBySelectedCategory.length);
// #endregion

// #region Functions
async function onClickFilter(filterName: string) {
	const slugifiedFilter = slugifyString(filterName);

	mainStore.setFilter(slugifiedFilter);
	await router.push(`/projects/${mainStore.selected.category}/filter/${mainStore.selected.filter}`);
}
// #endregion

// #region Lifecycles
onMounted(async () => {
	const categorySlug = route.params.category;
	const filterSlug = route.params.filter;

	mainStore.setCategory(typeof categorySlug === "string" ? categorySlug : categorySlug[0]);
	mainStore.setFilter(typeof filterSlug === "string" ? filterSlug : filterSlug[0]);
});
// #endregion
</script>

<template>
	<div class="transition">
		<div class="transition__filters">
			<div
				v-for="filter of mainStore.filtersBySelectedCategory"
				:key="filter.id"
				class="transition__filter"
			>
				<div
					v-if="filter"
					class="transition__filter-image"
					@click="onClickFilter(filter.attributes.name)"
				>
					<img
						class="transition__filter-src"
						:src="filter.attributes.image || ''"
						alt=""
					/>
				</div>
				<h2
					class="transition__filter-name"
					@click="onClickFilter(filter.attributes.name)"
				>
					{{ filter.attributes.name }}
				</h2>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.transition {
	z-index: 100;
	position: relative;
	overflow: hidden;
	width: 100vw;
	min-height: 100vh;
	background-color: var(--color-white);
	padding: var(--padding-page-mobile);

	&__filters {
		display: grid;
		grid-gap: 30px;
		grid-template-rows: repeat(v-bind(filtersLength), 1fr);
		grid-template-columns: 1fr;
	}

	&__filter {
		width: 100%;

		&-image {
			cursor: pointer;
			overflow: hidden;
			width: 100%;
			height: 100%;
			max-height: 300px;
		}
		&-src {
			width: 100%;
			height: 100%;
			max-height: 300px;
			object-fit: cover;
			object-position: center;
		}
		&-name {
			cursor: pointer;
			margin-top: 15px;
			text-align: center;
			font-size: 30px;
		}
	}
}

@media (min-width: 768px) {
	.transition {
		display: flex;
		justify-content: center;
		align-items: center;

		&__filters {
			grid-template-rows: 1fr;
			grid-template-columns: repeat(v-bind(filtersLength), 1fr);
		}

		&__filter {
			display: flex;
			flex-direction: column;
		}
	}
}
</style>
