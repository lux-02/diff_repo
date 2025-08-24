"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  GitCommit,
  ExternalLink,
} from "lucide-react";
import CommitInfo from "@/components/CommitInfo";
import DiffViewer from "@/components/DiffViewer";
import AnalysisPanel from "@/components/AnalysisPanel";

export default function CommitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [commitData, setCommitData] = useState(null);
  const [analyses, setAnalyses] = useState([]);

  // URL 파라미터에서 owner, repo, sha 추출
  const paramsArray = Array.isArray(params.params) ? params.params : [];
  const [owner, repo, sha] = paramsArray;

  useEffect(() => {
    if (owner && repo && sha) {
      fetchCommitData();
    } else {
      setError("잘못된 URL 형식입니다.");
      setLoading(false);
    }
  }, [owner, repo, sha]);

  const fetchCommitData = async () => {
    try {
      setLoading(true);
      setError("");

      const commitUrl = `https://github.com/${owner}/${repo}/commit/${sha}`;

      // GitHub 커밋 데이터 가져오기
      const response = await fetch(
        `/api/github/commit?url=${encodeURIComponent(commitUrl)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch commit data");
      }

      setCommitData(data);

      // AI 분석 시작
      if (data.files && data.files.length > 0) {
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

        if (analysisResponse.ok) {
          setAnalyses(analysisData.analyses);
        } else {
          console.error("Analysis failed:", analysisData.error);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">커밋 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                오류 발생
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleGoBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                뒤로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>뒤로</span>
              </button>
              <div className="flex items-center space-x-3">
                <GitCommit className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    커밋 상세 분석
                  </h1>
                  {commitData && (
                    <p className="text-sm text-gray-600">
                      {commitData.repository.full_name} • {sha?.substring(0, 7)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {commitData && (
              <a
                href={commitData.commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">GitHub에서 보기</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  );
}
