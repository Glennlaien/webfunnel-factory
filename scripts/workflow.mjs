import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const routingPath = "configs/agent-routing.json";
const args = process.argv.slice(2);
const command = args[0] ?? "status";
const flags = parseFlags(args.slice(1));

const executableSteps = {
  "runtime-assembler": {
    description: "Generate the React Runtime template from the current config package.",
    command: [process.execPath, ["scripts/create-react-runtime-template.mjs"]]
  },
  "validate": {
    description: "Run repository validation gates.",
    command: [process.execPath, ["scripts/validate.mjs"]]
  },
  "app-build": {
    description: "Build the generated React app.",
    command: ["npm", ["run", "build", "--silent"]],
    cwd: "outputs/app"
  }
};

function parseFlags(items) {
  const parsed = { _: [] };

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item.startsWith("--")) {
      parsed._.push(item);
      continue;
    }

    const rawKey = item.slice(2);
    const equalsIndex = rawKey.indexOf("=");
    if (equalsIndex !== -1) {
      parsed[rawKey.slice(0, equalsIndex)] = rawKey.slice(equalsIndex + 1);
      continue;
    }

    const next = items[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[rawKey] = next;
      index += 1;
    } else {
      parsed[rawKey] = true;
    }
  }

  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function writeJson(filePath, value) {
  const absolute = path.join(root, filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  const absolute = path.join(root, filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, value);
}

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function normalize(filePath) {
  return filePath.split(path.sep).join("/");
}

function hasWildcard(pattern) {
  return pattern.includes("*");
}

function escapeRegex(value) {
  return value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

function globToRegex(pattern) {
  const normalized = normalize(pattern);
  let source = "^";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
    } else if (char === "*") {
      source += "[^/]*";
    } else {
      source += escapeRegex(char);
    }
  }

  source += "$";
  return new RegExp(source);
}

function walkFiles(dirPath, results = []) {
  if (!fs.existsSync(dirPath)) return results;

  for (const item of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (item.name === "node_modules" || item.name === ".git" || item.name === "dist") continue;

    const absolute = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      walkFiles(absolute, results);
    } else {
      results.push(normalize(path.relative(root, absolute)));
    }
  }

  return results;
}

let fileCache;

function allFiles() {
  fileCache ??= walkFiles(root);
  return fileCache;
}

function matches(pattern) {
  if (!hasWildcard(pattern)) return exists(pattern) ? [pattern] : [];
  const regex = globToRegex(pattern);
  return allFiles().filter((filePath) => regex.test(filePath));
}

function statusForPath(pattern) {
  const found = matches(pattern);
  return {
    path: pattern,
    ok: found.length > 0,
    matches: found
  };
}

function loadRouting() {
  if (!exists(routingPath)) {
    throw new Error(`Missing ${routingPath}`);
  }
  return readJson(routingPath);
}

function normalizeSequence(routing) {
  const sequence = [...routing.sequence];
  if (!sequence.includes("validate")) sequence.push("validate");
  if (!sequence.includes("app-build")) sequence.push("app-build");
  return sequence;
}

function stepDefinition(routing, stepId) {
  if (executableSteps[stepId]) {
    return {
      id: stepId,
      kind: "executable",
      ...(routing.agents?.[stepId] ?? {}),
      ...executableSteps[stepId]
    };
  }

  if (routing.agents?.[stepId]) {
    return {
      id: stepId,
      kind: "agent",
      ...routing.agents[stepId]
    };
  }

  return {
    id: stepId,
    kind: "missing"
  };
}

function outputsForStep(step) {
  if (step.outputs) return step.outputs;
  if (step.id === "validate") return ["outputs/qa/workflow-validation.json"];
  if (step.id === "app-build") return ["outputs/app/dist/index.html"];
  return [];
}

