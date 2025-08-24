"use client";

import React from "react";
import {
  GitCommit,
  User,
  Calendar,
  ExternalLink,
  BarChart3,
} from "lucide-react";

interface CommitData {
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
  files: any[];
}

interface CommitInfoProps {
  commitData: CommitData;
}

export default function CommitInfo({ commitData }: CommitInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileStatusCounts = () => {
    const counts = {
      added: 0,
      modified: 0,
      removed: 0,
      renamed: 0,
    };

    commitData.files.forEach((file) => {
      if (file.status in counts) {
        counts[file.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getFileStatusCounts();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitCommit className="w-6 h-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">커밋 정보</h2>
              <p className="text-sm text-gray-600">
                {commitData.repository.full_name}
              </p>
            </div>
          </div>
          <a
            href={commitData.commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">GitHub에서 보기</span>
          </a>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 커밋 메시지 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">커밋 메시지</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-gray-800 whitespace-pre-wrap">
              {commitData.commit.message}
            </p>
          </div>
        </div>

        {/* SHA */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">커밋 SHA</h3>
          <code className="bg-gray-100 px-3 py-2 rounded font-mono text-sm">
            {commitData.commit.sha}
          </code>
        </div>

        {/* 작성자 정보 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              작성자
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">이름:</span>
                <span className="text-sm font-medium">
                  {commitData.commit.author.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">이메일:</span>
                <span className="text-sm">
                  {commitData.commit.author.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {formatDate(commitData.commit.author.date)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              커미터
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">이름:</span>
                <span className="text-sm font-medium">
                  {commitData.commit.committer.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">이메일:</span>
                <span className="text-sm">
                  {commitData.commit.committer.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {formatDate(commitData.commit.committer.date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            변경 통계
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <div className="text-sm text-green-600 font-medium">추가</div>
              <div className="text-2xl font-bold text-green-700">
                +{commitData.stats.additions}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <div className="text-sm text-red-600 font-medium">삭제</div>
              <div className="text-2xl font-bold text-red-700">
                -{commitData.stats.deletions}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">총 변경</div>
              <div className="text-2xl font-bold text-blue-700">
                {commitData.stats.total}
              </div>
            </div>
          </div>
        </div>

        {/* 파일 상태 요약 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">파일 변경 요약</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
              <span className="text-sm text-green-700 font-medium">추가됨</span>
              <span className="text-lg font-bold text-green-800">
                {statusCounts.added}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
              <span className="text-sm text-blue-700 font-medium">수정됨</span>
              <span className="text-lg font-bold text-blue-800">
                {statusCounts.modified}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
              <span className="text-sm text-red-700 font-medium">삭제됨</span>
              <span className="text-lg font-bold text-red-800">
                {statusCounts.removed}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-200">
              <span className="text-sm text-purple-700 font-medium">
                이름변경
              </span>
              <span className="text-lg font-bold text-purple-800">
                {statusCounts.renamed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
