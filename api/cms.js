const REPO = process.env.GITHUB_REPO || "designfacesweden-sys/PartyV2";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const FILE_PATH = "public/cms.json";
const TOKEN = process.env.GITHUB_TOKEN;
const PUBLISH_SECRET =
  process.env.CMS_PUBLISH_SECRET ||
  process.env.VITE_ADMIN_PASSWORD ||
  "Partyhbg2026!?";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function unauthorized(res) {
  return json(res, 401, { error: "Unauthorized" });
}

function getBearer(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

async function githubRequest(method, urlPath, body) {
  if (!TOKEN) {
    const error = new Error("GITHUB_TOKEN saknas på servern.");
    error.status = 503;
    throw error;
  }

  const response = await fetch(`https://api.github.com${urlPath}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "partyhbg-cms",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const error = new Error(data?.message || `GitHub ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function readCmsFile() {
  const encodedPath = FILE_PATH.split("/").map(encodeURIComponent).join("/");
  try {
    const file = await githubRequest(
      "GET",
      `/repos/${REPO}/contents/${encodedPath}?ref=${encodeURIComponent(BRANCH)}`,
    );
    if (!file?.content) return { data: null, sha: file?.sha || null };
    const decoded = Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8");
    return { data: JSON.parse(decoded), sha: file.sha };
  } catch (error) {
    if (error.status === 404) return { data: null, sha: null };
    throw error;
  }
}

async function writeCmsFile(data, sha) {
  const encodedPath = FILE_PATH.split("/").map(encodeURIComponent).join("/");
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");
  return githubRequest("PUT", `/repos/${REPO}/contents/${encodedPath}`, {
    message: `Publish CMS ${new Date().toISOString()}`,
    content,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (req.method === "GET") {
      const { data } = await readCmsFile();
      if (!data) return json(res, 404, { error: "Ingen publicerad CMS ännu." });
      return json(res, 200, data);
    }

    if (req.method === "PUT") {
      if (getBearer(req) !== PUBLISH_SECRET) return unauthorized(res);

      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!payload || typeof payload !== "object" || !payload.site) {
        return json(res, 400, { error: "Ogiltig CMS-payload." });
      }

      const next = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      const { sha } = await readCmsFile();
      await writeCmsFile(next, sha);
      return json(res, 200, { ok: true, updatedAt: next.updatedAt });
    }

    return json(res, 405, { error: "Method not allowed" });
  } catch (error) {
    const status = error.status && error.status >= 400 ? error.status : 500;
    return json(res, status, {
      error: error.message || "Serverfel",
      details: error.data || undefined,
    });
  }
}
