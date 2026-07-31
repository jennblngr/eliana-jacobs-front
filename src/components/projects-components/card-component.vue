<template>
	<div
		class="card"
		:class="{ 'card--light': !mainStore.themeMustBeLight }"
	>
		<div
			v-if="projectImage"
			class="card__image"
		>
			<img
				class="card__src"
				:src="projectImage"
				:alt="imageAlt"
				@click="onClickProjectCard(props.project.attributes.name)"
			/>
		</div>

		<h2
			class="card__title"
			@click="onClickProjectCard(props.project.attributes.name)"
		>
			{{ props.project.attributes.name }}
		</h2>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useMainStore } from "@/store";
import { useRouter } from "vue-router";

import { slugifyString } from "@/utils/slugify";
import type { Project } from "@/common/types";

// #region Dependencies
const mainStore = useMainStore();
const router = useRouter();
// #endregion

// #region Props
interface Props {
	project: Project;
}

const props = defineProps<Props>();
// #endregion

// #region Computed
const projectImage = computed<string>(() => {
	return props.project.attributes.medias?.length ? props.project.attributes.medias[0].src.data.attributes.url : ""
});
const imageAlt = computed<string>(() => {
	return projectImage.value ? `Cover picture of the project ${props.project.attributes.name}` : "There's no picture for this project";
});
// #endregion

// #region Functions
// Go to the page of the selected project.
async function onClickProjectCard(projectName: string): Promise<void> {
	mainStore.setProject(projectName);

	if (mainStore.selected.filter && mainStore.selected.filter !== "none") {
		await router.push(`/projects/${mainStore.selected.category}/filter/${mainStore.selected.filter}/project/${slugifyString(projectName)}`);
	} else {
		await router.push(`/projects/${mainStore.selected.category}/project/${slugifyString(projectName)}`);
	}
}
// #endregion
</script>

<style scoped lang="scss">
.card {
	cursor: pointer;
	width: 100%;
	padding: 5px 5px 0 5px;
	display: flex;
	flex-direction: column;
	row-gap: 5px;
	border: 1px solid var(--color-black);

	&:hover .card__src {
		scale: 1.05;
	}

	&:hover .card__title {
		color: var(--color-main);
	}

	&__image {
		overflow: hidden;
		width: 100%;
		height: 350px;
	}

	&__src {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: scale 0.2s ease-in-out;
	}

	&--light {
		border-color: var(--color-white);
	}
}
</style>
