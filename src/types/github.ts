// GitHub API 응답 타입 정의
export interface GitHubFile {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
  sha: string;
  blob_url: string;
}

export interface GitHubCommit {
  sha: string;
  url: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
  stats?: {
    total: number;
    additions: number;
    deletions: number;
  };
  files?: GitHubFile[];
}

export interface CommitData {
  commit: {
    sha: string;
    url: string;
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  repository: {
    owner: string;
    repo: string;
    full_name: string;
  };
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  files: GitHubFile[];
}

export interface ProcessedCommit {
  sha: string;
  shortSha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar: string | null;
    username: string | null;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  files: number;
}

export interface RepositoryData {
  repository: {
    owner: string;
    repo: string;
    full_name: string;
    url: string;
  };
  commits: ProcessedCommit[];
  pagination: {
    page: number;
    per_page: number;
    has_next: boolean;
  };
}

export interface AnalysisChange {
  type: string;
  line: string;
  lineNumber?: number;
}

export interface Analysis {
  filename: string;
  status: string;
  additions?: number;
  deletions?: number;
  analysis: string;
  summary: string;
  impact: "high" | "medium" | "low" | "unknown";
  changes: AnalysisChange[];
}