function inputsForStep(step) {
  if (step.inputs) return step.inputs;
  if (step.id === "validate") {
    return [
      "outputs/config/funnel.config.json",
      "outputs/design/theme.json",
      "outputs/app/index.html"
    ];
  }
  if (step.id === "app-build") {
    return [
      "outputs/app/package.json",
      "outputs/app/src/runtime/App.tsx"
    ];
  }
  return [];
}

function analyzeWorkflow() {
  const routing = loadRouting();
  const sequence = normalizeSequence(routing);
  const steps = sequence.map((stepId) => {
    const step = stepDefinition(routing, stepId);

    if (step.kind === "missing") {
      return {
        id: stepId,
        step,
        missingStep: true,
        complete: false,
        ready: false,
        blocked: true,
        inputs: [],
        outputs: []
      };
    }

    const inputs = inputsForStep(step).map(statusForPath);
    const outputs = outputsForStep(step).map(statusForPath);
    const inputsReady = inputs.every((item) => item.ok);
    const outputsReady = outputs.length > 0 && outputs.every((item) => item.ok);
    const stale = outputsReady && !inputsReady;
    const complete = inputsReady && outputsReady;

    return {
      id: stepId,
      step,
      kind: step.kind,
      inputs,
      outputs,
      inputsReady,
      complete,
      stale,
      ready: inputsReady && !complete,
      blocked: !inputsReady && !complete
    };
  });

  return {
    routing,
    sequence,
    steps,
    next: steps.find((step) => !step.complete)
  };
}

function printStatus() {
  const { steps, next } = analyzeWorkflow();

  console.log("Web2App workflow status\n");
  for (const item of steps) {
    const marker = item.complete ? "done" : item.stale ? "stale" : item.ready ? "ready" : "blocked";
    const kind = item.kind ? ` [${item.kind}]` : "";
    console.log(`${marker.padEnd(7)} ${item.id}${kind}`);

    if (item.missingStep) {
      console.log("        missing step config");
      continue;
    }

    const missingInputs = item.inputs.filter((entry) => !entry.ok);
    const missingOutputs = item.outputs.filter((entry) => !entry.ok);

    if (missingInputs.length) {
      console.log(`        missing inputs: ${missingInputs.map((entry) => entry.path).join(", ")}`);
    }
    if (missingOutputs.length) {
      console.log(`        missing outputs: ${missingOutputs.map((entry) => entry.path).join(", ")}`);
    }
  }

  console.log("");
  if (!next) {
    console.log("Next: workflow complete");
  } else if (next.ready) {
    console.log(`Next: ${next.id}`);
    if (next.kind === "agent") {
      console.log(`Run: npm run workflow:prompt -- ${next.id}`);
    } else {
      console.log(`Run: npm run workflow -- run --from ${next.id}`);
    }
  } else {
    console.log(`Next incomplete step is blocked: ${next.id}`);
    console.log(`Missing inputs: ${next.inputs.filter((entry) => !entry.ok).map((entry) => entry.path).join(", ")}`);
  }
}

function printNext() {
  const { next } = analyzeWorkflow();

  if (!next) {
    console.log("Workflow complete. All configured gates passed.");
    return;
  }

  if (!next.ready) {
    console.log(`Next incomplete step is blocked: ${next.id}`);
    console.log("");
    console.log("Missing inputs:");
    for (const input of next.inputs.filter((entry) => !entry.ok)) {
      console.log(`- ${input.path}`);
    }
    return;
  }

  console.log(`Next ready step: ${next.id}`);
  console.log(`Kind: ${next.kind}`);
  console.log("");

  if (next.kind === "agent") {
    printAgentSummary(next);
    console.log("");
    console.log(`Get the Codex prompt with: npm run workflow:prompt -- ${next.id}`);
  } else {
    console.log(next.step.description);
    console.log(`Run with: npm run workflow -- run --from ${next.id}`);
  }
}

function printAgentSummary(item) {
  console.log(`Prompt: ${item.step.prompt}`);
  console.log("Inputs:");
  for (const input of inputsForStep(item.step)) console.log(`- ${input}`);
  console.log("Outputs:");
  for (const output of outputsForStep(item.step)) console.log(`- ${output}`);
}

