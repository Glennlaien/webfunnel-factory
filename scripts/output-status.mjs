import { currentOutputsTarget, defaultRunsRoot, outputsLinkPath } from "./output-dir.mjs";

const target = currentOutputsTarget();

console.log(`outputs path: ${outputsLinkPath}`);
console.log(`current target: ${target || "(not configured)"}`);
console.log(`default runs root: ${defaultRunsRoot}`);
