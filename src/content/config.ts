import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'data',
  schema: z.object({
    id:                 z.string(),
    name:               z.string(),
    slug:               z.string(),
    cas:                z.string(),
    ec:                 z.string().optional(),
    formula:            z.string(),
    mw:                 z.string(),
    category:           z.string(),
    industry:           z.array(z.string()),
    grade:              z.string(),
    moq:                z.string(),
    description:        z.string(),
    applications:       z.array(z.string()).default([]),
    physicalProperties: z.string().default(''),
    safetyHandling:     z.string().optional().default(''),
    tradeRegulatory:    z.string().optional().default(''),
    otherNames:         z.string().optional().default(''),
    compliance:         z.array(z.string()).default([]),
    packing:            z.array(z.string()).default([]),
    leadTime:           z.string(),
    imageUrl:           z.string().optional(),
    similarProducts:    z.array(z.string()).optional().default([]),
    ghsCodes:           z.array(z.string()).optional().default([]),
    hsCode:             z.string().optional().default(''),
    url:                z.string().optional(),
  }),
});

export const collections = { products };
