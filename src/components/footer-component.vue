<script setup lang="ts">
import { computed } from "vue";
import { useMainStore } from "@/store";

// #region Dependencies
const mainStore = useMainStore();
// #endregion

// #region Computed
const themeMustBeLight = computed(() => mainStore.themeMustBeLight);
// #endregion
</script>

<template>
	<footer
		class="footer"
		:class="{ 'footer--light': themeMustBeLight }"
	>
		<!-- Credits -->
		<div class="footer__credits">
			<router-link to="/about"> EPJ </router-link>
			& JLB © {{ new Date().getFullYear() }}
		</div>

		<!-- Legal notices -->
		<div class="footer__notices">
			<router-link to="/legal-notices"> Legal notices </router-link>
		</div>
	</footer>
</template>

<style scoped lang="scss">
.footer {
	position: absolute;
	z-index: 900;
	width: 100vw;
	display: flex;
	justify-content: space-between;
	font-size: 12px;
	font-family: var(--font-primary);
	color: var(--color-text-dark);

	// Light theme
	&--light {
		color: var(--color-text-light);
	}

	// Credits and legal notices
	&__credits,
	&__notices {
		position: absolute;
		bottom: 30px;
		z-index: 150;
	}

	// Credits
	&__credits {
		left: 30px;
	}

	// Legal notices
	&__notices {
		right: 30px;
	}
}

// Responsive desktop
@media (min-width: 768px) {
	.footer {
		&__credits,
		&__notices {
			position: fixed;
		}
	}
}
</style>
