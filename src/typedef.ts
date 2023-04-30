export type Response<T> = {
  message: string;
  details: T
}

enum TagType {
  NUMBER = "NUMBER",
  TEXT = "TEXT",
  OPTIONS = "OPTIONS",
  QUANTITY = "QUANTITY",
  PESO = "PESO",
  MULTITEXT = "MULTITEXT"
}

export type Tag = {
  tag_key: string;
  tag_type: TagType,
  tag_default_value: string,
  tag_options: string[],
  organization_id: string,
  _id?: string
}

export type KeyValue = {
  key: string;
  values?: string[];
  default?: string;
  value?: string,
  type?: string
}