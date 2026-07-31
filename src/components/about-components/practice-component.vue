<script setup lang="ts">
import MediaComponent from "@/components/shared-components/media-component.vue";

import type { Practice } from "@/common/types";

// #region Props
interface Props {
	practice: Practice;
}

const props = defineProps<Props>();
// #endregion
</script>

<template>
	<div class="practice">
		<div
			class="practice__container"
		>
			<media-component :media="props.practice.image" />
		</div>

		<div class="practice__content">
			<h3 class="practice__title">
				{{ props.practice.title }}
			</h3>

			<p class="practice__text">
				{{ props.practice.text }}
			</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
.practice {
	display: flex;
	flex-wrap: wrap;

	&__container {
		width: 100%;
	}

	:deep(.image) {
		width: 100%;
	}

	&__text {
		white-space: pre-line;
	}
}

@media (min-width: 768px) {
	.practice {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		column-gap: var(--margin-x-elements);
		margin-bottom: var(--margin-y-elements);

		&__container {
			grid-column: 1 / 4;
			margin-right: var(--margin-x-elements);
			width: 100%;
		}

		&__content {
			grid-column: 4 / -1;
		}
	}
}
</style>
