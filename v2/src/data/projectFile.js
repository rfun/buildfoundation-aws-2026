// The final-project deck (AWS Academy "GoGreen Insurance"), offered as a
// download rather than rebuilt as slides — students work in their own copy.
//
// The file is served from the site root under slides/, so it ships with the
// deployed build. `v2/public/slides/` is not used for it: the .pptx is a
// 21 MB binary and duplicating it into the build inputs would double what the
// repo carries. See the root-sync notes in CLAUDE.md — the rebuild must not
// delete slides/FinalProject.pptx.

export const projectFile = {
  week: 6,
  label: 'Project Slides',
  description: 'The GoGreen Insurance final-project brief, requirements, and solution worksheets.',
  path: 'slides/FinalProject.pptx',
  size: '21 MB',
}

// BASE_URL-aware, so the link survives the /buildfoundation-aws-2026/ subpath
// on GitHub Pages.
export const projectFileUrl = () => `${import.meta.env.BASE_URL}${projectFile.path}`
