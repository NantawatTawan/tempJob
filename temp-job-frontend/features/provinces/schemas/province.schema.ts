export type Province = {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  amphure: Amphure[];
};

export type Amphure = {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tambon: Tambon[];
};

export type Tambon = {
  id: number;
  zip_code: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
