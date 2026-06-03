export interface PassDto {
  id: number;
  userId: number;
  userName: string;
  reasonId: number;
  reasonName: string;
  statusId: number;
  statusName: string;
  validDate: string;
  comment: string | null;
  issuer: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface CreatePassDto {
  userId: number;
  reasonId: number;
  statusId: number;
  validDate: string;
  comment: string;
  issuer: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}