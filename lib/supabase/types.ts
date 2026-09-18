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

/** Matches the public.recipes table in the Supabase Schema Visualizer. */
export type Recipe = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cooking_time: string;
  difficulty: string;
  category: string;
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
          bio: string;
        };
        Update: {
          username?: string;
          full_name?: string;
          updated_at?: string;
          email: string;
          bio: string;
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
          cooking_time: string;
          difficulty: string;
          category: string;
        };
        Update: {
          title?: string;
          ingredients?: string[];
          instructions?: string;
          cooking_time?: string;
          difficulty?: string;
          category?: string;
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
