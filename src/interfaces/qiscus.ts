/* eslint-disable @typescript-eslint/no-explicit-any */
// Interface untuk objek di dalam array "comments"
interface Comment {
  id: number;
  before_id: number;
  message: string;
  username_as: string;
  username_real: string;
  email: string;
  user_extras: Record<string, any>;
  date: string;
  time: string;
  timestamp: string;
  unique_id: string;
  unique_temp_id: string;
  avatar: string;
  room_id: number;
  room_id_str: string;
  isChannel: boolean;
  unix_timestamp: number;
  unix_nano_timestamp: number;
  extras: Record<string, any>;
  is_deleted: boolean;
  isPending: boolean;
  isFailed: boolean;
  isDelivered: boolean;
  isRead: boolean;
  isSent: boolean;
  attachment: any | null;
  payload: Record<string, any>;
  status: string;
  type: string;
  subtype: string | null;
}

// Interface untuk objek di dalam array "participants"
interface Participant {
  active: boolean;
  avatar_url: string;
  email: string;
  extras: Record<string, any>;
  id: number;
  id_str: string;
  last_comment_read_id: number;
  last_comment_read_id_str: string;
  last_comment_received_id: number;
  last_comment_received_id_str: string;
  username: string;
}

// Interface untuk respons JSON utama
interface ChatRoomResponse {
  id: number;
  last_comment_id: number;
  last_comment_message: string;
  avatar: string;
  name: string;
  room_type: string;
  participants: Participant[];
  options: string;
  topics: any[];
  comments: Comment[];
  count_notif: number;
  isLoaded: boolean;
  custom_title: string | null;
  custom_subtitle: string | null;
  unique_id: string;
  isChannel: boolean;
  participantNumber: number;
}

// Interface untuk header request
interface RequestHeaders {
  "qiscus-sdk-platform": string;
  "qiscus-sdk-app-id": string;
  "qiscus-sdk-user-id": string;
  "qiscus-sdk-token": string;
  "qiscus-sdk-version": string;
}

// Interface untuk objek "req"
interface ApiRequest {
  method: string;
  url: string;
  headers: RequestHeaders;
}

// Interface untuk objek "error" di dalam "body"
interface ApiErrorBodyDetails {
  detailed_messages: string[];
  errors: Record<string, string[]>; // Objek dengan key dinamis
  message: string;
}

// Interface untuk objek "body"
interface ApiErrorBody {
  error: ApiErrorBodyDetails;
  status: number;
}

// Interface untuk objek "error" di level atas "response"
interface ApiClientError {
  status: number;
  method: string;
  url: string;
}

// Interface untuk header response
interface ResponseHeaders {
  "content-length": string;
  "content-type": string;
}

// Interface untuk objek "response"
interface ApiResponse {
  req: ApiRequest;
  xhr: Record<string, any>; // Tipe aman untuk objek kosong
  text: string; // Ini adalah 'body' dalam bentuk JSON string
  statusText: string;
  statusCode: number;
  status: number;
  statusType: number;
  info: boolean;
  ok: boolean;
  redirect: boolean;
  clientError: boolean;
  serverError: boolean;
  error: ApiClientError;
  created: boolean;
  accepted: boolean;
  noContent: boolean;
  badRequest: boolean;
  unauthorized: boolean;
  notAcceptable: boolean;
  forbidden: boolean;
  notFound: boolean;
  unprocessableEntity: boolean;
  headers: ResponseHeaders;
  header: ResponseHeaders;
  type: string;
  charset: string;
  links: Record<string, any>; // Tipe aman untuk objek kosong
  body: ApiErrorBody;
}

// Interface utama untuk seluruh respons
interface ApiErrorResponse {
  original: any | null;
  response: ApiResponse;
  status: number;
}

export type { ChatRoomResponse, Comment, Participant, ApiErrorResponse };