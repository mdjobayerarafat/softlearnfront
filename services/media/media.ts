import { getBackendUrl } from '@services/config/config'

// Import the shared ensureCorrectImageUrl utility if available
const LEARNHOUSE_MEDIA_URL = process.env.NEXT_PUBLIC_LEARNHOUSE_MEDIA_URL

// Ensure URL has trailing slash for consistent path joining
function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

function getMediaUrl(): string {
  if (LEARNHOUSE_MEDIA_URL) {
    return ensureTrailingSlash(LEARNHOUSE_MEDIA_URL);
  } else {
    return ensureTrailingSlash(getBackendUrl());
  }
}

export function getCourseThumbnailMediaDirectory(
  orgUUID: string,
  courseUUID: string,
  fileId: string
): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseUUID}/thumbnails/${fileId}`;
}

export function getOrgLandingMediaDirectory(orgUUID: string, fileId: string): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/landing/${fileId}`;
}

export function getUserAvatarMediaDirectory(userUUID: string, fileId: string): string {
  return `${getMediaUrl()}content/users/${userUUID}/avatars/${fileId}`;
}

export function getActivityBlockMediaDirectory(
  orgUUID: string,
  courseId: string,
  activityId: string,
  blockId: any,
  fileId: any,
  type: string
): string {
  if (type === 'pdfBlock') {
    return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseId}/activities/${activityId}/dynamic/blocks/pdfBlock/${blockId}/${fileId}`;
  }
  if (type === 'videoBlock') {
    return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseId}/activities/${activityId}/dynamic/blocks/videoBlock/${blockId}/${fileId}`;
  }
  if (type === 'imageBlock') {
    return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseId}/activities/${activityId}/dynamic/blocks/imageBlock/${blockId}/${fileId}`;
  }
  return '';
}

export function getTaskRefFileDir(
  orgUUID: string,
  courseUUID: string,
  activityUUID: string,
  assignmentUUID: string,
  assignmentTaskUUID: string,
  fileID: string
): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseUUID}/activities/${activityUUID}/assignments/${assignmentUUID}/tasks/${assignmentTaskUUID}/${fileID}`;
}

export function getTaskFileSubmissionDir(
  orgUUID: string,
  courseUUID: string,
  activityUUID: string,
  assignmentUUID: string,
  assignmentTaskUUID: string,
  fileSubID: string
): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseUUID}/activities/${activityUUID}/assignments/${assignmentUUID}/tasks/${assignmentTaskUUID}/subs/${fileSubID}`;
}

export function getActivityMediaDirectory(
  orgUUID: string,
  courseUUID: string,
  activityUUID: string,
  fileId: string,
  activityType: string
): string {
  if (activityType === 'video') {
    return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseUUID}/activities/${activityUUID}/video/${fileId}`;
  }
  if (activityType === 'documentpdf') {
    return `${getMediaUrl()}content/orgs/${orgUUID}/courses/${courseUUID}/activities/${activityUUID}/documentpdf/${fileId}`;
  }
  return '';
}

export function getOrgLogoMediaDirectory(orgUUID: string, fileId: string): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/logos/${fileId}`;
}

export function getOrgThumbnailMediaDirectory(orgUUID: string, fileId: string): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/thumbnails/${fileId}`;
}

export function getOrgPreviewMediaDirectory(orgUUID: string, fileId: string): string {
  return `${getMediaUrl()}content/orgs/${orgUUID}/previews/${fileId}`;
}

// Utility for validating image URLs (debugging)
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    console.error(`Failed to verify image URL: ${url}`, error);
    return false;
  }
}