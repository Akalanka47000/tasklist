declare module 'joi' {
  interface Root {
    objectId: () => Schema;
  }
}

export {};
