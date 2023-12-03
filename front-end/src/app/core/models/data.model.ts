export interface IData {
  name: string;
  history: ISmokeHistory[];
  settings: SmokeSettings;
}

export type SmokeSettings =
  | {
      type: SigaretteType.Bag;
      cost: number;
      quantity: number; // grams
      filters: {
        cost: number;
        quantity: number;
      };
      papers: {
        cost: number;
        quantity: number;
      };
    }
  | {
      type: SigaretteType.Package;
      cost: number;
      quantity: number;
      filters:
        | {
            cost?: never;
            quantity?: never;
          }
        | never;
      papers:
        | {
            cost?: never;
            quantity?: never;
          }
        | never;
    };

export interface ISmokeHistory {
  id: string;
  date: Date;
  /**
   * @description Last sigarette of bag
   */
  outOfTobacco?: boolean;
}

export enum SigaretteType {
  Package = 'Package',
  Bag = 'Bag',
}
