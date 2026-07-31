import gql from "graphql-tag";

const COLLECTION_TYPE_NEWS_QUERY = gql`
	query News {
		news(pagination: { limit: 100 }) {
			data {
				id
				attributes {
					address {
						name
						street
						cp
						city
					}
					date {
						date
						start
						end
					}
					email
					image {
						src {
							data {
								attributes {
									url
									alternativeText
									mime
								}
							}
						}
						copyright
						link
					}
					publishedAt
					register {
						src
					}
					text
					title
					website
				}
			}
		}
	}
`;

const COLLECTION_TYPE_CATEGORIES_QUERY = gql`
	query Categories {
		categories {
			data {
				attributes {
					index
					name
					placeholder {
						data {
							attributes {
								url
							}
						}
					}
					isLightTheme
					types {
						data {
							attributes {
								name
							}
						}
					}
					defaultLayout
				}
				id
			}
		}
	}
`;

const COLLECTION_TYPE_FILTERS_QUERY = gql`
	query Types {
		types {
			data {
				id
				attributes {
					index
					name
					categories {
						data {
							id
							attributes {
								name
							}
						}
					}
					image {
						data {
							attributes {
								url
								alternativeText
							}
						}
					}
					layout
				}
			}
		}
	}
`;

const COLLECTION_TYPE_PROJECTS_QUERY = gql`
	query Projects {
		projects(pagination: { limit: 100 }) {
			data {
				id
				attributes {
					index
					category {
						data {
							attributes {
								name
							}
							id
						}
					}
					date
					link {
						src
					}
					medias {
						copyright
						link
						src {
							data {
								attributes {
									alternativeText
									mime
									url
									formats
								}
							}
						}
						id
					}
					name
					text
					type {
						data {
							id
							attributes {
								name
							}
						}
					}
				}
			}
		}
	}
`;

const SINGLE_TYPE_ABOUT_QUERY = gql`
	query About {
		about {
			data {
				attributes {
					title
					socialNetworks {
						id
						link
					}
					cvLink
					practices {
						id
						title
						text
						image {
							id
							src {
								data {
									attributes {
										url
										alternativeText
										mime
									}
								}
							}
							copyright
							link
						}
					}
				}
			}
		}
	}
`;

export { COLLECTION_TYPE_NEWS_QUERY, COLLECTION_TYPE_CATEGORIES_QUERY, COLLECTION_TYPE_FILTERS_QUERY, COLLECTION_TYPE_PROJECTS_QUERY, SINGLE_TYPE_ABOUT_QUERY };
