/** Matches the public.profiles table in the Supabase Schema Visualizer. */
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  email: string;
  bio: string | null;
};

/** Matches the public.recipe_likes table. */
export type RecipeLike = {
  id: string;
  created_at: string;
  user_id: string;
  recipe_id: string;
};

/** Matches the public.comments table. */
export type RecipeComment = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  recipe_id: string;
  body: string;
};

/** Matches the public.recipes table in the Supabase Schema Visualizer. */
export type Recipe = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  difficulty: string;
  category: string;
  image_url: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          username: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          bio?: string | null;
        };
        Update: {
          username?: string;
          full_name?: string;
          updated_at?: string;
          email?: string;
          bio?: string | null;
        };
        Relationships: [];
      };
      recipes: {
        Row: Recipe;
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          ingredients?: string[];
          instructions?: string;
          cooking_time: number;
          difficulty: string;
          category: string;
          image_url?: string | null;
        };
        Update: {
          title?: string;
          ingredients?: string[];
          instructions?: string;
          cooking_time?: number;
          difficulty?: string;
          category?: string;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_likes: {
        Row: RecipeLike;
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          recipe_id: string;
        };
        Update: {
          user_id?: string;
          recipe_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_likes_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: RecipeComment;
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          recipe_id: string;
          body: string;
        };
        Update: {
          body?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
