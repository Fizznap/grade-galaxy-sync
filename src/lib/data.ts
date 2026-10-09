import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { score, type StudentRow } from "./scoring";

export const studentsQuery = queryOptions({
  queryKey: ["students"],
  queryFn: async () => {
    const { data, error } = await supabase.from("students").select("*").order("name");
    if (error) throw error;
    return (data as unknown as StudentRow[]).map(score);
  },
});

export type Intervention = {
  id: string;
  student_id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  assigned_to: string;
  due_date: string | null;
  notes: string;
  created_at: string;
};

export const interventionsQuery = queryOptions({
  queryKey: ["interventions"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("interventions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Intervention[];
  },
});

export const importsQuery = queryOptions({
  queryKey: ["imports"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("data_imports")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export function avg(nums: number[]) {
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
}
