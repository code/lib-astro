import { defineCollection, z, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { loader } from '../loaders/post-loader.js';

const blog = defineCollection({
	loader: loader({ url: 'https://jsonplaceholder.typicode.com/posts' }),
});

const dogs = defineCollection({
	loader: file('src/data/dogs.json'),
	schema: z.object({
		breed: z.string(),
		id: z.string(),
		size: z.string(),
		origin: z.string(),
		lifespan: z.string(),
		temperament: z.array(z.string()),
	}),
});

const cats = defineCollection({
	loader: async function () {
		return [
			{
				breed: 'Siamese',
				id: 'siamese',
				size: 'Medium',
				origin: 'Thailand',
				lifespan: '15 years',
				temperament: ['Active', 'Affectionate', 'Social', 'Playful'],
			},
			{
				breed: 'Persian',
				id: 'persian',
				size: 'Medium',
				origin: 'Iran',
				lifespan: '15 years',
				temperament: ['Calm', 'Affectionate', 'Social'],
			},
			{
				breed: 'Tabby',
				id: 'tabby',
				size: 'Medium',
				origin: 'Egypt',
				lifespan: '15 years',
				temperament: ['Curious', 'Playful', 'Independent'],
			},
			{
				breed: 'Ragdoll',
				id: 'ragdoll',
				size: 'Medium',
				origin: 'United States',
				lifespan: '15 years',
				temperament: ['Calm', 'Affectionate', 'Social'],
			},
		];
	},
	schema: z.object({
		breed: z.string(),
		id: z.string(),
		size: z.string(),
		origin: z.string(),
		lifespan: z.string(),
		temperament: z.array(z.string()),
	}),
});

// Absolute paths should also work
const absoluteRoot = new URL('../../content-outside-src', import.meta.url);

const spacecraft = defineCollection({
	loader: glob({ pattern: '*.md', base: absoluteRoot }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			publishedDate: z.coerce.date(),
			tags: z.array(z.string()),
			heroImage: image().optional(),
			cat: reference('cats').optional(),
		}),
});

const numbers = defineCollection({
	loader: glob({ pattern: 'src/data/glob-data/*', base: '.' }),
});

const increment = defineCollection({
	loader: {
		name: 'increment-loader',
		load: async ({ store }) => {
			const entry = store.get<{lastValue: number}>('value');
			const lastValue = entry?.data.lastValue ?? 0;
			store.set({
				id: 'value',
				data: {
					lastValue: lastValue + 1,
					lastUpdated: new Date(),
				},
			});
		},
		// Example of a loader that returns an async schema function
		schema: async () => z.object({
			lastValue: z.number(),
			lastUpdated: z.date(),
		}),
	},

});

export const collections = { blog, dogs, cats, numbers, spacecraft, increment };
