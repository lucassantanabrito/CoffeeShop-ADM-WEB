export interface DrinkOption {
  type: string;
  label: string;
  price: number;
  hasMilk: boolean;
}

export interface NewDrinkInput {
  label: string;
  price: number;
  hasMilk: boolean;
}
