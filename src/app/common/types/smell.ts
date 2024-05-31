export interface ISmell {
  file: string;
  type: string;
  smells: {
    startLine: number;
    endLine: number;
  }[];
  info: {
    itCount: number;
    describeCount: number;
  };
}
