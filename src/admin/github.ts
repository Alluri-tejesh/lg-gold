/**
 * The admin page saves straight into the website's GitHub repository with the owner's access key.
 * A push to main starts the normal "Build and Deploy" workflow, so changes go live in about 2 minutes.
 * All files from one save go into a single commit, so the site never builds a half-saved change.
 */

const API = 'https://api.github.com';
export const BRANCH = 'main';

export interface Auth {
  /** "owner/repository" */
  repo: string;
  token: string;
}

/** A message the admin page can show as it is. */
export class AdminError extends Error {}

/** The repository changed on GitHub since the page loaded it (for example the price form ran meanwhile). */
export class ConflictError extends AdminError {}

async function gh<T>(auth: Auth, path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${auth.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  } catch {
    throw new AdminError('Could not reach GitHub. Check your internet connection and try again.');
  }
  if (res.status === 401) throw new AdminError('The access key is not valid or has expired. Sign out and sign in with a new key.');
  if (res.status === 403 || res.status === 404) {
    const err = new AdminError(
      res.status === 404
        ? `GitHub could not find "${auth.repo}", or the access key is not allowed to see it.`
        : 'The access key is not allowed to do this. Give it "Contents: Read and write" for this repository.',
    );
    (err as AdminError & { status?: number }).status = res.status;
    throw err;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new AdminError(`GitHub said: ${(body as { message?: string }).message ?? res.statusText} (${res.status}).`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

const decodeBase64Utf8 = (b64: string): string => {
  const bin = atob(b64.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

/** Checks the key can change the repository. Returns nothing on success, throws an AdminError otherwise. */
export async function verifyAccess(auth: Auth): Promise<void> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(auth.repo)) throw new AdminError('Enter the repository as owner/name, for example lggold/lg-gold.');
  const repo = await gh<{ permissions?: { push?: boolean } }>(auth, `/repos/${auth.repo}`);
  if (!repo.permissions?.push) {
    throw new AdminError('This access key can read the repository but not change it. Give it "Contents: Read and write".');
  }
}

/** The commit main points at right now. */
export async function headSha(auth: Auth): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(auth, `/repos/${auth.repo}/git/ref/heads/${BRANCH}`);
  return ref.object.sha;
}

/** Reads a text file at a commit. Returns null when the file does not exist yet. */
export async function readText(auth: Auth, path: string, sha: string): Promise<string | null> {
  try {
    const file = await gh<{ content: string }>(auth, `/repos/${auth.repo}/contents/${path}?ref=${sha}`);
    return decodeBase64Utf8(file.content);
  } catch (e) {
    if ((e as { status?: number }).status === 404) return null;
    throw e;
  }
}

export type FileChange = { path: string; text: string } | { path: string; base64: string };

/** Saves all files as one commit on main and returns the new commit's id. */
export async function commitFiles(auth: Auth, parentSha: string, files: FileChange[], message: string): Promise<string> {
  const parent = await gh<{ tree: { sha: string } }>(auth, `/repos/${auth.repo}/git/commits/${parentSha}`);

  const tree = [];
  for (const f of files) {
    if ('text' in f) {
      tree.push({ path: f.path, mode: '100644', type: 'blob', content: f.text });
    } else {
      const blob = await gh<{ sha: string }>(auth, `/repos/${auth.repo}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: f.base64, encoding: 'base64' }),
      });
      tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
  }

  const newTree = await gh<{ sha: string }>(auth, `/repos/${auth.repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const commit = await gh<{ sha: string }>(auth, `/repos/${auth.repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [parentSha] }),
  });
  try {
    await gh(auth, `/repos/${auth.repo}/git/refs/heads/${BRANCH}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
  } catch (e) {
    // GitHub refuses a non fast-forward update when main moved on while we were saving.
    if (e instanceof AdminError && /fast forward|422/i.test(e.message)) {
      throw new ConflictError('The products changed on GitHub while you were saving. Reload the page and make your change again.');
    }
    throw e;
  }
  return commit.sha;
}

export type DeployState = 'building' | 'live' | 'failed' | 'unknown';

/**
 * Where the website rebuild for a commit has got to. Needs "Actions: Read" on the key;
 * without it the answer is "unknown" and the page just says it will be live in about 2 minutes.
 */
export async function deployState(auth: Auth, sha: string): Promise<{ state: DeployState; url?: string }> {
  try {
    const runs = await gh<{ workflow_runs: { path: string; status: string; conclusion: string | null; html_url: string }[] }>(
      auth,
      `/repos/${auth.repo}/actions/runs?head_sha=${sha}&per_page=10`,
    );
    const run = runs.workflow_runs.find((r) => r.path.endsWith('deploy.yml'));
    if (!run) return { state: 'building' }; // GitHub takes a few seconds to start the run
    if (run.status !== 'completed') return { state: 'building', url: run.html_url };
    // CI success does not prove the separate Node host has deployed the commit.
    return { state: run.conclusion === 'success' ? 'unknown' : 'failed', url: run.html_url };
  } catch {
    return { state: 'unknown' };
  }
}
