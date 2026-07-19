import * as z from "zod";

export const aiProviderModelsResponseDtoSchema = z
  .object({
    models: z.array(z.string())
  })
  .transform(({ models }) => {
    return models;
  });
