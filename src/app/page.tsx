"use client";

import React, { useState } from "react";
import { Search, Loader, AlertCircle, GitBranch } from "lucide-react";
import CommitInfo from "@/components/CommitInfo";
import DiffViewer from "@/components/DiffViewer";
import AnalysisPanel from "@/components/AnalysisPanel";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commitData, setCommitData] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("GitHub 커밋 URL을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setCommitData(null);
    setAnalyses([]);

    try {
      // GitHub 커밋 데이터 가져오기
      const response = await fetch(
        `/api/github/commit?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch commit data");
      }

      setCommitData(data);

      // AI 분석 시작
      setAnalyzing(true);
      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: data.files,
          commitMessage: data.commit.message,
        }),
      });

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || "Failed to analyze changes");
      }

      setAnalyses(analysisData.analyses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                AI 기반 커밋 변경사항 분석 도구
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 입력 폼 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                GitHub 커밋 URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/commit/sha"
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
                  <span>{loading ? "분석 중..." : "분석 시작"}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              예시:
              https://github.com/lux-02/qshing_pj/commit/ff81a4956f423aee82d6f15a34e59efad55de59c
            </p>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* 결과 영역 */}
        {commitData && (
          <div className="space-y-8">
            {/* 커밋 정보 */}
            <CommitInfo commitData={commitData} />

            {/* 파일별 변경사항 및 분석 */}
            {commitData.files.map((file: any, index: number) => (
              <div key={index} className="grid lg:grid-cols-2 gap-6">
                {/* Diff 뷰어 */}
                <div>
                  <DiffViewer
                    filename={file.filename}
                    patch={file.patch}
                    status={file.status}
                    additions={file.additions}
                    deletions={file.deletions}
                  />
                </div>

                {/* AI 분석 결과 */}
                <div>
                  {analyzing ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center">
                      <div className="text-center">
                        <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">
                          AI가 코드를 분석 중입니다...
                        </p>
                      </div>
                    </div>
                  ) : (
                    analyses.find(
                      (analysis: any) => analysis.filename === file.filename
                    ) && (
                      <AnalysisPanel
                        analysis={analyses.find(
                          (analysis: any) => analysis.filename === file.filename
                        )}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!commitData && !loading && (
          <div className="text-center py-16">
            <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              GitHub 커밋을 분석해보세요
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              GitHub 커밋 URL을 입력하면 AI가 변경사항을 자동으로 분석하고
              시각적으로 표시해드립니다.
            </p>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Powered by Google Gemini AI & GitHub API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
