import { NextRequest, NextResponse } from "next/server";
import { GitHubCommit, ProcessedCommit } from "@/types/github";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoUrl = searchParams.get("repo");
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "20";

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // GitHub 레포지토리 URL에서 owner와 repo 추출
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL format" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    // GitHub API를 통해 커밋 리스트 가져오기
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Diff-Analyzer",
        },
      }
    );

    if (!commitsResponse.ok) {
      if (commitsResponse.status === 404) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }
      throw new Error(`GitHub API error: ${commitsResponse.status}`);
    }

    const commitsData: GitHubCommit[] = await commitsResponse.json();

    // 커밋 정보 정리
    const processedCommits: ProcessedCommit[] = commitsData.map(
      (commit: GitHubCommit) => ({
        sha: commit.sha,
        shortSha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          date: commit.commit.author.date,
          avatar: commit.author?.avatar_url ?? null,
          username: commit.author?.login ?? null,
        },
        committer: {
          name: commit.commit.committer.name,
          email: commit.commit.committer.email,
          date: commit.commit.committer.date,
        },
        url: commit.html_url,
        stats: {
          total: commit.stats?.total || 0,
          additions: commit.stats?.additions || 0,
          deletions: commit.stats?.deletions || 0,
        },
        files: commit.files?.length || 0,
      })
    );

    const result = {
      repository: {
        owner,
        repo,
        full_name: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
      },
      commits: processedCommits,
      pagination: {
        page: parseInt(page),
        per_page: parseInt(perPage),
        has_next: processedCommits.length === parseInt(perPage),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching commits:", error);
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
