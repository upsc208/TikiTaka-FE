declare interface CreateCategoryData {
  name: string;
}

declare interface Category {
  id: number;
  name: string;
  parentId: number | null;
  hasRequestForm?: boolean;
}

declare interface UpdateCategoryData {
  name: string;
}
