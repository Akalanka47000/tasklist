import '@sliit-foss/zelebrate';

declare module '@sliit-foss/zelebrate' {
  namespace z {
    function objectId(): z.ZodString;
  }
}

export {};
