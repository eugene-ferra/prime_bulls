export default interface CreateImageDto {
  bucketName: string;
  id: number;
  options?: {
    width?: number | null;
    height?: number | null;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
}