function resolveStep(stepId) {
  const analysis = analyzeWorkflow();
  const targetId = stepId || analysis.next?.id;
  if (!targetId) return undefined;
  return analysis.steps.find((step) => step.id === targetId);
}

function printPrompt(stepId) {
  const item = resolveStep(stepId);

  if (!item) {
    console.log("Workflow complete. No next prompt needed.");
    return;
  }

  if (item.kind !== "agent") {
    console.log(`# ${item.id} is executable`);
    console.log("");
    console.log(item.step.description);
    console.log("");
    console.log(`Run: npm run workflow -- run --from ${item.id}`);
    return;
  }

  const missingInputs = item.inputs.filter((entry) => !entry.ok);
  if (missingInputs.length) {
    console.log(`# ${item.id} is blocked`);
    console.log("");
    console.log("Missing inputs:");
    for (const input of missingInputs) console.log(`- ${input.path}`);
    return;
  }

  console.log(`Use ${item.step.prompt}.`);
  console.log("");
  console.log("Read these inputs:");
  for (const input of inputsForStep(item.step)) console.log(`- ${input}`);
  console.log("");
  console.log("Write only these outputs:");
  for (const output of outputsForStep(item.step)) console.log(`- ${output}`);
  console.log("");
  console.log("Follow the role prompt exactly. Do not modify files outside the listed outputs. If a required input is missing or contradictory, stop and report the blocker instead of guessing.");
}

