import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TaskSlice {
  selectedTask?: ITask;
  isTaskDialogOpen: boolean;
  isTaskDeleteDialogOpen: boolean;
  isTaskDependencyDialogOpen: boolean;
  openTaskDialogWithSelector: (arg: ITask) => void;
  openTaskDeleteDialogWithSelector: (arg: ITask) => void;
  openTaskDependencyDialogWithSelector: (arg: ITask) => void;
  setIsTaskDialogOpen: (arg: boolean) => void;
  setIsTaskDeleteDialogOpen: (arg: boolean) => void;
  setIsTaskDependencyDialogOpen: (arg: boolean) => void;
}

const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
  selectedTask: undefined,
  isTaskDialogOpen: false,
  isTaskDeleteDialogOpen: false,
  isTaskDependencyDialogOpen: false,
  openTaskDialogWithSelector: (arg) => set({ selectedTask: arg, isTaskDialogOpen: true }),
  openTaskDeleteDialogWithSelector: (arg) => set({ selectedTask: arg, isTaskDeleteDialogOpen: true }),
  openTaskDependencyDialogWithSelector: (arg) => set({ selectedTask: arg, isTaskDependencyDialogOpen: true }),
  setIsTaskDialogOpen: (arg) => set({ isTaskDialogOpen: arg, ...(arg ? {} : { selectedTask: undefined }) }),
  setIsTaskDeleteDialogOpen: (arg) => set({ isTaskDeleteDialogOpen: arg, ...(arg ? {} : { selectedTask: undefined }) }),
  setIsTaskDependencyDialogOpen: (arg) =>
    set({ isTaskDependencyDialogOpen: arg, ...(arg ? {} : { selectedTask: undefined }) })
});

export const useTaskStore = create<TaskSlice>()(devtools(createTaskSlice));

const initialState = useTaskStore.getState();

export const resetTaskStore = () => useTaskStore.setState(initialState);
