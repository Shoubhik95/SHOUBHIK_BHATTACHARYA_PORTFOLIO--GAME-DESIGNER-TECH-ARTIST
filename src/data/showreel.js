// SHOWREEL VIDEOS — edit this array to add, remove or change clips. No layout code needs to change.
// They appear as cards when the SHOWREEL tab is selected in the Projects section.
//
// Put your files in:  public/showreel/   (videos: .mp4 / .webm, thumbnails: .jpg / .webp / .png)
//
// title       shown on the card and in the player
// description optional short line (use "" for none)
// thumbnail   path to a 16:9 image ("" or a missing file shows an "Add thumbnail" placeholder)
// thumbPosition optional CSS object-position for cropping the thumbnail into 16:9 (default "center")
// videoSrc    path to the video file (a missing file shows an "Add video file" placeholder card that is not playable)
//
// To add a clip: copy the entry below, then set the title and the two paths.
export const showreel = [
  { title: "Intro", description: "",
    thumbnail: "public/showreel/intro-thumbnail.webp", thumbPosition: "50% 12%",
    videoSrc: "public/showreel/showreel.mp4" },
];
