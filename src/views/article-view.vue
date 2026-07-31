
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { marked } from "marked";

import { useMainStore } from "@/store";
import { useRoute, useRouter } from "vue-router";

import emailIcon from "@/assets/icons/email.svg";
import linkIcon from "@/assets/icons/link.svg";
import localisationIcon from "@/assets/icons/localisation.svg";
import scheduleIcon from "@/assets/icons/schedule.svg";
import shapeBottom from "@/assets/images/shapes/article-01.png";

import ArrowBackComponent from "@/components/shared-components/arrow-back-component.vue";
import ButtonCustomComponent from "@/components/shared-components/button-custom-component.vue";
import MediaComponent from "@/components/shared-components/media-component.vue";

import { formatDate } from "@/utils/formatDate";
import { formatHour } from "@/utils/formatHour";

import type { Article } from "@/common/types";

// #region Dependencies
const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
// #endregion

// #region Constants
const GOOGLE_MAPS_LINK: Readonly<string> = "https://maps.google.com/?q=";
// #endregion

// #region Computed
const articleSlug = computed<string | undefined>(() => {
	const articleSlug = route.params.article;

	if (typeof articleSlug === "string") {
		return articleSlug;
	}

	return articleSlug.length > 0 ? articleSlug[0] : undefined;
})

const article = computed<Article | null>(() => {
	if (!mainStore.collectionTypes.news || !articleSlug.value) {
		return null;
	}
	
	mainStore.setArticle(articleSlug.value);
	
	// Get targeted article content with the slug.
	return mainStore.collectionTypes.news[articleSlug.value];
});

const publishedAt = computed<string>(() => {
	if (!article.value) {
		return "";
	}

	return `Posted ${formatDate(article.value.attributes.publishedAt)}`;
});

const eventDate = computed<string>(() => {
	if (!article.value) {
		return "";
	}

	let date = `${formatDate(article.value.attributes.date.date)}, ${formatHour(article.value.attributes.date.start)} `;

	if (article.value.attributes.date.end) {
		date += `to ${formatHour(article.value.attributes.date.end)}`;
	}

	return date;
});

const eventLocation = computed<string | null>(() => {
	if (!article.value || !article.value.attributes.address) {
		return null;
	}

	const addressName = article.value.attributes.address.name ? article.value.attributes.address.name + ", " : "";
	const streetName = article.value.attributes.address.street + ", ";
	const cp = article.value.attributes.address.cp + ", ";

	return `${addressName} ${streetName} ${cp} ${article.value.attributes.address.city}`;
});

const eventLocationLink = computed<string>(() => {
	

	return GOOGLE_MAPS_LINK + eventLocation.value;
});

const parsedText = computed<string>(() => {
	if (!article.value) {
		return "";
	}

	return marked(article.value.attributes.text);
});
// #endregion

// #region Functions
async function backToTheNewsPage(): Promise<void> {
	await router.push("/news");
}
// #endregion

// #region Lifecycles
onMounted(async () => {
	const articleSlug =  route.params.article;

	mainStore.setArticle(typeof articleSlug === "string" ? articleSlug : articleSlug[0]);
});
// #endregion
</script>

<template>
	<section class="article">
		<div v-if="article">
			<img
				class="article__shape"
				:src="shapeBottom"
				alt="Shape in the bottom of the site."
			/>

			<div class="article__container">
				<div class="article__header">
					<arrow-back-component :on-click="backToTheNewsPage" />

					<div class="article__header-text">
						<h1 class="article__header-title">
							{{ article.attributes.title }}
						</h1>

						<div class="article__header-date">
							{{ publishedAt }}
						</div>
					</div>
				</div>

				<div class="article__content">
					<div class="article__sidebar">
						<p
							class="article__sidebar-text"
							v-html="parsedText"
						/>

						<div class="article__sidebar-details">
							<div class="article__sidebar-detail">
								<img
									class="article__sidebar-icon"
									:src="scheduleIcon"
									alt="Schedule"
								/>
								<div class="article__sidebar-info">
									{{ eventDate }}
								</div>
							</div>

							<div
								v-if="eventLocation"
								class="article__sidebar-detail"
							>
								<img
									class="article__sidebar-icon"
									:src="localisationIcon"
									alt="Pin"
								/>
								<a
									:href="eventLocationLink"
									target="_blank"
								>
									<div class="article__sidebar-info">
										{{ eventLocation }}
									</div>
								</a>
							</div>

							<div
								v-if="article.attributes.email"
								class="article__sidebar-detail"
							>
								<img
									class="article__sidebar-icon"
									:src="emailIcon"
									alt="Envelop"
								/>
								<a :href="`mailto:${article.attributes.email}`">
									<div class="article__sidebar-info">
										{{ article.attributes.email }}
									</div>
								</a>
							</div>
						</div>

						<button-custom-component
							v-if="article.attributes.register"
							text="Register by email"
							:link="'mailto:' + article.attributes.register.email"
							:external="true"
						/>

						<div
							v-if="article.attributes.website"
							class="article__sidebar-link"
						>
							<img
								class="article__sidebar-icon"
								:src="linkIcon"
								alt="Link chain"
							/>
							<a
								class="article__sidebar-info"
								:href="article.attributes.website"
								target="_blank"
							>
								{{ article.attributes.website }}
							</a>
						</div>
					</div>

					<div class="article__image">
						<media-component
							:media="article.attributes.image"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Placeholder for the article page. -->
		<div v-else>
			Oops, an error occurred while fetching the article.
			<br />
			Try again later, and don't hesitate to contact me if the problem persists!
		</div>
	</section>
</template>

<style scoped lang="scss">
.article {
	min-height: 100vh;
	background: radial-gradient(circle at 81.06% 22.22%, #110f10, transparent 80%), radial-gradient(circle at 0.33% 9.55%, #110f10, transparent 60%),
		radial-gradient(circle at 79% 46%, #110f10, transparent 90%), radial-gradient(circle at 95.11% 84.11%, #110f10, transparent 100%),
		radial-gradient(circle at 63% 90.45%, #205251, transparent 31%), radial-gradient(circle at 50% 50%, #205251, #205251 100%);

	&__shape {
		position: absolute;
		width: 80%;
		max-width: 617px;
		bottom: 0;
		left: 0;
	}

	&__container {
		z-index: 10;
		position: relative;
	}

	&__header {
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		&-text {
			margin-bottom: 50px;
		}

		&-title {
			margin-bottom: 15px;
		}

		&-date {
			white-space: nowrap;
			line-height: 1.2rem;
		}
	}

	&__content {
		display: flex;
		flex-direction: column-reverse;
	}

	&__sidebar {
		width: 100%;
		margin-right: 15px;

		&-text {
			white-space: break-spaces;
		}

		&-details {
			margin-bottom: 50px;
		}

		&-detail,
		&-link {
			display: flex;
			align-items: center;
			margin: 25px 0;
		}

		&-icon {
			width: 20px;
			height: 20px;
			margin-right: 10px;
		}
	}

	&__image {
		flex-grow: 1;
		position: sticky;
		top: 30px;
		width: 100%;
		height: 100%;
		margin-bottom: 30px;
	}
}

@media (min-width: 768px) {
	.article {
		&__content {
			flex-direction: row;
		}

		&__header {
			&-title {
				max-width: 80%;
				hyphens: auto;
				white-space: pre-line;
			}

			&-text {
				display: flex;
				flex-direction: column;
			}

			&-date {
				margin-bottom: 0;
			}
		}

		&__sidebar,
		&__image {
			width: 50%;
		}

		&__image {
			margin-left: 15px;
			margin-bottom: 0;
		}
	}
}
</style>