function runCommand(commandSpec, cwd = ".") {
  const [bin, commandArgs] = commandSpec;
  const result = spawnSync(bin, commandArgs, {
    cwd: path.join(root, cwd),
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.stdout.trim()) console.log(result.stdout.trim());
  if (result.stderr.trim()) console.error(result.stderr.trim());

  if (result.status !== 0) {
    throw new Error(`Command failed: ${bin} ${commandArgs.join(" ")}`);
  }
}

function runExecutableStep(item) {
  console.log(`Running ${item.id}: ${item.step.description}`);
  runCommand(item.step.command, item.step.cwd);

  if (item.id === "validate") {
    writeJson("outputs/qa/workflow-validation.json", {
      status: "passed",
      generatedAt: new Date().toISOString(),
      command: "node scripts/validate.mjs"
    });
  }
}

function runWorkflow() {
  const startFrom = flags.from || flags._[0];
  const maxSteps = Number(flags["max-steps"] ?? 100);
  let stepsRun = 0;

  while (stepsRun < maxSteps) {
    fileCache = undefined;
    const analysis = analyzeWorkflow();
    const next = startFrom && stepsRun === 0
      ? analysis.steps.find((item) => item.id === startFrom)
      : analysis.next;

    if (!next) {
      console.log("Workflow complete.");
      return;
    }

    if (!next.ready) {
      console.log(`Blocked at ${next.id}.`);
      for (const input of next.inputs.filter((entry) => !entry.ok)) {
        console.log(`- Missing input: ${input.path}`);
      }
      process.exit(1);
    }

    if (next.kind === "agent") {
      console.log(`Stopped before agent step: ${next.id}`);
      console.log("");
      printPrompt(next.id);
      return;
    }

    runExecutableStep(next);
    stepsRun += 1;
  }

  throw new Error(`Stopped after --max-steps=${maxSteps}`);
}

function validateWorkflow() {
  const { routing, sequence, steps } = analyzeWorkflow();
  const errors = [];

  for (const item of steps) {
    if (item.missingStep) {
      errors.push(`Missing workflow config for '${item.id}'`);
      continue;
    }

    if (item.kind === "agent" && !exists(item.step.prompt)) {
      errors.push(`Missing prompt for '${item.id}': ${item.step.prompt}`);
    }

    for (const output of outputsForStep(item.step)) {
      if (!output.startsWith("outputs/")) {
        errors.push(`Step '${item.id}' output must stay under outputs/: ${output}`);
      }
    }
  }

  if (!sequence.includes("image-planner")) {
    errors.push("Workflow sequence must include image-planner before image-asset-generator");
  } else if (sequence.includes("image-asset-generator")) {
    const plannerIndex = sequence.indexOf("image-planner");
    const generatorIndex = sequence.indexOf("image-asset-generator");
    if (plannerIndex > generatorIndex) {
      errors.push("image-planner must run before image-asset-generator");
    }
  }

  if (!sequence.includes("image-asset-generator")) {
    errors.push("Workflow sequence must include image-asset-generator before config-builder");
  } else if (sequence.includes("config-builder")) {
    const imageIndex = sequence.indexOf("image-asset-generator");
    const configIndex = sequence.indexOf("config-builder");
    if (imageIndex > configIndex) {
      errors.push("image-asset-generator must run before config-builder");
    }
  }

  if (sequence.includes("design-handoff") && sequence.includes("runtime-assembler")) {
    if (sequence.indexOf("design-handoff") > sequence.indexOf("runtime-assembler")) {
      errors.push("design-handoff must run before runtime-assembler");
    }
  }

  for (const agentId of Object.keys(routing.agents ?? {})) {
    if (!routing.sequence.includes(agentId)) {
      errors.push(`Agent '${agentId}' is configured but not included in sequence`);
    }
  }

  const runtime = spawnSync(process.execPath, ["scripts/validate-runtime.mjs"], {
    cwd: root,
    encoding: "utf8"
  });

  if (runtime.stdout.trim()) console.log(runtime.stdout.trim());
  if (runtime.stderr.trim()) console.error(runtime.stderr.trim());
  if (runtime.status !== 0) errors.push("Runtime validation failed");

  if (errors.length) {
    console.error("Workflow validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("Workflow validation passed");
}

function initProductInput() {
  const productName = flags["product-name"] || flags.product || "";
  const appUrl = flags["app-url"] || flags.url || "";
  const notes = flags.notes || "";

  if (!productName && !appUrl && !notes) {
    throw new Error("Provide at least one of --product-name, --app-url, or --notes");
  }

  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.mkdirSync(path.join(root, "inputs/references"), { recursive: true });

  const lines = [
    "# Product Brief Input",
    "",
    "## Raw Product Input",
    ""
  ];

  if (productName) lines.push(`Product name: ${productName}`);
  if (appUrl) lines.push(`App Store URL: ${appUrl}`);
  if (notes) lines.push("", "Notes:", notes);
  lines.push("");

  writeText("inputs/product-brief.md", lines.join("\n"));
  console.log("Wrote inputs/product-brief.md");
}

function doctor() {
  validateWorkflow();
  console.log("");
  printStatus();
}

function printHelp() {
  console.log(`Web2App workflow orchestrator

Usage:
  npm run workflow
  npm run workflow -- status
  npm run workflow -- next
  npm run workflow -- prompt [step-id]
  npm run workflow -- run [--from step-id]
  npm run workflow -- validate
  npm run workflow -- doctor
  npm run workflow -- init --product-name "Name" --app-url "https://..."

Shortcuts:
  npm run workflow:status
  npm run workflow:next
  npm run workflow:prompt -- [step-id]
  npm run workflow:validate
  npm run workflow:init -- --product-name "Name" --app-url "https://..."
`);
}

try {
  if (command === "status") {
    printStatus();
  } else if (command === "next") {
    printNext();
  } else if (command === "prompt") {
    printPrompt(flags._[0]);
  } else if (command === "run") {
    runWorkflow();
  } else if (command === "validate") {
    validateWorkflow();
  } else if (command === "doctor") {
    doctor();
  } else if (command === "init") {
    initProductInput();
  } else if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
  } else {
    throw new Error(`Unknown workflow command: ${command}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
