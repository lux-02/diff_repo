"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Loader, AlertCircle, GitBranch } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import CommitsList from "@/components/CommitsList";
import { RepositoryData, ProcessedCommit } from "@/types/github";

function HomeContent() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repoData, setRepoData] = useState<RepositoryData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 repo 값을 확인하여 자동 로드
  useEffect(() => {
    const repoParam = searchParams.get("repo");
    if (repoParam) {
      setUrl(repoParam);
      // 자동으로 레포지토리 로드
      loadRepository(repoParam);
    }
  }, [searchParams]);

  const loadRepository = async (repoUrl: string) => {
    setLoading(true);
    setError("");
    setRepoData(null);

    try {
      // GitHub 레포지토리 커밋 리스트 가져오기
      const response = await fetch(
        `/api/github/commits?repo=${encodeURIComponent(repoUrl)}&per_page=30`
      );
      const data: RepositoryData = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch repository data");
      }

      setRepoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("GitHub 레포지토리 URL을 입력해주세요.");
      return;
    }

    await loadRepository(url);
  };

  const handleCommitClick = (commit: ProcessedCommit) => {
    // 커밋 상세 페이지로 이동
    const owner = repoData?.repository.owner;
    const repo = repoData?.repository.repo;
    router.push(`/commit/${owner}/${repo}/${commit.sha}`);
  };

  return (
    <div className="page-container bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <GitBranch className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                GitHub Diff Analyzer
              </h1>
              <p className="text-sm text-gray-600">
                AI 기반 레포지토리 커밋 분석 도구
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 입력 폼 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                GitHub 레포지토리 URL
              </label>
              <div className="flex space-x-3 text-gray-800">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* 커밋 리스트 */}
        {repoData && (
          <div className="space-y-6">
            <CommitsList
              repository={repoData.repository}
              commits={repoData.commits}
              onCommitClick={handleCommitClick}
              loading={loading}
            />
          </div>
        )}

        {/* 빈 상태 */}
        {!repoData && !loading && (
          <div className="text-center py-16">
            <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              GitHub 레포지토리를 분석해보세요
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              GitHub 레포지토리 URL을 입력하면 커밋 히스토리를 확인하고 개별
              커밋을 AI로 분석할 수 있습니다.
            </p>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="footer bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              <a href="mailto:darkwinterlab@gmail.com">
                Copyright © darkwinterlab@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
