<template>
	<div
		class="back"
		:class="{ 'back--light': lightTheme }"
		@click="props.onClick"
	>
		<div class="back__arrow">
			<img :src="lightTheme ? arrowBlack : arrowWhite" />
		</div>
		<div class="back__text">Back</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMainStore } from "@/store";

import arrowBlack from "@/assets/icons/arrow-black.svg";
import arrowWhite from "@/assets/icons/arrow-white.svg";

// #region Props
interface Props {
	onClick: () => void;
}

const props = defineProps<Props>();
// #endregion

// #region Dependencies
const mainStore = useMainStore();
// #endregion

// #region Computed
const lightTheme = computed<boolean>(() => mainStore.lightTheme);
// #endregion
</script>

<style scoped lang="scss">
.back {
	position: relative;
	display: flex;
	align-items: center;
	gap: 15px;
	margin-bottom: 30px;
	cursor: pointer;

	&:hover {
		.back__arrow {
			padding-right: 5px;
			img {
				margin-left: -5px;
			}
		}
	}

	&__arrow,
	&__text {
		display: flex;
		align-items: center;
	}

	&__arrow {
		transition: all 0.2s ease-in-out;

		img {
			transition: all 0.2s ease-in-out;
			height: 13px;
		}
	}
}
</style>
