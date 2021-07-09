export interface IAllowedImageType {
    extension: string;
    mimeType: string;
}

export const ALLOWED_IMAGE_TYPES: IAllowedImageType[] = [
    {
        extension: 'jpg',
        mimeType: 'image/jpg',
    },
    {
        extension: 'jpeg',
        mimeType: 'image/jpeg',
    },
    {
        extension: 'png',
        mimeType: 'image/png',
    },
    {
        extension: 'gif',
        mimeType: 'image/gif',
    },
];
