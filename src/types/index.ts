export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'Imagen';
  date: string;
  category: string;
  uri: string;
  size?: number;
  mimeType?: string;
}

export type RootStackParamList = {
  HomeTab: undefined;
  DocumentsTab: undefined;
  AddTab: undefined;
  Home: undefined;
  DocumentList: undefined;
  DocumentDetail: {document: Document};
};

