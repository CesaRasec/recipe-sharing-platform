"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { toIngredientList } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export type RecipeFormState = {
  error: string | null;
};

const difficulties = new Set(["easy", "medium", "hard"]);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageBytes = 2 * 1024 * 1024;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseRecipeFields(formData: FormData) {
  const title = readString(formData, "title");
  const ingredients = toIngredientList(readString(formData, "ingredients"));
  const instructions = readString(formData, "instructions");
  const cookingTime = Number(readString(formData, "cooking_time"));
  const difficulty = readString(formData, "difficulty").toLowerCase();
  const category = readString(formData, "category");

  if (!title || ingredients.length === 0 || !instructions || !category) {
    return {
      error: "Please fill in the title, ingredients, instructions, and category.",
    } as const;
  }

  if (!Number.isInteger(cookingTime) || cookingTime < 1 || cookingTime > 1440) {
    return {
      error: "Cooking time must be a whole number of minutes between 1 and 1440.",
    } as const;
  }

  if (!difficulties.has(difficulty)) {
    return { error: "Choose easy, medium, or hard for difficulty." } as const;
  }

  return {
    error: null,
    values: {
      title,
      ingredients,
      instructions,
      cooking_time: cookingTime,
      difficulty,
      category,
    },
  } as const;
}

async function uploadRecipeImage(
  userId: string,
  recipeId: string,
  formData: FormData,
) {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { url: null as string | null, error: null as string | null };
  }

  if (!allowedImageTypes.has(image.type)) {
    return { url: null, error: "Please upload a JPG, PNG, WEBP, or GIF image." };
  }

  if (image.size > maxImageBytes) {
    return { url: null, error: "Images must be 2 MB or smaller." };
  }

  const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${recipeId}.${extension}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from("recipe-images").upload(path, image, {
    upsert: true,
    contentType: image.type,
  });

  if (error) {
    return {
      url: null,
      error: `${error.message} Run supabase/add_recipe_image.sql if the storage bucket is missing.`,
    };
  }

  const { data } = supabase.storage.from("recipe-images").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

function revalidateRecipe(id: string) {
  revalidatePath("/dashboard");
  revalidatePath("/recipes/mine");
  revalidatePath(`/recipes/${id}`);
  revalidatePath(`/recipes/${id}/edit`);
}

export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const parsed = parseRecipeFields(formData);
  if (parsed.error) {
    return { error: parsed.error };
  }

  const recipeId = crypto.randomUUID();
  const image = await uploadRecipeImage(user.id, recipeId, formData);
  if (image.error) {
    return { error: image.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("recipes").insert({
    id: recipeId,
    user_id: user.id,
    ...parsed.values,
    image_url: image.url,
  });

  if (error) {
    return {
      error: error.message ?? "Could not save the recipe. Check that you can insert into recipes.",
    };
  }

  revalidateRecipe(recipeId);
  redirect(`/recipes/${recipeId}`);
}

export async function updateRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const recipeId = readString(formData, "id");
  if (!recipeId) {
    return { error: "Missing recipe id." };
  }

  const parsed = parseRecipeFields(formData);
  if (parsed.error) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { data: existing, error: loadError } = await supabase
    .from("recipes")
    .select("id, user_id, image_url")
    .eq("id", recipeId)
    .maybeSingle();

  if (loadError || !existing || existing.user_id !== user.id) {
    return { error: "You can only edit your own recipes." };
  }

  const image = await uploadRecipeImage(user.id, recipeId, formData);
  if (image.error) {
    return { error: image.error };
  }

  const { error } = await supabase
    .from("recipes")
    .update({
      ...parsed.values,
      image_url: image.url ?? existing.image_url,
    })
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateRecipe(recipeId);
  redirect(`/recipes/${recipeId}`);
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) {
    return null;
  }
  const marker = "/recipe-images/";
  const index = url.indexOf(marker);
  if (index === -1) {
    return null;
  }
  return decodeURIComponent(url.slice(index + marker.length));
}

export async function deleteRecipe(formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const recipeId = readString(formData, "id");
  if (!recipeId) {
    redirect("/recipes/mine");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("recipes")
    .select("id, user_id, image_url")
    .eq("id", recipeId)
    .maybeSingle();

  if (!existing || existing.user_id !== user.id) {
    redirect("/recipes/mine");
  }

  const imagePath = storagePathFromPublicUrl(existing.image_url);
  if (imagePath) {
    await supabase.storage.from("recipe-images").remove([imagePath]);
  }

  await supabase.from("recipes").delete().eq("id", recipeId).eq("user_id", user.id);

  revalidateRecipe(recipeId);
  redirect("/recipes/mine");
}
