import { ISmell } from "@/app/common/types";
import { create } from "zustand";

type Store = {
  smells: ISmell[];
  add: (smells: ISmell[]) => void;
};

const useSmellStore = create<Store>()((_set) => ({
  smells: [],
  add: (smells: ISmell[]) => {
    _set({ smells });
  },
}));

export default useSmellStore;
