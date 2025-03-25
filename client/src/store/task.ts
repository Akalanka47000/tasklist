import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TaskSlice {
  selectedTask?: ITask;
  isTaskDialogOpen: boolean;
  isTaskDeleteDialogOpen: boolean;
  openTaskDialogWithSelector: (arg: ITask) => void;
  openTaskDeleteDialogWithSelector: (arg: ITask) => void;
  setIsTaskDialogOpen: (arg: boolean) => void;
  setIsTaskDeleteDialogOpen: (arg: boolean) => void;
}

const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
  selectedTask: undefined,
  isTaskDialogOpen: false,
  isTaskDeleteDialogOpen: false,
  openTaskDialogWithSelector: (arg) => set({ selectedTask: arg, isTaskDialogOpen: true }),
  openTaskDeleteDialogWithSelector: (arg) => set({ selectedTask: arg, isTaskDeleteDialogOpen: true }),
  setIsTaskDialogOpen: (arg) => set({ isTaskDialogOpen: arg, ...(arg ? {} : { selectedTask: undefined }) }),
  setIsTaskDeleteDialogOpen: (arg) => set({ isTaskDeleteDialogOpen: arg, ...(arg ? {} : { selectedTask: undefined }) })
});

export const useTaskStore = create<TaskSlice>()(devtools(createTaskSlice));

const initialState = useTaskStore.getState();

export const resetTaskStore = () => useTaskStore.setState(initialState);
