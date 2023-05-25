export interface QuestDocument {
  id: string;
  originalFilename: string;
  filename: string;
  type: string;
  createdAt: Date;
}

export const questDocumentDefaultValue: QuestDocument = {
  id: "",
  originalFilename: "",
  filename: "",
  type: "",
  createdAt: new Date(),
};
