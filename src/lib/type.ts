
export type MisskeyFile = {
  checked?: boolean;
  id: string;
  createdAt: string;
  name: string;
  type: string;
  md5: string;
  size: number;
  isSensitive: boolean;
  blurhash: string;
  properties: {
    width: number;
    height: number;
  };
  url: string;
  thumbnailUrl: string;
  comment: string | null;
  folderId: string | null;
  folder: string | null;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    host: string | null;
    avaterUrl: string;
    avatarBlurhash: string;
    isBot: boolean;
    isCat: boolean;
    emojis: object;
    onlineStatus: string;
    badgeRoles: [];
  }
}