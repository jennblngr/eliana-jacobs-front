<script setup lang="ts">
import { computed } from "vue";

import { useMainStore } from "@/store";

// #region Dependencies
const mainStore = useMainStore();
// #endregion

// #region Computed
const imagePlaceholder = computed<string>(() => {
	// Early return if there's no category selected.
	if (!mainStore.selected.category) {
		return "";
	}

	const selectedCategory = mainStore.collectionTypes.categories?.[mainStore.selected.category];

	if (!selectedCategory) {
		return "";
	}

	// Return an empty string if there's no placeholder image.
	return selectedCategory.attributes.placeholder.data.attributes.url;
});
// #endregion
</script>

<template>
	<section class="placeholder">
		<div class="placeholder__text">
			Coming soon!
			<br />
			<br />
			Check back soon for upcoming projects!
		</div>

		<div class="placeholder__image">
			<img
				class="placeholder__src"
				:src="imagePlaceholder"
				alt="Image placeholder for the selected category"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
.placeholder {
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 130px 0;

	&__text {
		text-align: center;
		margin-bottom: 30px;
	}

	&__image {
		max-width: 50%;
	}

	&__src {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
</style>
