import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commitUrl = searchParams.get("url");

    if (!commitUrl) {
      return NextResponse.json(
        { error: "Commit URL is required" },
        { status: 400 }
      );
    }

    // GitHub 커밋 URL에서 owner, repo, commit SHA 추출
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)\/commit\/([a-f0-9]+)/;
    const match = commitUrl.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub commit URL format" },
        { status: 400 }
      );
    }

    const [, owner, repo, commitSha] = match;

    // GitHub API를 통해 커밋 정보 가져오기
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Diff-Analyzer",
        },
      }
    );

    if (!commitResponse.ok) {
      if (commitResponse.status === 404) {
        return NextResponse.json(
          { error: "Commit not found" },
          { status: 404 }
        );
      }
      throw new Error(`GitHub API error: ${commitResponse.status}`);
    }

    const commitData = await commitResponse.json();

    // 파일별 diff 정보 가져오기
    const files = commitData.files || [];
    const processedFiles = files.map((file: any) => ({
      filename: file.filename,
      status: file.status, // added, modified, removed, renamed
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch || "", // diff 내용
      previous_filename: file.previous_filename,
      sha: file.sha,
      blob_url: file.blob_url,
    }));

    const result = {
      commit: {
        sha: commitData.sha,
        url: commitData.html_url,
        message: commitData.commit.message,
        author: {
          name: commitData.commit.author.name,
          email: commitData.commit.author.email,
          date: commitData.commit.author.date,
        },
        committer: {
          name: commitData.commit.committer.name,
          email: commitData.commit.committer.email,
          date: commitData.commit.committer.date,
        },
      },
      repository: {
        owner,
        repo,
        full_name: `${owner}/${repo}`,
      },
      stats: {
        total: commitData.stats?.total || 0,
        additions: commitData.stats?.additions || 0,
        deletions: commitData.stats?.deletions || 0,
      },
      files: processedFiles,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching commit data:", error);
    return NextResponse.json(
      { error: "Failed to fetch commit data" },
      { status: 500 }
    );
  }
}
