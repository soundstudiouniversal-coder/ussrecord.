
import { z } from 'zod';

export const DemoSchema = z.object({
  artistName: z.string().min(2, { message: "Artist name must be at least 2 characters." }),
  soundcloudLink: z.string().url({ message: "Please enter a valid URL." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});
export type DemoSubmission = z.infer<typeof DemoSchema> & { id: string; submittedAt: string; submitterId: string; };


export const ContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});
export type ContactMessage = z.infer<typeof ContactSchema> & { id: string; submittedAt: string; submitterId: string; };


export const ArtistSchema = z.object({
  name: z.string().min(2, { message: "Artist name must be at least 2 characters." }),
  link: z.string().url({ message: "Please enter a valid external link." }),
});
export type Artist = z.infer<typeof ArtistSchema> & { id: string; createdAt: string; };


export const ReleaseSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  artist: z.string().min(2, { message: "Artist name must be at least 2 characters." }),
  link: z.string().url({ message: "Please enter a valid streaming link." }),
});
export type Release = z.infer<typeof ReleaseSchema> & { id: string; createdAt: string; };


export const PlaylistSchema = z.object({
  name: z.string().min(2, { message: "Playlist name must be at least 2 characters." }),
  link: z.string().url({ message: "Please enter a valid streaming link." }),
});
export type Playlist = z.infer<typeof PlaylistSchema> & { id: string; createdAt: string; };
