export type ChangelogDownloadLink = {
  url: string;
  label: string;
};

export type ChangelogReleaseItem = {
  version: string;
  date: string;
  dateIso?: string;
  paragraphs: string[];
  downloads?: ChangelogDownloadLink[];
  notesLanguageHint?: string;
};
